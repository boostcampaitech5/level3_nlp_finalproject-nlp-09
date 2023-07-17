import uvicorn
import tempfile
import shutil
import os, sys
sys.path.append('./')
from typing import Union
import asyncio

from fastapi import FastAPI, Form, File, Request, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from pydantic import BaseModel

# database
from database import SessionLocal, Base, engine
from models import User, History, QnA
from crud import *

# stt
from stt import transcribe, transcribe_test, summary_test, qa_test

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
def read_root():
    return {"Hello": "World"}


@app.get("/login")
def get_login_form(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user = get_user(db, username)
    if user is None:
        return "please sign up"
    elif user.password != password:
        return "check your password"
    else:
        return RedirectResponse(url=f"/home?user_id={username}", status_code=303)


@app.get("/signup")
def get_signup_form(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user_info = schemas.User(user_id=username, password=password)
    create_user(db, user_info)
    return {"user_id": username, "user_list": get_users(db)}


@app.get("/home")
def get_histories(request: Request, user_id):
    db = SessionLocal()
    histories = get_user_histories(db, user_id)
    qnas = get_user_all_qnas(db, user_id)

    return templates.TemplateResponse("home.html", context={
        "request": request, 
        "user_id": user_id, 
        "histories": histories, 
        "qnas": qnas
        }
    )


# @app.post("/home")
# def create_history(user_id):
#     db = SessionLocal()
#     temp_history = schemas.History(
#         title="sample_title", transcription="sample_transcription", summary="sample_summary", user_id=user_id
#     )
#     new_history = create_user_history(db, temp_history, user_id)
#     histories = get_user_histories(db, user_id)

#     for i in range(3):
#         temp_qna = schemas.QnA(
#             question=f"sample_question_{i}", answer=f"sample_answer_{i}", history_id=new_history.history_id
#         )
#         create_user_history_qna(db, temp_qna, new_history.history_id)
#     qnas = get_user_all_qnas(db, user_id)

#     return {"user_id": user_id, "histories": histories, "qnas": qnas}


@app.post("/transformed")
async def return_result(request: Request, user_id: str, audio: UploadFile = File(...)):
    audio_format = '.'+ audio.filename.split('.')[-1]
    audio_name = audio.filename[:-len(audio_format)]
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=audio_format)
    with open(temp_audio.name, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    # transcription = transcribe(temp_audio.name)
    transcription = transcribe_test(temp_audio.name)
    summary = summary_test(transcription)
    questions, answers = qa_test(summary)
    
    temp_audio.close()
    os.remove(temp_audio.name)

    db = SessionLocal()
    temp_history = schemas.History(
        title=audio_name,
        transcription=transcription,
        summary=summary
    )
    new_history = create_user_history(db, temp_history, user_id)
    
    for question, answer in zip(questions, answers):
        temp_qna = schemas.QnA(
            question=question,
            answer=answer
        )
        create_user_history_qna(db, temp_qna, new_history.history_id, user_id)

    histories = get_user_histories(db, user_id)
    qnas = get_user_all_qnas(db, user_id)

    return templates.TemplateResponse("transformed.html", context={
        "request": request,
        "histories": histories,
        "transcription": transcription,
        "summary": summary,
        "qnas": qnas,
        "user_id": user_id
        }
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
