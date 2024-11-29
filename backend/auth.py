from datetime import datetime, timedelta, timezone
from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
from jwt.exceptions import InvalidTokenError
from uuid import UUID
import os

from backend.database import SessionLocal
from backend import TOKEN_TYPE, crud, schemas

# Configure router for auth endpoints
router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Check for missing keys from .env and handle them
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

if not SECRET_KEY or not ALGORITHM:
    raise KeyError("Missing one or more environment variables: SECRET_KEY, ALGORITHM")

ACCESS_TOKEN_EXPIRE_WEEKS = 1

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenUserData(Token):
    username: str
    id: UUID

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str):
    user = crud.read_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(username: str, user_id: UUID, expires_delta: timedelta | None = None):
    encoded_uuid_id = str(user_id) # convert uuid to string to make it JSON serializable
    to_encode = {"sub": username, "id": encoded_uuid_id}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(weeks=ACCESS_TOKEN_EXPIRE_WEEKS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
    )
    username = None
    user_id = None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        user_id: int | None = payload.get("id")
        if username is None or user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = crud.read_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# Create user
@router.post("/", response_model=TokenUserData)
def post_user(user: schemas.UserCreate, db: Session = Depends(get_db)) -> Any:
    check_user = crud.read_user_by_username(db, username=user.username)
    if check_user: # if user already exists
        raise HTTPException(status_code=400, detail="User already registered")
    new_user = crud.create_user(db=db, user=user)
    access_token=create_access_token(new_user.username, new_user.id)
    return TokenUserData(username=new_user.username, id=new_user.id, access_token=access_token, token_type=TOKEN_TYPE)
    
# Create token for login
@router.post("/token", response_model=TokenUserData)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token=create_access_token(user.username, user.id)
    return TokenUserData(username=user.username, id=user.id, access_token=access_token, token_type=TOKEN_TYPE)
