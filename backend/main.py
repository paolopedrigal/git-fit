from typing import Any
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine

# Create tables in .models
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/")
async def get_root():
    return "Testing!!"

# Create user
@app.post("/users/", response_model=schemas.User)
def post_user(user: schemas.UserBase, db: Session = Depends(get_db)) -> Any:
    db_user = crud.read_user_by_email(db, email=user.email)
    if db_user: # if user already exists
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Get users
@app.get("/users/", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> Any:
    users = crud.read_users(db, skip=skip, limit=limit)
    return users

