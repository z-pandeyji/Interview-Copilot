import json
import os
from typing import List, Dict

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "sessions.json")

def _load_memory() -> dict:
    if not os.path.exists(MEMORY_FILE):
        return {}
    try:
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def _save_memory(data: dict):
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def update_user_memory(user_id: str, score: int, missing_points: List[str]):
    """Appends recent mock interview results to the user's persistent memory state."""
    mem = _load_memory()
    
    if user_id not in mem:
        mem[user_id] = {
            "total_questions_answered": 0,
            "score_history": [],
            "average_score": 0,
            "recurring_weaknesses": []
        }
    
    user_state = mem[user_id]
    user_state["total_questions_answered"] += 1
    user_state["score_history"].append(score)
    
    # Keep last 10 scores for moving average
    if len(user_state["score_history"]) > 10:
        user_state["score_history"].pop(0)
    
    user_state["average_score"] = int(sum(user_state["score_history"]) / len(user_state["score_history"]))
    
    # Add new missing points, keeping only the most recent 15
    user_state["recurring_weaknesses"].extend(missing_points)
    
    # Deduplicate while preserving order (last seen)
    seen = set()
    deduped = []
    for pt in reversed(user_state["recurring_weaknesses"]):
        if pt not in seen:
            seen.add(pt)
            deduped.append(pt)
    
    user_state["recurring_weaknesses"] = list(reversed(deduped))[-15:]
    
    _save_memory(mem)

def get_user_memory(user_id: str) -> dict:
    """Retrieves the user's persistent memory state."""
    return _load_memory().get(user_id, {
        "total_questions_answered": 0,
        "average_score": 0,
        "recurring_weaknesses": []
    })
