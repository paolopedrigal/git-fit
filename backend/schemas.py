from pydantic import BaseModel
from datetime import date, time
from uuid import UUID


class LogBase(BaseModel):
    description: str
    log_date: date
    log_time: time

class Log(LogBase):
    """
    Used for reading/returning from API, since we now know `id` and `author_id`
    """
    id: UUID
    author_id: UUID
    
    class Config:
        """
        Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict, but an ORM model (or any other arbitrary object with attributes).
        """
        orm_mode = True

class UserBase(BaseModel):
    username: str

class User(UserBase):
    """
    Used for reading/returning from API, since we now know `id` and `logs`
    """
    id: UUID
    logs: list[Log] = []

    class Config:
        """
        Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict, but an ORM model (or any other arbitrary object with attributes).
        """
        orm_mode = True

# Separate password in different class so that when "response_model=schemas.User", password is not included in response to client
class UserCreate(UserBase):
    password: str
