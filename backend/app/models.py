from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Table)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    disabled = Column(Boolean, default=False)
    workouts = relationship("Workout", back_populates="owner")
    workout_plans = relationship("Plan", back_populates="owner")


plan_workout_association_table = Table('plan_workout', Base.metadata,
    Column('plans_id', ForeignKey('plans.id')),
    Column('workouts_id', ForeignKey('workouts.id'))
)

workout_exercise_association_table = Table('workout_exercise', Base.metadata,
    Column('workouts_id', ForeignKey('workouts.id')),
    Column('exercises_id', ForeignKey('exercises.id'))
)

class Workout(Base):
    """
    A workout is a session at the gym, or exercising in some way
    """
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    is_public = Column(Boolean)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workouts")

    date_created = Column(DateTime)
    date_updated = Column(DateTime)

    exercises = relationship("Exercise", secondary=workout_exercise_association_table)

class Plan(Base):
    """
    A plan is a long term exercise routine.
    It contains many workouts
    """

    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    avatar_id = Column(Integer, index=True)
    date_created = Column(DateTime)
    date_updated = Column(DateTime)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workout_plans")

    workouts = relationship("Workout", secondary=plan_workout_association_table)


class Exercise(Base):
    """
    A user performs many exercises per workout
    """
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    date_created = Column(DateTime)
    date_updated = Column(DateTime)
