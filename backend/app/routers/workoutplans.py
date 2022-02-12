from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import get_current_active_user, get_db

router = APIRouter()
@router.post("/microcycles")
async def create_workout(workout: schemas.PlanCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout_plan(db, workout, current_user)
    return workout

@router.get("/microcycles")
async def get_workout_plans(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plans = crud.get_plans(db)
    return plans

@router.get("/microcycles/{plan_id}")
async def get_workout_plan(plan_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plan = crud.get_plan(db, plan_id)
    return plan

@router.post("/microcycles/{plan_id}/{workout_id}")
async def add_workout_to_plan(plan_id:int, workout_id:int, data: schemas.WorkoutPlanWorkoutAssociate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.get_workout(db, workout_id)

    plan = crud.get_plan(db, plan_id)
    plan.workouts.append(workout)

    return workout

@router.delete("/microcycles/{plan_id}/{workout_id}")
async def remove_workout_from_plan(plan_id:int, workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    # Tthis is 
    plan = crud.get_plan(db, workout_id)
    workout = crud.get_workout(db, workout_id)
    plan.workouts.remove(workout)
    return workout
