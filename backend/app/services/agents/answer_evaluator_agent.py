"""
Agent 5: Answer Evaluator Agent (Phase 7)
Role: Grade a candidate's answer to an interview question.
Tools: evaluate_answer_strict
"""
from app.services.llm import get_smol_model
from app.services.tools.answer_evaluator import evaluate_answer_strict
import asyncio
import json
import re

PROMPT = """You are a senior technical interviewer evaluating a candidate's answer.

Role Context: {role_context}
Question Asked: {question}
Candidate's Answer: {user_answer}

INSTRUCTIONS:
1. Determine 3 to 5 core technical or conceptual points that MUST be included in a strong answer to this question for this specific role.
2. Call the `evaluate_answer_strict` tool. Pass the candidate's answer and your generated list of expected_points.
3. Observe the tool's strict score and the list of missing concepts.
4. Synthesize the final evaluation based on the tool's output. Write actionable feedback and a model 'ideal' answer.

Return exactly this JSON (no text before or after, just the JSON string):
{{
  "score": 85,
  "missing_points": ["Point 1", "Point 2"],
  "feedback": "Your answer was good but lacked depth on X. You should mention Y.",
  "ideal_answer": "A perfect answer would sound like: 'I would approach this by...'"
}}

Your FINAL ANSWER must be ONLY the raw JSON string."""

def _run_agent_sync(question: str, user_answer: str, role_context: str) -> dict:
    from smolagents import ToolCallingAgent
    agent = ToolCallingAgent(
        tools=[evaluate_answer_strict],
        model=get_smol_model(),
        max_steps=4
    )
    prompt = PROMPT.format(
        question=question,
        user_answer=user_answer,
        role_context=role_context
    )
    result = agent.run(prompt)
    
    text = str(result)
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    text = re.sub(r"```\s*$", "", text).strip()
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Evaluator Agent returned invalid JSON: {text[:200]}")

async def run(question: str, user_answer: str, role_context: str) -> dict:
    """
    Grades a candidate's answer using strict keyword matching and LLM synthesis.
    Runs synchronously in a thread pool.
    """
    return await asyncio.to_thread(_run_agent_sync, question, user_answer, role_context)
