from typing import List, Optional

from email_validator import validate_email
from pydantic import BaseModel, validator


class WorkoutBase(BaseModel):
    name: str
    description: str

class WorkoutCreate(WorkoutBase):
    pass

class Workout(WorkoutBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

    @validator('email')
    def email_is_a_valid_address(cls, v):
        validate_email(v)
        return v

class User(UserBase):
    """ A User that uses the application, authentication is based on this model """
    id: int
    username: str
    full_name: Optional[str] = None
    workouts: List[Workout] = []

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    """ The request used to create the user """
    password1: str
    password2: str

    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        assert v.isalnum(), 'must be alphanumeric'
        return v


    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password1' in values and v != values['password1']:
            raise ValueError('passwords do not match')
        return v

    class Config:
        schema_extra = {
            "example": {
                "username": "johnexample",
                "email": "john@example.com",
                "password1": "secret",
                "password2": "secret"
            }
        }


class TokenData(BaseModel):
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
