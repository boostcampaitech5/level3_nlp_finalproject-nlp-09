from typing import List, Union

from pydantic import BaseModel


class History(BaseModel):
    title: str
    transcription: str
    summary: str
    question_answer: str

    class Config:
        orm_mode = True


class User(BaseModel):
    user_id: str
    password: str
    histories: List[History] = []

    class Config:
        orm_mode = True
