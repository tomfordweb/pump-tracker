import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Path, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import crud, schemas
from .database import SessionLocal, engine
from .schemas import Token, TokenData, User, UserCreate, Workout

DOCUMENT_KEY_BASE = "pumps"
DOCUMENT_KEY_WORKOUT = "workout"
DOCUMENT_KEY_USER = "user"

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db:Session, username: str, password: str):
    user = crud.get_user_by_username(db, username)

    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    user = crud.get_user_by_username(db, token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_exercise_from_path(
        exercise_id: int = Path('exercise_id'), 
        database: Session = Depends(get_db)
    ):
    exercise = crud.get_exercise(database, exercise_id)
    if exercise is None:
        raise HTTPException(
            status_code=404,
            headers={"WWW-Authenticate": "Bearer"}
        )
    return exercise

async def get_current_user_exercise_from_path(exercise: schemas.Exercise = Depends(get_exercise_from_path), user: User = Depends(get_current_active_user)):
    if user.id != exercise.owner_id:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return exercise


async def get_microcycle_from_path(microcycle_id: int = Path('microcycle_id'), database: Session = Depends(get_db)):
    microcycle = crud.get_microcycle(database, microcycle_id)
    if microcycle is None:
        raise HTTPException(
            status_code=404,
            headers={"WWW-Authenticate": "Bearer"}
        )
    return microcycle

async def get_workout_from_path(workout_id: int = Path('workout_id'), database: Session = Depends(get_db)):
    workout = crud.get_workout(database, workout_id)
    if workout is None:
        raise HTTPException(
            status_code=404,
            headers={"WWW-Authenticate": "Bearer"}
        )
    return workout

async def get_current_user_workout_from_path(workout: Workout = Depends(get_workout_from_path), user: User = Depends(get_current_active_user)):
    if user.id != workout.owner_id:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return workout

async def get_public_workout_from_path(workout: Workout = Depends(get_workout_from_path), user: User = Depends(get_current_active_user)):
    if user.id == workout.owner_id:
        """ If the user owns the workout they can view the private workout """
        return workout

    if workout.is_public is False:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return workout

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
