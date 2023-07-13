from sqlalchemy.orm import Session

import models
import schemas


def get_user(db: Session, user_id: int):
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


def get_histories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.History).offset(skip).limit(limit).all()


def get_user_histories(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.History).filter(models.History.user_id == user_id).offset(skip).limit(limit).all()


def create_user_history(db: Session, history: schemas.History, user_id: str):
    db_item = models.History(**history.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
