"""
Agent 4: Mock Interview Generator
Role: Generate tailored interview questions AND a 7-day prep action plan.
Tools: retrieve_questions
"""
from app.services.llm import get_smol_model
from app.services.tools.question_bank import retrieve_questions
import asyncio
import json
import re

PROMPT = """You are a mock interview coach and career strategist.

You have full context about a candidate and a job.
Use this to generate hyper-specific, useful interview preparation content.

Candidate Profile:
{candidate_profile}

Job Requirements:
{job_requirements}

Match Evaluation:
{match_evaluation}

Tools available to you:
- `retrieve_questions(topic, difficulty)`: MUST use this to get standardized, high-quality questions for the primary skills required by the job.

INSTRUCTIONS:
1. Examine the required skills in the Job Requirements.
2. Call `retrieve_questions` 1-3 times based on the core skills needed.
3. Use the retrieved questions for the technical part of your output.
4. Invent any remaining questions tailored specifically to the candidate's resume gaps or behavioral needs.

Generate exactly this JSON (no text before or after, just the JSON string):
{{
  "questions": [
    "Question 1 (from tool) — technical, specific to their background and the role",
    "Question 2 (from tool) — technical",
    "...up to 10 questions total..."
  ],
  "improvements": [
    "Improvement 1 — specific to their resume gaps for this role",
    "Improvement 2 — skill they need to highlight better",
    "...up to 5..."
  ],
  "action_plan": [
    "Day 1: Specific action targeting the biggest weakness",
    "Day 2: Study or build something",
    "...up to 7 days..."
  ]
}}

Your FINAL ANSWER must be ONLY the raw JSON string."""


def _run_agent_sync(candidate_profile: dict, job_requirements: dict, match_evaluation: dict) -> dict:
    from smolagents import ToolCallingAgent
    agent = ToolCallingAgent(
        tools=[retrieve_questions],
        model=get_smol_model(),
        max_steps=5
    )
    prompt = PROMPT.format(
        candidate_profile=json.dumps(candidate_profile, indent=2),
        job_requirements=json.dumps(job_requirements, indent=2),
        match_evaluation=json.dumps(match_evaluation, indent=2),
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
        raise ValueError(f"Interview Gen returned invalid JSON: {text[:200]}")


async def run(
    candidate_profile: dict,
    job_requirements: dict,
    match_evaluation: dict,
) -> dict:
    """
    Agent 4: Mock Interview Generator (now a ToolCallingAgent)
    Runs synchronously in a thread pool to avoid blocking the async event loop.
    """
    return await asyncio.to_thread(
        _run_agent_sync, 
        candidate_profile, 
        job_requirements, 
        match_evaluation
    )
