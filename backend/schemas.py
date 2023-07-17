from typing import List, Union

from pydantic import BaseModel


class History(BaseModel):
    title: str
    transcription: str
    summary: str

    class Config:
        orm_mode = True


class QnA(BaseModel):
    question: str
    answer: str

    class Config:
        orm_mode = True
        

class User(BaseModel):
    user_id: str
    password: str
    histories: List[History] = []
    qnas: List[QnA] = []

    class Config:
        orm_mode = True
