from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Check for missing keys from .env and handle them
POSTGRES_USER = os.environ.get("POSTGRES_USER")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
POSTGRES_SERVER = os.environ.get("POSTGRES_SERVER")
POSTGRES_DB = os.environ.get("POSTGRES_DB")  # Get the database name from .env

if not POSTGRES_USER or not POSTGRES_PASSWORD or not POSTGRES_SERVER or not POSTGRES_DB:
    raise KeyError("Missing one or more environment variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_SERVER, POSTGRES_DB")

# Correct the database URL to include the database name
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"


engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()