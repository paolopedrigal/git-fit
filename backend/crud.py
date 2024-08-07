from sqlalchemy.orm import Session
from sqlalchemy import desc, extract, and_
from datetime import date
from uuid import UUID

from . import auth
from . import models, schemas

def read_user(db: Session, user_id: UUID) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()

def read_user_by_username(db: Session, username: str) -> models.User:
    return db.query(models.User).filter(models.User.username == username).first()

def read_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = auth.get_password_hash(user.password) 
    db_user = models.User(username=user.username, password=hashed_password) # sqlalchemy automatically generates primary key `id`
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: UUID) -> models.User:
    db_user = read_user(db=db, user_id=user_id)
    db.delete(db_user)
    db.commit()
    return db_user

def read_logs(db: Session, author_id: UUID, limit: int = 10) -> models.Log:
    return db.query(models.Log).filter(models.Log.author_id == author_id).order_by(desc(models.Log.log_date), desc(models.Log.log_time)).limit(limit).all()

def read_logs_by_month(db: Session, year: int, month: int, author_id: UUID) -> models.Log:
    return db.query(models.Log).filter(
        models.Log.author_id == author_id,
        extract('year', models.Log.log_date) == year,
        extract('month', models.Log.log_date) == month
    ).order_by(
        desc(models.Log.log_date),
        desc(models.Log.log_time)
    ).all()

def read_logs_by_date_range(db: Session, start_date: date, end_date: date, author_id: UUID) -> models.Log:
    return db.query(models.Log).filter(
        and_(
            models.Log.log_date >= start_date,
            models.Log.log_date <= end_date,
            models.Log.author_id == author_id
        )
    ).order_by(
        models.Log.log_date.asc(),
        models.Log.log_time.asc()
    ).all()

def create_log(db: Session, log: schemas.LogBase, author: models.User) -> models.Log:
    db_log = models.Log(description=log.description, log_date=log.log_date, log_time=log.log_time, duration_minutes=log.duration_minutes, author_id=author.id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_logs(db: Session, date: date, author_id: UUID) -> models.Log:
    db_logs = db.query(models.Log).filter(models.Log.log_date == date, models.Log.author_id == author_id).all()
    for log in db_logs:
        db.delete(log)
    db.commit()
    return db_logs # returns empty list if no logs found at date
