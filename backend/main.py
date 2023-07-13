import uvicorn
from typing import Union

from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from pydantic import BaseModel

# database
from database import SessionLocal
from models import User, History
from crud import *

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
def login(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user_info = schemas.User(user_id=username, password=password)
    new_user = create_user(db, user_info)
    return {"user_id": username, "user_list": get_users(db)}


@app.get("/home")
def get_histories(request: Request, user_id):
    db = SessionLocal()
    histories = get_user_histories(db, user_id)

    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})


@app.post("/home")
def create_history(user_id):
    db = SessionLocal()
    temp_history = schemas.History(
        title="test", transcription="test", summary="test", question_answer="test")
    new_history = create_user_history(db, temp_history, user_id)
    return {"user_id": user_id, "history_list": get_user_histories(db, user_id)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
