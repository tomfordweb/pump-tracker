from fastapi import HTTPException
from sqlalchemy.orm import Session

from . import dependencies, models, schemas

"""
Exercise CRUD
"""
def get_exercises(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Exercise).offset(skip).limit(limit).all()

def get_exercise(db: Session, exercise_id: int):
    return db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()

def create_exercise(db: Session, exercise: schemas.ExerciseCreate, user: schemas.User):
    """
    TODO: Make sure that there is no duplicate name for the exercise FOR THE OWNER. there can be duplicate names but not per owner.
    """
    db_item = models.Exercise(**exercise.dict(), owner_id=user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_exercise(db: Session, exercise_id:int, exercise: schemas.ExerciseUpdate):
    update_data = exercise.dict(exclude_unset=True)
    db.query(models.Exercise).filter(models.Exercise.id == exercise_id).update(update_data)
    db.commit()
    return get_exercise(db, exercise_id)

"""
User CRUD
"""
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = dependencies.get_password_hash(user.password1)
    db_user = models.User(email=user.email, username=user.username, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

"""
Workout CRUD
"""
def get_workouts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Workout).offset(skip).limit(limit).all()

def get_workout(db: Session, workout_id: int):
    workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()

    return workout

def create_workout(db: Session, workout: schemas.WorkoutCreate, user: schemas.User):
    db_item = models.Workout(**workout.dict(), owner_id=user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_workout(db: Session, workout_id:int, workout: schemas.WorkoutUpdate):
    update_data = workout.dict(exclude_unset=True)
    db.query(models.Workout).filter(models.Workout.id == workout_id).update(update_data)
    db.commit()
    return get_workout(db, workout_id)
    

"""
Microcycle/Routine CRUD
"""
def get_microcycles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Microcycle).offset(skip).limit(limit).all()

def get_microcycle(db: Session, microcycle_id: int):
    return db.query(models.Microcycle).filter(models.Microcycle.id == microcycle_id).first()

def get_microcycle_workouts(db: Session, microcycle_id: int):
    return db.query(models.MicrocycleWorkout).all()

def def_add_workout_to_microcycle(db: Session, data: schemas.MicrocycleWorkoutAssociate, microcycle_id: schemas.Microcycle, workout: schemas.Workout):
    db_item = models.MicrocycleWorkout(microcycle_index=data.microcycle_index, microcycle_id=microcycle_id.id, workout_id=workout.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_microcycle_workout_by_session(db: Session, microcycle_id: int, workout_id: int, microcycle_index: int):
    return db.query(models.MicrocycleWorkout).filter(
        models.MicrocycleWorkout.microcycle_id == microcycle_id, 
        models.MicrocycleWorkout.workout_id == workout_id,
        models.MicrocycleWorkout.microcycle_index == microcycle_index
    ).first()

# TODO: is this used?
def create_user_workout_microcycle(db: Session, microcycle: schemas.MicrocycleCreate, user: schemas.User):
    db_item = models.Microcycle(**microcycle.dict(), owner_id=user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# TODO: is this used?
def add_workout_to_user_microcycle(db: Session, workout: schemas.WorkoutCreate, microcycle: schemas.Microcycle, user: schemas.User):
    db_item = models.Workout(**workout.dict(), owner_id=user.id)
    db.add(db_item)
    microcycle.workouts.append(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
