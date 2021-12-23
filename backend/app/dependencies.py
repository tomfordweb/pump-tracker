import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from .models import (InsertionResponse, PrivateUserInDB, PublicUserInDB, Token,
                     TokenData, User, UserCreateRequest, Workout)

DOCUMENT_KEY_BASE = "pumps"
DOCUMENT_KEY_WORKOUT = "workout"
DOCUMENT_KEY_USER = "user"

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_database():
    from pymongo import MongoClient

    client = MongoClient(os.getenv('MONGODB_URI'));

    return client[DOCUMENT_KEY_BASE]

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_user_in_database(user: UserCreateRequest):
    user_collection = get_database()[DOCUMENT_KEY_USER]

    if user_collection.find_one( { "email": user.email }):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email is already taken",
        )

    if user_collection.find_one({"username": user.username }):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The username is already taken",
        )

    result = user_collection.insert_one(user.dict())

    return result


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return PrivateUserInDB(**user_dict)

async def get_current_user(database, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(database, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
