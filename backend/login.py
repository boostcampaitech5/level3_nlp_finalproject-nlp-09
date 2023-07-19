from fastapi import  Depends, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta
from secret import SECRET_KEY, ALGORITHM

# JWT 설정
SECRET_KEY = SECRET_KEY
ALGORITHM = ALGORITHM
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
            return False
        return username
    
    except JWTError:
        print('JWTError')
