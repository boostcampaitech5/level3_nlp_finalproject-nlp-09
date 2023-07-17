from fastapi import FastAPI, Depends, HTTPException, Form, Request, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from jose import jwt, JWTError
from datetime import datetime, timedelta
import uvicorn

app = FastAPI()

# Jinja2 템플릿 설정
templates = Jinja2Templates(directory="./")

# JWT 설정
SECRET_KEY = "your-secret-key"  # 실제 사용 시 더 복잡한 값으로 변경해야 합니다.
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 사용자 정보 (실제로는 DB나 외부 저장소에서 가져와야 합니다.)
fake_users_db = {
    "test": {
        "username": "test",
        "password": "1234"
    },
    "test2": {
        "username": "test2",
        "password": "12345"
    }
}

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
    user = fake_users_db.get(form_data.username)
    if user is None or user["password"] != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    response = RedirectResponse(url="/secure-data/", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
                        key='access_token',
                        value=access_token,
                        httponly=True
                    )
    
    return response


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/secure-data/")
async def get_secure_data(request: Request):
    user = await get_current_user(request)
    if user is None:
        return {'message': 'login failed', 'user':user}
        
    return templates.TemplateResponse("secure.html", {"request": request, "user": user['username']})


@app.get("/logout")
async def logout(request: Request):
    response = templates.TemplateResponse("login.html", {"request":request})
    response.delete_cookie(key="access_token")
    return response


if __name__ == '__main__':
    uvicorn.run("login_test:app", host="127.0.0.1", port=8000, reload=True)
