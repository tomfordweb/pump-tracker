from fastapi import FastAPI

from . import models, routers
from .database import engine
from .routers import exercises, users, workoutplans, workouts

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(users.router)
app.include_router(workouts.router)
app.include_router(workoutplans.router)
app.include_router(exercises.router)
