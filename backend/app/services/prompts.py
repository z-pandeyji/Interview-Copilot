def build_analyze_prompt(resume: str, job_description: str) -> str:
    return f"""You are an expert career coach and technical interview specialist.

Analyze the following resume against the job description and return a structured JSON response ONLY.
Do not include any text before or after the JSON. Do not use markdown code blocks.

Resume:
{resume}

Job Description:
{job_description}

Return exactly this JSON structure with ALL fields:
{{
  "summary": "A 2-3 sentence sharp summary of what this candidate brings to the table",
  "match_analysis": "A 3-4 sentence honest analysis of how well this candidate matches the job, including specific strengths and gaps",
  "match_score": 72,
  "matched_skills": [
    "Skill 1 from resume that matches JD",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5"
  ],
  "missing_skills": [
    "Skill required by JD but not found in resume 1",
    "Missing skill 2",
    "Missing skill 3"
  ],
  "questions": [
    "Interview question 1 tailored to this role and candidate",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
    "Question 6",
    "Question 7",
    "Question 8",
    "Question 9",
    "Question 10"
  ],
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2",
    "Specific improvement suggestion 3",
    "Specific improvement suggestion 4",
    "Specific improvement suggestion 5"
  ],
  "action_plan": [
    "Day 1: Specific action to take today",
    "Day 2: Specific action for day 2",
    "Day 3: Specific action for day 3",
    "Day 4: Specific action for day 4",
    "Day 5: Specific action for day 5",
    "Day 6: Specific action for day 6",
    "Day 7: Specific action for day 7"
  ]
}}

Rules:
- match_score must be an integer from 0-100 (realistic, not inflated)
- matched_skills and missing_skills must be short skill names (1-4 words each)
- questions must be exactly 10, specific to THIS role and THIS candidate
- action_plan MUST have exactly 7 items, each starting with "Day N:"
- Be specific to THIS candidate and THIS job description, not generic
- Return ONLY valid JSON, nothing else"""
