from datetime import timedelta

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from ..dependencies import (ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token,
                            create_user_in_database, get_current_active_user)
from ..models import (InsertionResponse, PrivateUserInDB, PublicUserInDB,
                      Token, TokenData, User, UserCreateRequest, Workout)

router = APIRouter()

@router.post("/token", response_model=Token)
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

@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """ Whoami """
    return current_user

@router.post("/users", response_model=InsertionResponse)
async def create_user(user: UserCreateRequest):
    """ Create a new account to use the appplication """
    result = create_user_in_database(user)

    return {"insertion": result.acknowledged, "key": str(result.inserted_id) }
