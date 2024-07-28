from typing import Annotated, Any
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
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

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: Annotated[str, Depends(auth.get_current_user)]):
    return user

# Get users
@app.get("/users/", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> Any:
    users = crud.read_users(db, skip=skip, limit=limit)
    return users

