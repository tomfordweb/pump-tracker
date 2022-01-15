import datetime
from typing import List, Optional

from email_validator import EmailNotValidError, validate_email
from fastapi import HTTPException, status
from pydantic import BaseModel, validator


class WorkoutUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    is_public: Optional[bool]

class WorkoutBase(BaseModel):
    name: str
    description: str
    is_public: bool

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutPlanWorkoutAssociate(BaseModel):
    workout_id:int
    pass

class UserBase(BaseModel):
    username: str
    email: str

    @validator('email')
    def email_is_a_valid_address(cls, v):
        try:
            validate_email(v)
            return v
        except EmailNotValidError as err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={ "message": "Failed Validation", "field_errors": { "email": str(err) } },
            )


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

class PlanBase(BaseModel):
    name: str
    description: str
    avatar_id: int
    owner_id: int

class PlanCreate(PlanBase):
    pass

class Plan(PlanBase):
    id: int
    date_updated: datetime.date
    date_created: datetime.date
    class Config:
        orm_mode = True


class ExerciseBase(BaseModel):
    name: str

class ExerciseUpdate(BaseModel):
    name: Optional[str]

class ExerciseCreate(ExerciseBase):
    pass

class Exercise(ExerciseBase):
    id: int

    date_updated: datetime.date
    date_created: datetime.date

    class Config:
        orm_mode = True

class Workout(WorkoutBase):
    id: int
    owner_id: int

    exercises: List[Exercise]

    class Config:
        orm_mode = True

class User(UserBase):
    """ A User that uses the application, authentication is based on this model """
    id: int
    username: str
    full_name: Optional[str] = None
    workouts: List[Workout] = []

    class Config:
        orm_mode = True
