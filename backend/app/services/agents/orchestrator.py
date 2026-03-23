"""
Phase 5 Orchestrator
Runs the 4 agents sequentially, passing observations between them.

Pipeline:
  resume_reviewer  ──→ candidate_profile
                              │
  jd_analyzer      ──→ job_requirements
                              │
  match_evaluator  (profile + requirements) ──→ match_evaluation
                              │
  interview_generator (profile + requirements + evaluation) ──→ final output
"""
import asyncio
from app.services.agents import resume_reviewer, jd_analyzer, match_evaluator, interview_generator
from app.schemas.analyze import AnalyzeResponse


async def run_pipeline(resume: str, job_description: str) -> AnalyzeResponse:
    """
    Orchestrate the 4-agent pipeline sequentially.

    Agent 1 + Agent 2 run in PARALLEL (independent inputs).
    Agent 3 waits for both (needs their outputs).
    Agent 4 waits for Agent 3 (needs all 3 outputs).
    """

    # ── Step 1: Run Resume Reviewer + JD Analyzer in PARALLEL ─────────────
    # These two agents don't depend on each other → run concurrently
    candidate_profile, job_requirements = await asyncio.gather(
        resume_reviewer.run(resume),
        jd_analyzer.run(job_description),
    )

    # ── Step 2: Run Match Evaluator (needs both profiles) ──────────────────
    match_evaluation = await match_evaluator.run(
        candidate_profile=candidate_profile,
        job_requirements=job_requirements,
    )

    # ── Step 3: Run Interview Generator (needs everything) ─────────────────
    interview_output = await interview_generator.run(
        candidate_profile=candidate_profile,
        job_requirements=job_requirements,
        match_evaluation=match_evaluation,
    )

    # ── Merge all agent observations into AnalyzeResponse ─────────────────
    return AnalyzeResponse(
        summary=candidate_profile.get("summary", ""),
        match_analysis=match_evaluation.get("match_analysis", ""),
        match_score=int(match_evaluation.get("match_score", 0)),
        matched_skills=match_evaluation.get("matched_skills", []),
        missing_skills=match_evaluation.get("missing_skills", []),
        questions=interview_output.get("questions", []),
        improvements=interview_output.get("improvements", []),
        action_plan=interview_output.get("action_plan", []),
    )
