import os
from typing import Optional

from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI()


from pydantic import BaseModel


class Workout(BaseModel):
    name: str
    description: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/workouts")
async def create_workout(workout: Workout):
    """Post a new message to the specified channel."""
    with MongoClient(os.getenv('MONGODB_URI')) as client:
        msg_collection = client['pumps']['workouts']
        result = msg_collection.insert_one(workout.dict())
        return {"insertion": result.acknowledged, "id": str(result.inserted_id) }
