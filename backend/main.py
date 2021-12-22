import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from pymongo import MongoClient

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
}

DOCUMENT_KEY_BASE = "pumps"
DOCUMENT_KEY_WORKOUT = "workout"
DOCUMENT_KEY_USER = "user"

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



class User(BaseModel):
    """ A User that uses the application, authentication is based on this model """
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class UserCreateRequest(User):
    """ The request used to create the user """
    password: str

class PublicUserInDB(User):
    """ A user Model that can be returned in responses """
    _id: str

class InsertionResponse(BaseModel):
    """ A successfuly entered response"""
    _id: str
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


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

async def get_current_user(token: str = Depends(oauth2_scheme)):
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
    user = get_user(fake_users_db, username=token_data.username)
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

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """ Creates a token to login to the app, we return it via the response model"""
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """ Whoami """
    return current_user

@app.post("/users", response_model=InsertionResponse)
async def create_user(user: UserCreateRequest):
    """ Create a new account to use the appplication """
    with MongoClient(os.getenv('MONGODB_URI')) as client:
        msg_collection = client[DOCUMENT_KEY_BASE][DOCUMENT_KEY_USER]
        result = msg_collection.insert_one(user.dict())
        # TODO: return token
        return {"insertion": result.acknowledged, "_id": str(result.inserted_id) }

@app.post("/workouts", response_model=InsertionResponse)
async def create_workout(workout: Workout, token:str = Depends(oauth2_scheme)):
    """ Create a new workout """
    with MongoClient(os.getenv('MONGODB_URI')) as client:
        msg_collection = client[DOCUMENT_KEY_BASE][DOCUMENT_KEY_WORKOUT]
        result = msg_collection.insert_one(workout.dict())
        return {"insertion": result.acknowledged, "_id": str(result.inserted_id) }
