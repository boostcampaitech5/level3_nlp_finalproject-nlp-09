from sqlalchemy.orm import Session

import models
import schemas


# user table
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.User):
    db_user = models.User(
        user_id=user.user_id, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# history table
def get_histories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.History).offset(skip).limit(limit).all()


def get_user_histories(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.History).filter(models.History.user_id == user_id).offset(skip).limit(limit).all()


def get_history_by_id(db: Session, history_id: int):
    return db.query(models.History).filter(models.History.history_id == history_id).first()


def create_user_history(db: Session, history: schemas.History, user_id: str):
    db_item = models.History(**history.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


async def create_user_history_async(db: Session, history: schemas.History, user_id: str):
    db_item = models.History(**history.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_user_history(db: Session, user_id: str, history_id: str):
    db_item = db.query(models.History).filter(
        models.History.user_id == user_id, models.History.history_id == history_id).first()
    db.delete(db_item)
    db.commit()
    return db_item


def change_history_title(db: Session, history: models.History, title: str):
    history.title = title
    db.commit()
    db.refresh(history)
    return history


async def change_history_title_async(db: Session, history: models.History, title: str):
    history.title = title
    db.commit()
    db.refresh(history)
    return history


def change_history_transcription(db: Session, history: models.History, transcription: str):
    history.transcription = transcription
    db.commit()
    db.refresh(history)
    return history


async def change_history_transcription_async(db: Session, history: models.History, transcription: str):
    history.transcription = transcription
    db.commit()
    db.refresh(history)
    return history


def change_history_summary(db: Session, history: models.History, summary: str):
    history.summary = summary
    db.commit()
    db.refresh(history)
    return history


async def change_history_summary_async(db: Session, history: models.History, summary: str):
    history.summary = summary
    db.commit()
    db.refresh(history)
    return history


# qna table
def create_qna(db: Session, qna: schemas.QnA):
    db_item = models.QnA(**qna.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


async def create_qna_async(db: Session, qna: schemas.QnA):
    db_item = models.QnA(**qna.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_history_qnas(db: Session, history_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.QnA).filter(models.QnA.history_id == history_id).offset(skip).limit(limit).all()


async def get_history_qnas_async(db: Session, history_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.QnA).filter(models.QnA.history_id == history_id).offset(skip).limit(limit).all()


def get_qna_by_id(db: Session, qna_id: int):
    return db.query(models.QnA).filter(models.QnA.qna_id == qna_id).first()


def change_history_qna(db: Session, qna: models.QnA, question: str, answer: str):
    qna.question = question
    qna.answer = answer
    db.commit()
    db.refresh(qna)
    return qna


def delete_history_qna(db: Session, qna: models.QnA):
    db.delete(qna)
    db.commit()
    return qna


async def delete_history_qna_async(db: Session, qna: models.QnA):
    db.delete(qna)
    db.commit()
    return qna
