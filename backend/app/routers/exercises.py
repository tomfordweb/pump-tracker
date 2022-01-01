from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import get_current_active_user, get_db

router = APIRouter()
@router.get("/exercises")
async def get_exercise_list(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: grab private workouts if owned by user
    return workouts

@router.get("/exercises/{exercise_id}")
async def get_exercise_detail(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: Check if workout is public, or owned by user
    return workouts

@router.put("/exercises/{exercise_id}")
async def update_exercise_detail(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: ensure user can edit workout
    return workouts

@router.post("/exercises")
async def create_exercise(workout: schemas.WorkoutCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout(db, workout, current_user)
    return workout
