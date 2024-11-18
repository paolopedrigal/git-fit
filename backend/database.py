from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import config

# Check for missing keys from .env and handle them
POSTGRES_USER = config.get("POSTGRES_USER")
POSTGRES_PASSWORD = config.get("POSTGRES_PASSWORD")
POSTGRES_SERVER= config.get("POSTGRES_SERVER")

if not POSTGRES_USER or not POSTGRES_PASSWORD or not POSTGRES_SERVER:
    raise KeyError("Missing one or more environment variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PATH")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()