from pydantic import BaseModel, Field
from typing import List


class AnalyzeRequest(BaseModel):
    resume: str = Field(..., min_length=10, description="The candidate's resume text")
    job_description: str = Field(..., min_length=10, description="The target job description text")


class AnalyzeResponse(BaseModel):
    summary: str = Field(..., description="A concise summary of the candidate's profile")
    match_analysis: str = Field(..., description="How well the candidate matches the job description")
    match_score: int = Field(..., ge=0, le=100, description="Match score from 0 to 100")
    matched_skills: List[str] = Field(..., description="Skills the candidate has that match the job")
    missing_skills: List[str] = Field(..., description="Skills mentioned in the JD that the candidate lacks")
    questions: List[str] = Field(..., description="Top 10 tailored interview questions")
    improvements: List[str] = Field(..., description="Actionable suggestions to improve the resume or candidacy")
    action_plan: List[str] = Field(..., description="7-day action plan to improve candidacy for this role")

class EvaluateRequest(BaseModel):
    question: str = Field(..., min_length=5, description="The interview question asked")
    user_answer: str = Field(..., min_length=2, description="The user's provided answer")
    role_context: str = Field(..., description="The role and seniority context for the interview")

class EvaluateResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="The score out of 100")
    feedback: str = Field(..., description="Actionable feedback on the answer")
    missing_points: list[str] = Field(..., description="Key concepts the candidate missed")
    ideal_answer: str = Field(..., description="A strong, idealized answer example")
