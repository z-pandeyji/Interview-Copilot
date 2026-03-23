"""
Agent 1: Resume Reviewer
Role: Parse and summarize the candidate's resume into structured data.
Tools: parse_contact_info, extract_verified_skills
"""
from app.services.llm import get_smol_model
from app.services.tools.resume_parser import parse_contact_info
from app.services.tools.skill_extractor import extract_verified_skills
import asyncio
import json
import re

PROMPT = """You are a senior technical recruiter reviewing a candidate's resume.

Your ONLY job is to extract structured information from this resume.

Resume:
{resume}

You have tools available:
- `parse_contact_info`: use it to grab email/phone reliably.
- `extract_verified_skills`: use it to find verified list of hard tech skills in the text.

Call these tools first to gather verified facts, then synthesize the final profile.
Return exactly this JSON (no text before or after, just the JSON object):
{{
  "candidate_name": "Full name if found (from text or email), else 'Candidate'",
  "email": "Email from contact tool",
  "phone": "Phone from contact tool",
  "total_years_experience": 3,
  "seniority_level": "Junior | Mid | Senior | Lead",
  "primary_skills": ["verified_skill1", "verified_skill2"],
  "secondary_skills": ["other_skill1", "other_skill2"],
  "domains": ["Web Development", "Data Engineering"],
  "recent_role": "Most recent job title",
  "recent_company": "Most recent company name",
  "education": "Highest degree and field",
  "summary": "2-3 sentence sharp summary of this person's professional profile",
  "strengths": ["strength1", "strength2"],
  "red_flags": ["gaps, short tenures, missing info or empty list"]
}}

Be precise. Your FINAL ANSWER must be ONLY the raw JSON string."""


def _run_agent_sync(resume: str) -> dict:
    from smolagents import ToolCallingAgent
    agent = ToolCallingAgent(
        tools=[parse_contact_info, extract_verified_skills],
        model=get_smol_model(),
        max_steps=4
    )
    prompt = PROMPT.format(resume=resume)
    result = agent.run(prompt)
    
    # Clean the result to ensure JSON parsing
    text = str(result)
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    text = re.sub(r"```\s*$", "", text).strip()
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Resume Reviewer returned invalid JSON: {text[:200]}")


async def run(resume: str) -> dict:
    """
    Agent 1: Resume Reviewer (now a ToolCallingAgent)
    Runs synchronously in a thread pool to avoid blocking the async event loop.
    """
    return await asyncio.to_thread(_run_agent_sync, resume)
