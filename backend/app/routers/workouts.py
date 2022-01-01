from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import (get_current_active_user,
                            get_current_user_workout_from_path, get_db,
                            get_public_workout_from_path)

router = APIRouter()
@router.get("/workouts")
async def get_workout_list(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workouts = crud.get_workouts(db)
    return workouts

@router.post("/workouts")
async def create_workout(workout: schemas.WorkoutCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_workout(db, workout, current_user)
    return workout

@router.get("/workouts/{workout_id}")
async def get_workout_detail(
        workout: schemas.Workout = Depends(get_public_workout_from_path)
    ):
    return workout

@router.put("/workouts/{workout_id}")
async def update_workout_detail(
        workout: schemas.WorkoutUpdate, 
        stored_workout: schemas.Workout = Depends(get_current_user_workout_from_path), 
        current_user: schemas.User = Depends(get_current_active_user), 
        db: Session = Depends(get_db) 
    ):
    workouts = crud.update_workout(db, stored_workout.id, workout)
    # TODO: ensure user can edit workout
    return workouts

# Not ready yet
# @router.post("/workouts/{workout_id}/{exercise_id}")
# async def add_exercise_to_workout(
#         workout_id:int, 
#         current_user: schemas.User = Depends(get_current_active_user), 
#         db: Session = Depends(get_db)
#     ):
#     workouts = crud.get_workouts(db)
#     # TODO: ensure user owns the workout
#     return workouts

# @router.delete("/workouts/{workout_id}/{exercise_id}")
# async def remove_exercise_from_workout(
#         workout_id:int, 
#         current_user: schemas.User = Depends(get_current_active_user), 
#         db: Session = Depends(get_db)
#     ):
#     workouts = crud.get_workouts(db)
#     # TODO: ensure user owns the workout
#     return workouts
