from fastapi import APIRouter, Depends

from ..dependencies import DOCUMENT_KEY_WORKOUT, get_database, oauth2_scheme
from ..models import InsertionResponse, Workout

router = APIRouter()
@router.post("/workouts", response_model=InsertionResponse)
async def create_workout(workout: Workout, token:str = Depends(oauth2_scheme)):
    """ Create a new workout """
    msg_collection = get_database()[DOCUMENT_KEY_WORKOUT]
    result = msg_collection.insert_one(workout.dict())
    return {"insertion": result.acknowledged, "key": str(result.inserted_id) }
