"""
Agent 3: Match Evaluator
Role: Compare candidate profile against job requirements and produce a score.
Thought: Where does this person fit? What's missing? How strong is the match?
Action: LLM call with BOTH agent 1 and agent 2 outputs as context
Observation: Match score, skill gaps, analysis text
"""
from app.services.llm import call_llm_json
import json


PROMPT = """You are a senior technical hiring consultant evaluating a candidate-job fit.

You have already received structured data from two specialist agents.
Use ONLY this data to evaluate the match — do not re-read raw text.

Candidate Profile (from Resume Reviewer Agent):
{candidate_profile}

Job Requirements (from JD Analyzer Agent):
{job_requirements}

Evaluate the match and return exactly this JSON (no text before or after):
{{
  "match_score": 72,
  "verdict": "Strong Match | Moderate Match | Weak Match",
  "summary": "2-3 sentence overall summary of this candidate for this specific role",
  "match_analysis": "3-4 sentence honest analysis: what makes them a fit, where they fall short",
  "matched_skills": ["skill that appears in both profile and must-have/nice-to-have"],
  "missing_skills": ["must-have skill from JD not found in candidate profile"],
  "seniority_fit": "Overqualified | Good Fit | Underqualified",
  "experience_gap_years": 1,
  "key_strengths_for_role": ["strength 1 specifically relevant to this role", "strength 2"],
  "biggest_risk": "The single most important concern a hiring manager would have"
}}

Scoring guidelines:
- 85-100: Exceeds all requirements, strong hire
- 70-84: Meets most requirements, likely hire
- 55-69: Meets some requirements, borderline
- 40-54: Notable gaps, unlikely hire
- Below 40: Poor fit
Be honest. Don't inflate scores."""


def _run_agent_sync(candidate_profile: dict, job_requirements: dict) -> dict:
    from smolagents import ToolCallingAgent
    from app.services.llm import get_smol_model
    import re
    
    agent = ToolCallingAgent(
        tools=[],  # Evaluator just reasons on data
        model=get_smol_model(),
        max_steps=3
    )
    prompt = PROMPT.format(
        candidate_profile=json.dumps(candidate_profile, indent=2),
        job_requirements=json.dumps(job_requirements, indent=2),
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
            try:
                return json.loads(match.group())
            except Exception as inner_e:
                raise ValueError(f"Match Evaluator inner JSON error: {inner_e}\nRaw String:\n{text}")
        raise ValueError(f"Match Evaluator returned invalid JSON: {text}")

async def run(candidate_profile: dict, job_requirements: dict) -> dict:
    """
    Agent 3: Match Evaluator (now a ToolCallingAgent)
    Runs synchronously in a thread pool to avoid blocking the async event loop.
    """
    import asyncio
    return await asyncio.to_thread(_run_agent_sync, candidate_profile, job_requirements)
