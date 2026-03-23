from fastapi import APIRouter
from app.services.memory_manager import get_user_memory

router = APIRouter()

@router.get("/progress")
async def get_progress(user_id: str = "default_user"):
    """
    Retrieves the candidate's session memory, including their moving average
    score across mock interviews and a compiled list of their technical weaknesses.
    """
    return get_user_memory(user_id)
