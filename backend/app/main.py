from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models, routers
from .database import engine
from .routers import exercises, users, workoutplans, workouts

app = FastAPI()

origins = [
    "http://localhost",
    "http://cypress",
    "http://frontend",
    "http://localhost:3000",
    "http://frontend:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(workouts.router)
app.include_router(workoutplans.router)
app.include_router(exercises.router)
