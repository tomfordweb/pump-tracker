from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..dependencies import get_current_active_user, get_db

router = APIRouter()
@router.post("/microcycles")
async def create_workout(workout: schemas.MicrocycleCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.create_user_workout_microcycle(db, workout, current_user)
    return workout

@router.get("/microcycles")
async def get_all_microcycles(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plans = crud.get_microcycles(db)
    return plans

@router.get("/microcycles/{plan_id}")
async def get_microcycle(plan_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plan = crud.get_microcycle(db, plan_id)
    return plan

# TODO: Add ordering!
@router.get("/microcycles/{plan_id}/sessions")
async def get_microcycle_sessions(plan_id:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    plan = crud.get_microcycle(db, plan_id)
    if plan is None:
        raise HTTPException(
            status_code=404,
            headers={"WWW-Authenticate": "Bearer"}
        )

    return plan.workout_sessions

@router.post("/microcycles/{plan_id}/{workout_id}")
async def add_scheduled_workout_to_microcycle(plan_id:int, workout_id:int, data: schemas.MicrocycleWorkoutAssociate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db) ):
    workout = crud.get_workout(db, workout_id)
    micro = crud.get_microcycle(db, plan_id)
    
    item = crud.def_add_workout_to_microcycle(db, data, micro, workout)

    return item

@router.delete("/microcycles/{microcycle_id}/{workout_id}/{microcycle_index}")
async def remove_workout_session_from_microcycle(
        microcycle_id:int, 
        workout_id:int, 
        microcycle_index: int, 
        current_user: schemas.User = Depends(get_current_active_user), 
        db: Session = Depends(get_db) 
    ):
    to_remove = crud.get_microcycle_workout_by_session(db, microcycle_id, workout_id, microcycle_index);
    if to_remove is None:
        raise HTTPException(
            status_code=404,
            headers={"WWW-Authenticate": "Bearer"}
        )
    db.delete(to_remove)
    db.commit();

    return True
