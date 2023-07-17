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

import asyncio
import time

# database
from database import SessionLocal
from models import User, History, QnA
from crud import *
from dependency import *
from sqlalchemy.orm import Session

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
    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories, "history": history})


@app.post("/home/{user_id}")
def create_history(user_id: str, db: Session = Depends(get_db)):
    temp_history = schemas.History(
        title="test", transcription="test", summary="test", qnas=[])
    new_history = create_user_history(db, temp_history, user_id)

    for i in range(3):
        temp_qna = schemas.QnA(question=f"test{i}",
                               answer=f"test{i}", history_id=new_history.history_id)
        new_answer = create_qna(db, temp_qna)
    return {"user_id": user_id, "history_list": get_user_histories(db, user_id)}


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
