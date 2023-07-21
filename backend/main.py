import uvicorn
import tempfile
import shutil
import os
import sys
from typing import Union, List
import asyncio
import datetime

from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request, Response, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, FileResponse
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

# pdf export
from weasyprint import HTML, CSS
from weasyprint.fonts import FontConfiguration
from markdown2 import markdown_path

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
    new_history = change_history_transcription(db, new_history, transcription)

    temp_audio.close()
    os.remove(temp_audio.name)

    return title, transcription, new_history


# summarize, questionize 백그라운드 실행
def background_summary_and_qna_task(transcription, db, new_history):
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

    title, transcription, new_history = transcription_task(file, db, info["user_id"])
    background_tasks.add_task(background_summary_and_qna_task, transcription, db, new_history)

    return {"type": True, "message": "create success", "history_id": new_history.history_id, "title": title, "transcription": transcription}


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
@app.post("/home/change_title")
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
    if history.transcription == "loading":
        return {"type": False, "message": "loading"}
    return {"type": True, "message": "valid history id", "summary": history.summary}


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


# TODO: Markdown to PDF 변환기
def md2pdf(filename, output):
    html = markdown_path(filename, encoding="utf-8")
    print(html)
    html_utf8 = f'<meta charset="utf-8">\n{html}'
    css_with_font_family = CSS(string='@font-face { font-family: NanumSquareR; src: /usr/share/fonts/truetype/myfonts/NanumSquareR.ttf; }')
    HTML(string=html_utf8, encoding="utf-8").write_pdf(output, stylesheets=[css_with_font_family])


# TODO: Markdown 형식 텍스트 만들기
def text_to_pdf(output_filename: str, content_types: List, history: History, db: Session = Depends(get_db)):
    md_title, md_contents = f"# {history.title}", ""
    if 'transcription' in content_types:
        md_history = f"## 속기\n\n{history.transcription}"
        md_contents += md_history
    if 'summary' in content_types:
        md_summary = f"## 요약\n\n{history.summary}"
        md_contents += md_summary
    if 'qnas' in content_types:
        qnas = get_qnas_by_history_id(db, history.history_id)
        md_qnas = "\n\n## 퀴즈"
        for qna_number, qna in enumerate(qnas):
            md_qna = f"\n### 퀴즈 {qna_number+1}.\n{qna.question}\n\n{qna.answer}"
            md_qnas += md_qna
        md_contents += md_qnas

    md_text = md_title + "\n\n" + md_contents

    temp_md_file = tempfile.NamedTemporaryFile(mode="w", delete=True, suffix=".md")
    with open(temp_md_file.name, "w", encoding="utf-8") as temp_file:
        temp_file.write(md_text)
    md2pdf(temp_md_file.name, output_filename)


# TODO: 속기본 PDF 내보내기 엔드포인트
@app.post("/history/export_pdf")
async def export_pdf(request: Body, db: Session = Depends(get_db)):
    info = get_current_user(request.access_token)
    if info["message"] != "Valid":
        return {"type": False, "message": info["message"]}
    
    current_time = datetime.datetime.now().strftime("%y%m%d%H%M%S")
    pdf_filename = f"lecnrec_{current_time}.pdf"
    content_types = ['transcription', 'qnas']
    history = get_history_by_id(db, request.history_id)
    text_to_pdf(
        output_filename=pdf_filename,
        content_types=content_types,
        history=history,
        db=db
    )
    return FileResponse(pdf_filename, filename=pdf_filename, headers={"Content-Disposition": "attachment"})


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
