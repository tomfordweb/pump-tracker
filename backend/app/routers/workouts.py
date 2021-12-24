from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import (DOCUMENT_KEY_WORKOUT, get_current_active_user,
                            get_db, oauth2_scheme)

router = APIRouter()
@router.post("/workouts")
async def create_workout(workout: schemas.WorkoutCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout(db, workout, current_user)
    return workout
