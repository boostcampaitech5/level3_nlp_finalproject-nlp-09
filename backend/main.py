import uvicorn
import tempfile
import shutil
import os, sys
from typing import Union
import asyncio

from fastapi import FastAPI, Form, File, Request, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from pydantic import BaseModel

# database
from database import SessionLocal
from models import User, History, QnA
from crud import *
from dependency import *
from sqlalchemy.orm import Session

# audio_processing
sys.path.append('./')
sys.path.append('./ml_functions')
from ml_functions.stt import transcribe, transcribe_async, transcribe_test
from ml_functions.summary import summarize, summarize_async, summarize_test
from ml_functions.qna import questionize, questionize_async, questionize_test

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

@app.get("/")
def get_root(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})


@app.post("/")
def login_or_signup(request: Request, login_or_signup: str = Form(...)):
    if login_or_signup == "login":
        return RedirectResponse(url="/login", status_code=303)
    elif login_or_signup == "signup":
        return RedirectResponse(url="/signup", status_code=303)


@app.get("/login")
def get_login_form(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = get_user(db, username)
    if user is None:
        return "please sign up"
    elif user.password != password:
        return "check your password"
    else:
        return RedirectResponse(url=f"/home/{username}", status_code=303)


@app.get("/signup")
def get_signup_form(request: Request):
    return templates.TemplateResponse("signup.html", context={"request": request})


@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    check_user = get_user(db, username)
    if check_user is not None:
        return "already exist"
    else:
        user_info = schemas.User(user_id=username, password=password)
        new_user = create_user(db, user_info)
        return RedirectResponse(url=f"/home/{username}", status_code=303)


@app.get("/home/{user_id}")
def get_histories(request: Request, user_id: str, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    history = None
    qnas = None
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories, "history": history, "qnas": qnas})


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
    
    audio_format = '.' + audio.filename.split('.')[-1]
    audio_name = audio.filename[:-len(audio_format)]
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=audio_format)
    with open(temp_audio.name, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    title = audio_name
    new_history = change_history_title(db, new_history, title)

    # transcription = await asyncio.create_task(transcribe_test(temp_audio.name)) # Async
    transcription = transcribe(temp_audio.name) # Sync
    new_history = change_history_transcription(db, new_history, transcription)

    # summary = await asyncio.create_task(summarize_test(transcription)) # Async
    summary_list = summarize(transcription) # Sync
    summary = '\n'.join(summary_list)
    new_history = change_history_summary(db, new_history, summary)

    # questions, answers = await asyncio.create_task(questionize_test(summary)) # Async
    questions, answers = questionize(summary_list)
    new_qnas = []
    for question, answer in zip(questions, answers):
        if new_qna.question == "loading...":
            new_qna = change_history_qna(db, new_qna, question, answer)
        else:
            temp_qna = schemas.QnA(
                question=question, answer=answer, history_id=new_history.history_id
            )
            new_qna = create_qna(db, temp_qna)
        new_qnas.append(new_qna)

    temp_audio.close()
    os.remove(temp_audio.name)

    return {"user_id": user_id, "history_list": get_user_histories(db, user_id), "history": new_history, "qnas": new_qnas}


@app.get("/home/{user_id}/transcription")
async def get_transcription(request: Request, user_id: str, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})


@app.get("/home/{user_id}/summary")
async def get_summary(request: Request, user_id: str, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})


@app.get("/home/{user_id}/{history_id}")
def get_history(request: Request, user_id: str, history_id: int, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    history = get_history_by_id(db, history_id)
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories, "history": history})


@app.post("/home/{user_id}/{history_id}")
def delete_history(user_id: str, history_id: int, db: Session = Depends(get_db)):
    delete_user_history(db, user_id, history_id)
    return RedirectResponse(url=f"/home/{user_id}", status_code=303)


@app.post("/home/{user_id}/{history_id}/title")
def change_title(user_id: str, history_id: int, title: str, db: Session = Depends(get_db)):
    history = get_history_by_id(db, history_id)
    change_history_title(db, history, title)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.post("/home/{user_id}/{history_id}/transcription")
def change_transcription(user_id: str, history_id: int, transcription: str, db: Session = Depends(get_db)):
    history = get_history_by_id(db, history_id)
    change_history_transcription(db, history, transcription)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.post("/home/{user_id}/{history_id}/summary")
def change_summary(user_id: str, history_id: int, summary: str, db: Session = Depends(get_db)):
    history = get_history_by_id(db, history_id)
    change_history_summary(db, history, summary)
    return RedirectResponse(url=f"/home/{user_id}/{history_id}", status_code=303)


@app.get("/home/{user_id}/{history_id}/qna")
def get_single_qna_page(request: Request, user_id: str, history_id: int, db: Session = Depends(get_db)):
    histories = get_user_histories(db, user_id)
    qnas = get_history_qnas(db, history_id)
    return templates.TemplateResponse("qna.html", context={"request": request, "histories": histories, "qnas": qnas})


@app.post("/home/{user_id}/{history_id}/{qna_id}/{type}")
def change_or_delete(user_id: str, history_id: int, qna_id: int, type: str, question: str = Form(None), answer: str = Form(None),  db: Session = Depends(get_db)):
    if type == "change":
        change_qna(user_id, history_id, qna_id, question, answer, db)
    elif type == "delete":
        delete_qna(user_id, history_id, qna_id, db)


def change_qna(user_id: str, history_id: int, qna_id: int, question: str, answer: str, db: Session):
    qna = get_qna_by_id(db, qna_id)
    changed_qna = change_history_qna(db, qna, question, answer)
    return {"user_id": user_id, "history_id": history_id, "qna_id": qna_id, "changed_qna": changed_qna}


def delete_qna(user_id: str, history_id: int, qna_id: int, db: Session):
    qna = get_qna_by_id(db, qna_id)
    delete_history_qna(db, qna)
    return {"user_id": user_id, "history_id": history_id, "qna_id": qna_id}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
