from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    logs = relationship("Log", back_populates="author")

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True)
    description = Column(String)
    datetime = Column(DateTime, unique=True)
    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User", back_populates="logs")

