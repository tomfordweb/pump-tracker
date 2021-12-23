from typing import Optional

from pydantic import BaseModel, validator


class User(BaseModel):
    """ A User that uses the application, authentication is based on this model """
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class UserCreateRequest(User):
    """ The request used to create the user """
    password1: str
    password2: str

    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        assert v.isalnum(), 'must be alphanumeric'
        return v

    @validator('email')
    def email_is_a_valid_address(cls, v):
        validate_email(v)
        return v

    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password1' in values and v != values['password1']:
            raise ValueError('passwords do not match')
        return v

class PublicUserInDB(User):
    """ A user Model that can be returned in responses """
    _id: str

class InsertionResponse(BaseModel):
    """ A successfuly entered response"""
    key: str
    insertion: bool

class PrivateUserInDB(PublicUserInDB):
    """ A user Model with any any fields that should not be returned in a response """
    hashed_password: str
    disabled: Optional[bool] = None
    password: str

class TokenData(BaseModel):
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str

class Workout(BaseModel):
    """ A workout can contain many exercises """
    name: str
    description: str
