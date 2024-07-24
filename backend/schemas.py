from pydantic import BaseModel

class LogBase(BaseModel):
    description: str
    datetime: str

class Log(LogBase):
    """
    Used for reading/returning from API, since we now know `id` and `author_id`
    """
    id: int
    author_id: int
    
    class Config:
        """
        Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict, but an ORM model (or any other arbitrary object with attributes).
        """
        orm_mode = True

class UserBase(BaseModel):
    email: str
    password: str

class User(UserBase):
    """
    Used for reading/returning from API, since we now know `id` and `logs`
    """
    id: int
    logs: list[Log] = []

    class Config:
        """
        Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict, but an ORM model (or any other arbitrary object with attributes).
        """
        orm_mode = True

