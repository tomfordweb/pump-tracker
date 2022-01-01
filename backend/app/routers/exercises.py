from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import (get_current_active_user,
                            get_current_user_exercise_from_path, get_db,
                            get_exercise_from_path)

router = APIRouter()
@router.get("/exercises")
async def get_exercise_list(
        current_user: schemas.User = Depends(get_current_active_user), 
        db: Session = Depends(get_db)
    ):
    exercises = crud.get_exercises(db)
    return exercises

@router.get("/exercises/{exercise_id}")
async def get_exercise_detail(
        exercise: schemas.Exercise = Depends(get_exercise_from_path),
        current_user: schemas.User = Depends(get_current_active_user),
    ):
    return exercise

@router.put("/exercises/{exercise_id}")
async def update_exercise_detail(
        exercise_update:schemas.ExerciseUpdate, 
        stored_exercise: schemas.Exercise = Depends(get_current_user_exercise_from_path),
        current_user: schemas.User = Depends(get_current_active_user), 
        db: Session = Depends(get_db) 
    ):
    exercise = crud.update_exercise(db, stored_exercise.id, exercise_update)
    return exercise

@router.post("/exercises")
async def create_exercise(
        exercise: schemas.ExerciseCreate, 
        current_user: schemas.User = Depends(get_current_active_user), 
        db: Session = Depends(get_db)
    ):
    exercise = crud.create_exercise(db, exercise, current_user)
    return exercise
