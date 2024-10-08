# Recall conftest to contain fixture(s) used multiple times throughout testing

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest # type: ignore

from ..database import Base
from ..main import app, get_db as get_db_main
from ..auth import get_db as get_db_auth

# Create database session (to have independent testing)
TEST_DB_URL = "sqlite:///./test.db"
test_engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    """
    Note: Similar to get_db() from main.py, but use TestingSessionLocal for testing database instead of SessionLocal
    """
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture()
def test_db():
    """
    Recall fixtures are just functions used before each test is run.
    In this case, we want database to be created and dropped for each test.
    """
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

app.dependency_overrides[get_db_main] = override_get_db
app.dependency_overrides[get_db_auth] = override_get_db

client = TestClient(app)