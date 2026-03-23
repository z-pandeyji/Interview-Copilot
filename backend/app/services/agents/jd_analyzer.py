"""
Agent 2: JD Analyzer
Role: Extract structured requirements from the job description.
Tools: extract_jd_keywords
"""
from app.services.llm import get_smol_model
from app.services.tools.jd_keyword_extractor import extract_jd_keywords
import asyncio
import json
import re

PROMPT = """You are an expert hiring manager reading a job description.

Your ONLY job is to extract the structured requirements from this job description.
Do not analyze any resume. Just analyze the job description itself.

Job Description:
{job_description}

You have tools available:
- `extract_jd_keywords`: use it to grab standard domains and seniority level.

Call this tool first to gather verified facts, then synthesize the final profile.
Return exactly this JSON (no text before or after, just the JSON object):
{{
  "role_title": "Exact job title from the JD",
  "company_type": "Startup | Mid-size | Enterprise | Unknown",
  "seniority_required": "Junior | Mid | Senior | Lead (from tool inference)",
  "years_required": 4,
  "must_have_skills": ["skill1", "skill2", "skill3"],
  "nice_to_have_skills": ["skill1", "skill2"],
  "domain": "FinTech | HealthTech | Web Dev | Data | etc. (from tool inference)",
  "responsibilities": ["core responsibility 1", "core responsibility 2"],
  "culture_signals": ["remote-first", "fast-paced", "collaborative"],
  "red_flags": ["vague requirements", "or empty list"]
}}

Be precise. Your FINAL ANSWER must be ONLY the raw JSON string."""


def _run_agent_sync(job_description: str) -> dict:
    from smolagents import ToolCallingAgent
    agent = ToolCallingAgent(
        tools=[extract_jd_keywords],
        model=get_smol_model(),
        max_steps=4
    )
    prompt = PROMPT.format(job_description=job_description)
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
        raise ValueError(f"JD Analyzer returned invalid JSON: {text[:200]}")


async def run(job_description: str) -> dict:
    """
    Agent 2: JD Analyzer (now a ToolCallingAgent)
    Runs synchronously in a thread pool to avoid blocking the async event loop.
    """
    return await asyncio.to_thread(_run_agent_sync, job_description)
