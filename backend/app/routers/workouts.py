from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import get_current_active_user, get_db

router = APIRouter()
@router.get("/workouts")
async def get_workout_list(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: grab private workouts if owned by user
    return workouts

@router.get("/workouts/{workout_id}")
async def get_workout_detail(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: Check if workout is public, or owned by user
    return workouts

@router.put("/workouts/{workout_id}")
async def update_workout_detail(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: ensure user can edit workout
    return workouts

@router.post("/workouts/{workout_id}/{exercise_id}")
async def add_exercise_to_workout(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: ensure user owns the workout
    return workouts

@router.delete("/workouts/{workout_id}/{exercise_id}")
async def remove_exercise_from_workout(workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    # TODO: ensure user owns the workout
    return workouts

@router.post("/workout")
async def create_workout(workout: schemas.WorkoutCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout(db, workout, current_user)
    return workout
