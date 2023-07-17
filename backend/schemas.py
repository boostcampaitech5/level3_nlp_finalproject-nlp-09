from typing import List, Union

from pydantic import BaseModel


class QnA(BaseModel):
    question: str
    answer: str
    history_id: int

    class Config:
        orm_mode = True


class History(BaseModel):
    title: str
    transcription: str
    summary: str

    class Config:
        orm_mode = True


class User(BaseModel):
    user_id: str
    password: str
    histories: List[History] = []

    class Config:
        orm_mode = True
