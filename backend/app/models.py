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


workout_plan_association_table = Table('workout_plan', Base.metadata,
    Column('plans_id', ForeignKey('plans.id')),
    Column('workouts_id', ForeignKey('workouts.id'))
)

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    is_public = Column(Boolean)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workouts")
    date_created = Column(DateTime)
    date_updated = Column(DateTime)


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    avatar_id = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workout_plans")
    date_created = Column(DateTime)
    date_updated = Column(DateTime)

    workouts = relationship("Workout", secondary=workout_plan_association_table)
