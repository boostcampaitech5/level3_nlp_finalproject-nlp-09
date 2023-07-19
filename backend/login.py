from jose import jwt, JWTError
from datetime import datetime, timedelta
from secret import SECRET_KEY, ALGORITHM

# JWT 설정
SECRET_KEY = SECRET_KEY
ALGORITHM = ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
async def get_current_user(access_token):
    try:
        if not access_token:
            return {"message": "Invalid user"}
        
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return {"message": "Invalid user"}
        return username
    
    except JWTError:
        return {"message": "JWT Error raised"}
