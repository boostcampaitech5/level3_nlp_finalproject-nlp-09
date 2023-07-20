import uvicorn
import tempfile
import shutil
import os
import sys
from typing import Union
import asyncio

from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from datetime import timedelta
from pydantic import BaseModel

# database
from database import SessionLocal
from models import User, History, QnA
from crud import *
from dependency import *
from sqlalchemy.orm import Session

# audio_processing
sys.path.append('./')  # nopep8
sys.path.append('./ml_functions')  # nopep8
from ml_functions.stt import transcribe, transcribe_async, transcribe_test
from ml_functions.summary import summarize, summarize_async, summarize_test
from ml_functions.qna import questionize, questionize_async, questionize_test

# login
from login import get_current_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES


app = FastAPI()
templates = Jinja2Templates(directory="../src")

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class User(BaseModel):
    user_id: str
    password: str = None


@app.get("/")
def get_root(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})


@app.post("/")
def login_or_signup(request: Request, login_or_signup: str = Form(...)):
    if login_or_signup == "login":
        return RedirectResponse(url="/login", status_code=303)
    elif login_or_signup == "signup":
        return RedirectResponse(url="/signup", status_code=303)


@app.post("/token")
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
async def login_for_access_token(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user is None or user.password != posted_user_info.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires)

    # user_id = await get_current_user(access_token)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/id_validation")
async def id_validation(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user == None:
        return {"type": False, "message": "invalid user id"}
    return {"type": True, "message": "valid user id"}


@app.post("/login")
async def login_validation(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user == None or user.password != posted_user_info.password:
        return {"type": False, "message": "wrong password"}

    return {"type": True, "message": "login success"}


@app.get("/logout")
async def logout(request: Request):
    response = templates.TemplateResponse(
        "login_test.html", {"request": request})
    response.delete_cookie(key="access_token")
    return response


@app.get("/signup")
def get_signup_form(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@app.post("/signup/id_validation")
def signup_id_validation(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user != None:
        return {"type": False, "message": "already exist user id"}

    return {"type": True, "message": "valid user id"}


@app.post("/signup")
def signup(posted_user_info: User, db: Session = Depends(get_db)):
    user_info = schemas.User(
        user_id=posted_user_info.user_id, password=posted_user_info.password)
    create_user(db, user_info)
    # 토큰 생성
    return {"type": True, "message": "signup success"}


@app.get("/home/{user_id}")
async def get_histories(request: Request, user_id: str, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    histories = get_user_histories(db, user_id)
    history = None
    qnas = None
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories, "history": history, "qnas": qnas})


async def background_process(audio, db, new_history, new_qna):
    audio_format = '.' + audio.filename.split('.')[-1]
    audio_name = audio.filename[:-len(audio_format)]
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=audio_format)
    with open(temp_audio.name, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    title = audio_name
    change_title_task = asyncio.create_task(
        asyncio.to_thread(change_history_title, db, new_history, title)
    )
    new_history = await change_title_task

    transcription_task = asyncio.create_task(transcribe_async(temp_audio.name))
    transcription = await transcription_task
    change_transcription_task = asyncio.create_task(
        asyncio.to_thread(change_history_transcription,
                          db, new_history, transcription)
    )
    new_history = await change_transcription_task

    summary_task = asyncio.create_task(summarize_async(transcription))
    summary_list, summary = await summary_task
    change_summary_task = asyncio.create_task(
        asyncio.to_thread(change_history_summary, db, new_history, summary)
    )
    new_history = await change_summary_task

    qna_task = asyncio.create_task(questionize_async(summary_list, summary))
    questions, answers = await qna_task
    for question, answer in zip(questions, answers):
        if new_qna.question == "loading...":
            delete_qna_task = asyncio.create_task(
                asyncio.to_thread(delete_history_qna, db, new_qna)
            )
            await delete_qna_task
        temp_qna = schemas.QnA(
            question=question, answer=answer, history_id=new_history.history_id
        )
        create_qna_task = asyncio.create_task(
            asyncio.to_thread(create_qna, db, temp_qna)
        )
        new_qna = await create_qna_task

    temp_audio.close()
    os.remove(temp_audio.name)


@app.post("/home/{user_id}")
async def create_history(user_id: str, audio: UploadFile = File(...), db: Session = Depends(get_db)):
    empty_history = schemas.History(
        title="loading...", transcription="loading...", summary="loading..."
    )
    new_history = create_user_history(db, empty_history, user_id)

    empty_qna = schemas.QnA(
        question="loading...", answer="loading...", history_id=new_history.history_id
    )
    new_qna = create_qna(db, empty_qna)

    await background_process(audio, db, new_history, new_qna)

    return {"user_id": user_id,
            "history_list": get_user_histories(db, user_id),
            "history": get_history_by_id(db, new_history.history_id),
            "qnas": get_history_qnas(db, new_history.history_id)
            }


@app.get("/home/{user_id}/transcription")
async def get_transcription(request: Request, user_id: str, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})

    temp_history = schemas.History(
        title="test", transcription="test", summary="test", qnas=[])
    new_history = create_user_history(db, temp_history, user_id)

    for i in range(3):
        temp_qna = schemas.QnA(question=f"test{i}",
                               answer=f"test{i}", history_id=new_history.history_id)
        new_answer = create_qna(db, temp_qna)
    return {"user_id": user_id, "history_list": get_user_histories(db, user_id)}


@app.get("/home/{user_id}/{history_id}")
async def get_history(request: Request, user_id: str, history_id: int, db: Session = Depends(get_db)):
    if not await get_current_user(request):
        return {'message': 'login failed'}

    histories = get_user_histories(db, user_id)
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})


@app.get("/history/")
async def get_history(user_id: str, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    histories = get_user_history_titles(db, user_id)
    if histories == None:
        return {"type": False, "message": "invalid history id"}
    history_list = []
    for history in histories:
        history_list.append(
            {"history_id": history.history_id, "title": history.title})
    return {"type": True, "message": "valid history id", "history_list": history_list}


@app.post("/history/delete")
async def delete_history(user_id: str, history_id: int, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    history = get_history_by_id(db, history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}

    delete_user_history(db, user_id, history_id)
    return {"type": True, "message": "delete success"}


@app.post("/home/{user_id}/{history_id}/title")
async def change_title(request: Request, user_id: str, history_id: int, title: str, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    history = get_history_by_id(db, history_id)
    change_history_title(db, history, title)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.get("/history/transcription/")
async def get_transcription(user_id: str, history_id: int, db: Session = Depends(get_db)):
    history = get_history_by_id(db, history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}
    if history.transcription == "loading":
        return {"type": False, "message": "loading"}
    return {"type": True, "message": "valid history id", "transcription": history.transcription}


@app.post("/home/{user_id}/{history_id}/transcription")
async def change_transcription(request: Request, user_id: str, history_id: int, transcription: str, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    history = get_history_by_id(db, history_id)
    change_history_transcription(db, history, transcription)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.get("/history/summary/")
async def get_summary(user_id: str, history_id: int, db: Session = Depends(get_db)):
    history = get_history_by_id(db, history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}
    if history.transcription == "loading":
        return {"type": False, "message": "loading"}
    return {"type": True, "message": "valid history id", "summary": history.summary}


@app.post("/home/{user_id}/{history_id}/summary")
async def change_summary(request: Request, user_id: str, history_id: int, summary: str, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    history = get_history_by_id(db, history_id)
    change_history_summary(db, history, summary)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.get("/history/qnas/")
async def get_qnas(user_id: str, history_id: int, db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    # return {'message': 'login failed'}

    qnas = get_qnas_by_history_id(db, history_id)
    if qnas == None:
        return {"type": False, "message": "invalid qna id"}
    qna_list = []
    for qna in qnas:
        qna_list.append({"qna_id": qna.qna_id,
                         "question": qna.question, "answer": qna.answer})
    return {"type": True, "message": "valid qna id", "qnas": qna_list}


@app.post("/home/{user_id}/{history_id}/{qna_id}/{type}")
async def change_or_delete(request: Request, user_id: str, history_id: int, qna_id: int, type: str, question: str = Form(None), answer: str = Form(None),  db: Session = Depends(get_db)):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    if type == "change":
        change_qna(user_id, history_id, qna_id, question, answer, db)
    elif type == "delete":
        delete_qna(user_id, history_id, qna_id, db)


async def change_qna(request: Request, user_id: str, history_id: int, qna_id: int, question: str, answer: str, db: Session):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    qna = get_qna_by_id(db, qna_id)
    changed_qna = change_history_qna(db, qna, question, answer)
    return {"user_id": user_id, "history_id": history_id, "qna_id": qna_id, "changed_qna": changed_qna}


async def delete_qna(request: Request, user_id: str, history_id: int, qna_id: int, db: Session):
    # if not await get_current_user(request):
    #     return {'message': 'login failed'}

    qna = get_qna_by_id(db, qna_id)
    delete_history_qna(db, qna)
    return {"user_id": user_id, "history_id": history_id, "qna_id": qna_id}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
