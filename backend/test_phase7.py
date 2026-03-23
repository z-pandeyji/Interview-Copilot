import asyncio
from app.services.agents.answer_evaluator_agent import run
import json

async def main():
    question = "Explain the difference between useEffect and useLayoutEffect. When would you use one over the other?"
    user_answer = "useEffect runs asynchronously after render, while useLayoutEffect runs synchronously before the browser paints. I use useEffect normally, but if I need to measure DOM elements and mutate them without causing a visual flicker, I reach for useLayoutEffect."
    role_context = "Senior React Developer"
    
    print("Evaluating answer...")
    result = await run(question, user_answer, role_context)
    
    print("Score:", result.get("score"))
    print("Missing:", result.get("missing_points"))
    print("Feedback:", result.get("feedback"))
    print("\nIdeal Answer:", result.get("ideal_answer"))

if __name__ == "__main__":
    asyncio.run(main())
