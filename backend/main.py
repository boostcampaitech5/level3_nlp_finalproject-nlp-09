import uvicorn
import tempfile
import shutil
import os
import sys
from typing import Union, List
import asyncio
import time

from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request, Response, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, StreamingResponse
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
from ml_functions.stt import transcribe, transcribe_async, transcribe_test
from ml_functions.add_period import add_period
from ml_functions.summary import summarize, summarize_async, summarize_test
from ml_functions.qna import questionize, questionize_async, questionize_test
import pytube

# pdf export
from pdf_export.convert_pdf import text_to_pdf

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


class Body(BaseModel):
    access_token: str
    history_id: int = None
    qna_id: int = None
    title: str = None
    transcription: str = None
    summary: str = None
    question: str = None
    answer: str = None


# 로그인 검증 및 토큰 생성
@app.post("/token")
async def login_for_access_token(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user is None or user.password != posted_user_info.password:
        return {"type": False, "message": "wrong password", "access_token": ""}
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires)

    return {"type": True, "message": "login success", "access_token": access_token}


# 로그인 아이디 검증
@app.post("/id_validation")
async def id_validation(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user == None:
        return {"type": False, "message": "invalid user id"}
    return {"type": True, "message": "valid user id"}


# 화원가입 아이디 검증
@app.post("/signup/id_validation")
def signup_id_validation(posted_user_info: User, db: Session = Depends(get_db)):
    user = get_user(db, posted_user_info.user_id)
    if user != None:
        return {"type": False, "message": "already exist user id"}

    return {"type": True, "message": "valid user id"}


# 회원가입
@app.post("/signup")
def signup(posted_user_info: User, db: Session = Depends(get_db)):
    user_info = schemas.User(
        user_id=posted_user_info.user_id, password=posted_user_info.password)
    create_user(db, user_info)
    return {"type": True, "message": "signup success"}


# transcribe 실행
def transcription_task(audio, db, user_id):
    audio_format = '.' + audio.filename.split('.')[-1]
    audio_name = audio.filename[:-len(audio_format)]
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=audio_format)
    with open(temp_audio.name, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    title = audio_name
    new_history_with_title = schemas.History(
        title=title, transcription="loading", summary="loading"
    )
    new_history = create_user_history(db, new_history_with_title, user_id)
    transcription = transcribe(temp_audio.name)
    post_processed_transcription = add_period(transcription)
    new_history = change_history_transcription(
        db, new_history, post_processed_transcription)

    temp_audio.close()
    os.remove(temp_audio.name)

    return title, transcription, new_history


# link transcribe 실행
def transcription_task_link(audio_name, db, user_id):
    new_history_with_title = schemas.History(
        title=audio_name, transcription="loading", summary="loading"
    )
    new_history = create_user_history(db, new_history_with_title, user_id)
    transcription = transcribe("./temp/"+audio_name)
    post_processed_transcription = add_period(transcription)
    new_history = change_history_transcription(
        db, new_history, post_processed_transcription)

    os.remove("./temp/"+audio_name)

    return audio_name, transcription, new_history


# summarize, questionize 백그라운드 실행
def background_summary_and_qna_task(transcription, db, new_history):
    summary_list, summary = asyncio.run(summarize_async(transcription))
    new_history = asyncio.run(
        change_history_summary_async(db, new_history, summary))
    questions, answers = asyncio.run(questionize_async(summary_list))
    for question, answer in zip(questions, answers):
        if question == '<no_question>' or answer == '<no_answer>':
            continue
        temp_qna = schemas.QnA(
            question=question, answer=answer, history_id=new_history.history_id
        )
        asyncio.run(create_qna_async(db, temp_qna))


# link summarize, quenstionize 백그라운드 실행
def background_summary_and_qna_task_link(transcription, db, new_history):
    summary_list, summary = asyncio.run(summarize_async(transcription))
    new_history = asyncio.run(
        change_history_summary_async(db, new_history, summary))
    questions, answers = asyncio.run(questionize_async(summary_list))
    for question, answer in zip(questions, answers):
        temp_qna = schemas.QnA(
            question=question, answer=answer, history_id=new_history.history_id
        )
        asyncio.run(create_qna_async(db, temp_qna))


# 파일 업로드, 히스토리 생성
@app.post("/upload")
async def create_history(background_tasks: BackgroundTasks, access_token: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    info = get_current_user(access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    title, transcription, new_history = transcription_task(
        file, db, info["user_id"])
    background_tasks.add_task(
        background_summary_and_qna_task, transcription, db, new_history)

    return {"type": True, "message": "create success", "history": {"history_id": new_history.history_id, "title": title}, "transcription": transcription}


# 링크 업로드, 히스토리 생성
@app.post("/upload_link")
async def create_history_link(background_tasks: BackgroundTasks, access_token: str = Form(...), url: str = Form(...), db: Session = Depends(get_db)):
    info = get_current_user(access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    yt = pytube.YouTube(url)
    audio = yt.streams.get_audio_only()
    filename = time.strftime("%Y%m%d-%H%M%S")+".mp4"
    audio.download(filename=filename, output_path="./temp")

    title, transcription, new_history = transcription_task_link(
        filename, db, info["user_id"])
    background_tasks.add_task(
        background_summary_and_qna_task_link, transcription, db, new_history)

    return {"type": True, "message": "create success", "history": {"history_id": new_history.history_id, "title": title}, "transcription": transcription}


# 히스토리 목록
@app.post("/history")
async def get_history(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    histories = get_user_history_titles(db, info["user_id"])
    if histories == None:
        return {"type": False, "message": "invalid history id"}
    history_list = []
    for history in histories:
        history_list.append(
            {"history_id": history.history_id, "title": history.title})
    return {"type": True, "message": "valid history id", "history_list": history_list}


# 히스토리 삭제
@app.post("/history/delete")
async def delete_history(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}

    delete_user_history(db, info["user_id"], request.history_id)
    return {"type": True, "message": "delete success"}


# 타이틀 변경
@app.post("/history/change_title")
async def change_title(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    change_history_title(db, history, request.title)
    return {"type": True, "message": "change success"}


# 속기본 로드
@app.post("/history/transcription")
async def get_transcription(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}
    if history.transcription == "loading":
        return {"type": False, "message": "loading"}
    return {"type": True, "message": "valid history id", "transcription": history.transcription}


# 속기본 변경
@app.post("/history/change_transcription")
async def change_transcription(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    change_history_transcription(db, history, request.transcription)
    return {"type": True, "message": "change success"}


# 요약본 로드
@app.post("/history/summary/")
async def get_summary(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    if history == None:
        return {"type": False, "message": "invalid history id"}
    if history.summary == "loading":
        return {"type": False, "message": "loading"}

    split_summary = history.summary.split("\n")
    return {"type": True, "message": "valid history id", "summary": split_summary}


# 요약본 수정
@app.post("/history/change_summary")
async def change_summary(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    change_history_summary(db, history, request.summary)
    return {"type": True, "message": "change success"}


# 질문 로드
@app.post("/history/qna")
async def get_qnas(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    qnas = get_qnas_by_history_id(db, request.history_id)
    if qnas == None:
        return {"type": False, "message": "invalid qna id"}
    qna_list = []
    for qna in qnas:
        qna_list.append({"qna_id": qna.qna_id,
                         "question": qna.question, "answer": qna.answer})
    if len(qna_list) == 0:
        return {"type": False, "message": "loading"}

    return {"type": True, "message": "valid qna id", "qnas": qna_list}


# 질문 삭제
@app.post("/history/delete_qna")
async def delete_qna(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    qna = get_qna_by_id(db, request.qna_id)
    delete_history_qna(db, qna)
    return {"type": True, "message": "delete success"}


# 질문 수정
@app.post("/history/change_qna")
async def change_qna(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    qna = get_qna_by_id(db, request.qna_id)
    change_history_qna(db, qna, request.question, request.answer)
    return {"type": True, "message": "change success"}


@app.post("/history/export_pdf")
async def export_pdf(request: Body, ex_trans: bool = True, ex_summ: bool = True, ex_qna: bool = True, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}

    history = get_history_by_id(db, request.history_id)
    is_exported = {
        'transcription': ex_trans,
        'summary': ex_summ,
        'qnas': ex_qna
    }
    pdf_filepath, pdf_filename = text_to_pdf(
        is_exported=is_exported, history=history, db=db)

    return (
        {"type": True, "message": "export success"}, 
        StreamingResponse(open(pdf_filepath, "rb"), headers={"Content-Disposition": f"attachment; filename={pdf_filename}"})
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
