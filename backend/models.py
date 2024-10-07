from datetime import datetime, timezone
from sqlalchemy import Column, String, Date, Time, ForeignKey,Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)

    logs = relationship("Log", back_populates="author")

class Log(Base):
    __tablename__ = "logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    description = Column(String, nullable=False)
    log_date = Column(Date, default=datetime.now(timezone.utc), nullable=False)
    log_time = Column(Time, default=datetime.now(timezone.utc), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    author = relationship("User", back_populates="logs")

