import json
from typing import Annotated, Any
from fastapi import FastAPI, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from backend import models, schemas, crud, auth
from backend.database import SessionLocal, engine
import os

# Create tables in .models
models.Base.metadata.create_all(bind=engine)

# Create app server
app = FastAPI()

# Include endpoint routes in auth
app.include_router(auth.router)

# CORS handling
origins = os.environ.get("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get current user
@app.get("/", status_code=status.HTTP_200_OK, response_model=schemas.User)
async def user(user: Annotated[str, Depends(auth.get_current_user)]):
    return user

# Delete user
@app.delete("/user/delete/", response_model=schemas.User)
async def delete_user(user: Annotated[str, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    return crud.delete_user(db=db, user_id=user.id)

# Get users
# @app.get("/users/", response_model=list[schemas.User])
# def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     return crud.read_users(db, skip=skip, limit=limit)

# Add log 
@app.post("/log/", response_model=schemas.Log)
async def create_log(user: Annotated[str, Depends(auth.get_current_user)], log: schemas.LogBase, db: Session = Depends(get_db)):
    return crud.create_log(db=db, log=log, author=user)

# Get recent logs
@app.get("/logs/", response_model=list[schemas.Log])
async def get_recent_logs(user: Annotated[str, Depends(auth.get_current_user)], db: Session = Depends(get_db), limit: int = 10):
    return crud.read_logs(db=db, author_id=user.id, limit=limit)
    
# Get logs by month
@app.get("/logs/month/", response_model=list[schemas.Log])
async def get_logs_by_month(user: Annotated[str, Depends(auth.get_current_user)], 
                            year: Annotated[int, Query(title="year of log")], 
                            month: Annotated[int, Query(title="month of log", ge=1, le=12)], 
                            db: Session = Depends(get_db)):
    return crud.read_logs_by_month(db=db, year=year, month=month, author_id=user.id)

# Get logs by date range
@app.get("/logs/range/", response_model=list[schemas.Log])
async def get_logs_by_range(user: Annotated[str, Depends(auth.get_current_user)], 
                            start_date: Annotated[date, Query(title="start date of logs")], 
                            end_date: Annotated[date, Query(title="end date of logs")],  
                            db: Session = Depends(get_db)):
    return crud.read_logs_by_date_range(db=db, start_date=start_date, end_date=end_date, author_id=user.id)

# Delete logs at specific date
@app.delete("/logs/delete/", response_model=list[schemas.Log])
async def delete_logs(user: Annotated[str, Depends(auth.get_current_user)], date: Annotated[date, Query(title="date of logs to delete")], db: Session = Depends(get_db)):
    return crud.delete_logs(db=db, date=date, author_id=user.id)
