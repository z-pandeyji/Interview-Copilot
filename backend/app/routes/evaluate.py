from fastapi import APIRouter, HTTPException
from typing import Any
from pydantic import ValidationError
from app.schemas.analyze import EvaluateRequest, EvaluateResponse
from app.services.agents.answer_evaluator_agent import run as run_evaluator

router = APIRouter()

@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_answer(request: EvaluateRequest) -> Any:
    """
    Evaluates a candidate's answer to an interview question.
    Uses the Tool-equipped Answer Evaluator Agent to provide a score,
    missing points, and constructive feedback.
    """
    try:
        # Run the evaluator agent
        result_dict = await run_evaluator(
            question=request.question,
            user_answer=request.user_answer,
            role_context=request.role_context
        )
        
        # Track weaknesses in Session Memory
        from app.services.memory_manager import update_user_memory
        update_user_memory(
            user_id="default_user", 
            score=result_dict.get("score", 0), 
            missing_points=result_dict.get("missing_points", [])
        )
        
        return EvaluateResponse(**result_dict)
    except ValidationError as e:
        raise HTTPException(status_code=500, detail=f"LLM returned invalid schema: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {e}")
