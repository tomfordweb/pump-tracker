from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import get_current_active_user, get_db

router = APIRouter()
@router.post("/workout-plan")
async def create_workout(workout: schemas.PlanCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout(db, workout, current_user)
    return workout

@router.get("/workout-plan/{plan_id}")
async def get_workout_plan(plan_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plan = crud.get_plan(db, workout_plan)
    return {"plan": plan, "workouts": plan.workouts}

@router.post("/workout-plan/{plan_id}/{workout_id}")
async def add_workout_to_plan(plan_id:int, workout_id:int, link: schemas.WorkoutPlanWorkoutAssociate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.get_workout(db, link.workout_id)
    plan = crud.get_plan(db, plan_id)
    plan.workouts.append(workout)
    return workout

@router.delete("/workout-plan/{plan_id}/{workout_id}")
async def remove_workout_from_plan(plan_id:int, workout_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.get_workout(db, link.workout_id)
    plan = crud.get_workout(db, link.plan_id)
    plan.workouts.append(workout)
    return workout
