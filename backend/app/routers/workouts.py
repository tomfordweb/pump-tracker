from fastapi import APIRouter, Depends

from ..dependencies import DOCUMENT_KEY_WORKOUT, oauth2_scheme
from ..schemas import Workout

router = APIRouter()
@router.post("/workouts")
async def create_workout(workout: Workout ):
    """ Create a new workout """
    return {"Broken": True}
    # msg_collection = get_database()[DOCUMENT_KEY_WORKOUT]
    # result = msg_collection.insert_one(workout.dict())
    # return {"insertion": result.acknowledged, "key": str(result.inserted_id) }
