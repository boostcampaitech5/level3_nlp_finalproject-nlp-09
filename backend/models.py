from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True, nullable=False)
    password = Column(String, index=True, nullable=False)

    histories = relationship("History", backref="owner")


class History(Base):
    __tablename__ = "histories"

    history_id = Column(Integer, primary_key=True, index=True,
                        nullable=False, autoincrement=True)
    title = Column(Text, index=True)
    transcription = Column(Text, index=True)
    summary = Column(Text, index=True)
    question_answer = Column(Text, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))

    # user = relationship("User", back_populates="history")
