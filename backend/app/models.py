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
    exercises = relationship("Exercise", back_populates="owner")
    microcycles = relationship("Microcycle", back_populates="owner")



workout_exercise_association_table = Table('workout_exercise', Base.metadata,
    Column('workouts_id', ForeignKey('workouts.id')),
    Column('exercises_id', ForeignKey('exercises.id'))
)

class MicrocycleWorkout(Base):
    __tablename__ = 'microcycle_workout'
    id = Column(Integer, primary_key=True, index=True)

    microcycle_id = Column(Integer, ForeignKey('microcycles.id'))
    workout_id = Column(Integer, ForeignKey('workouts.id'))
    # TODO: Add user_id

    microcycle_index = Column(Integer)


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

    microcycles = relationship("MicrocycleWorkout",  backref="workouts", primaryjoin=id == MicrocycleWorkout.workout_id)
    exercises = relationship("Exercise", secondary=workout_exercise_association_table)

class Microcycle(Base):
    """
    A microcycle
    It contains many workouts
    """

    __tablename__ = "microcycles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    avatar_id = Column(Integer, index=True)
    length_in_days = Column(Integer)
    date_created = Column(DateTime)
    date_updated = Column(DateTime)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="microcycles")

    workout_sessions = relationship("MicrocycleWorkout",  backref="plans", primaryjoin=id == MicrocycleWorkout.microcycle_id)


class Exercise(Base):
    """
    A user performs many exercises per workout
    """
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    description = Column(String)
    avatar_id = Column(Integer, index=True)
    date_created = Column(DateTime)
    date_updated = Column(DateTime)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="exercises")
