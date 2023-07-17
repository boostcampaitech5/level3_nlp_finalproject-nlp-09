from fastapi import FastAPI, Depends, HTTPException, Form, Request, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from jose import jwt, JWTError
from datetime import datetime, timedelta
import uvicorn
from database import SessionLocal
from crud import *


app = FastAPI()

# Jinja2 템플릿 설정
templates = Jinja2Templates(directory="../src")

# JWT 설정
SECRET_KEY = "your-secret-key"  # 실제 사용 시 더 복잡한 값으로 변경해야 합니다.
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# OAuth2PasswordBearer 객체를 사용하여 토큰을 가져올 수 있습니다.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 토큰 유효성 검사 함수
async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    try:
        token = request.cookies.get("access_token")
        if token is None:
            return None
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return {"username": username}
    
    except JWTError:
        print('JWTError')


@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    user = get_user(db, form_data.username)
    if user is None or user.password != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.user_id}, expires_delta=access_token_expires)
    response = RedirectResponse(url="/home", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
                        key='access_token',
                        value=access_token,
                        httponly=True
                    )
    
    return response


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login_test.html", {"request": request})


@app.get("/logout")
async def logout(request: Request):
    response = templates.TemplateResponse("login_test.html", {"request":request})
    response.delete_cookie(key="access_token")
    return response


@app.get("/signup")
def get_signup_form(request: Request):
    return templates.TemplateResponse("login.html", context={"request": request})


@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user_info = schemas.User(user_id=username, password=password)
    new_user = create_user(db, user_info)
    return {"user_id": username, "user_list": get_users(db)}


@app.get("/home")
async def get_histories(request: Request):
    user = await get_current_user(request)
    if user is None:
        return {'message': 'login failed', 'user':user}
    
    db = SessionLocal()
    histories = get_user_histories(db, user['username'])

    return templates.TemplateResponse("home.html", context={"request": request, "histories": histories})


# @app.post("/home")
# async def create_history(request: Request):
#     user = await get_current_user(request)
#     if user is None:
#         return {'message': 'login failed', 'user':user}
    
#     db = SessionLocal()
#     temp_history = schemas.History(
#         title="test", transcription="test", summary="test", question_answer="test")
#     new_history = create_user_history(db, temp_history, user['username'])
#     return {"user_id": user['username'], "history_list": get_user_histories(db, user['username'])}


if __name__ == '__main__':
    uvicorn.run("login:app", host="127.0.0.1", port=8000, reload=True)
