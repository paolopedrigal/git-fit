import json
from typing import Annotated, Any
from fastapi import FastAPI, Depends, Query, status
from sqlalchemy.orm import Session
from datetime import date
from . import models, schemas, crud, auth
from .database import SessionLocal, engine

# Create tables in .models
models.Base.metadata.create_all(bind=engine)

# Create app server
app = FastAPI()

# Include endpoint routes in auth
app.include_router(auth.router)

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

# Get users
@app.get("/users/", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> Any:
    return crud.read_users(db, skip=skip, limit=limit)

# Add log 
@app.post("/log/", response_model=schemas.Log)
async def create_log(user: Annotated[str, Depends(auth.get_current_user)], log: schemas.LogBase, db: Session = Depends(get_db)):
    return crud.create_log(db=db, log=log, author=user)

# Get recent logs
@app.get("/logs/", response_model=list[schemas.Log])
async def get_recent_logs(user: Annotated[str, Depends(auth.get_current_user)], db: Session = Depends(get_db), limit: int = 60):
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