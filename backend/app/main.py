import os
from datetime import datetime, timedelta
from typing import Optional

from email_validator import EmailNotValidError, validate_email
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from . import crud, models, schemas
from .database import SessionLocal, engine
from .dependencies import (ACCESS_TOKEN_EXPIRE_MINUTES, DOCUMENT_KEY_WORKOUT,
                           oauth2_scheme)
from .routers import users, workouts

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
}


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router)
app.include_router(workouts.router)
