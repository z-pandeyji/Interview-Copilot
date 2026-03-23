# AI Interview Copilot - Fast Build Roadmap

## Course anchor
Primary course:
- Hugging Face Agents Course

Important parts for this build:
- Unit 1: Introduction to Agents
- Unit 2: Frameworks for AI Agents
- Unit 4: Final Project
- Live 1 explains course scope, units, challenges, and how the course works. :contentReference[oaicite:0]{index=0}

The course also explicitly covers frameworks such as smolagents, LlamaIndex, and LangGraph, plus a final project/certification path. :contentReference[oaicite:1]{index=1}

---

## Final product vision
Input:
- Resume
- Job Description

Output:
- Resume Summary
- Match Analysis
- Interview Questions
- Improvement Suggestions

Later expansion:
- Match score
- Matched skills
- Missing skills
- 7-day action plan
- Interactive answer evaluation
- Memory

---

## Stack
Frontend:
- Next.js
- Tailwind CSS

Backend:
- Python FastAPI

LLM:
- Ollama first for local fast iteration
- Gemini API as fallback/upgrade

Why this stack:
- Next.js gives fast UI iteration
- FastAPI gives clean API structure
- Ollama is already suggested in the course onboarding as a local option when credits are limited. :contentReference[oaicite:2]{index=2}

---

## Learning rule for every phase
For every phase, learn these 4 things:
1. Concept
2. Why it is needed
3. How we use it in this project
4. What can break

---

# Phase 1 - Define MVP

## Build
Create the simplest working input-output system.

Inputs:
- resume text
- jd text

Outputs:
- summary
- match analysis
- interview questions
- improvements

## Learn repeatedly
### Topic: MVP
- Meaning: smallest useful product
- Why: avoids overbuilding
- Use here: prove value before agents
- Common mistake: adding auth, DB, dashboards too early

### Topic: Input/Output contract
- Meaning: fixed request and response structure
- Why: keeps frontend and backend aligned
- Use here: same schema in all phases
- Common mistake: changing output shape randomly

## Deliverable
- Static screen design approved
- Final output schema decided

---

# Phase 2 - Choose stack

## Build
Project split:
- frontend in Next.js
- backend in FastAPI
- llm client in backend

## Learn repeatedly
### Topic: Frontend vs Backend
- Frontend: user interface
- Backend: processing and LLM calls
- Use here: UI stays clean, AI logic stays server-side
- Common mistake: putting model logic directly in frontend

### Topic: API
- Meaning: contract between frontend and backend
- Use here: frontend sends resume + jd, backend returns analysis
- Common mistake: weak validation and unclear response shape

### Topic: LLM provider abstraction
- Meaning: one service layer can call Ollama or Gemini
- Use here: easy switch later
- Common mistake: hardcoding provider everywhere

## Deliverable
- repo structure decided
- environment variable plan decided

---

# Phase 3 - Build version 0 without real agents

## Step 1 - Create UI
Build:
- 2 textareas
- analyze button
- loading state
- output cards

## Learn repeatedly
### Topic: State management
- Meaning: input, loading, response, error
- Use here: manage form and results
- Common mistake: mixing UI state and data state badly

### Topic: Componentization
- Meaning: split UI into reusable parts
- Use here: textarea card, result card, score card
- Common mistake: giant page file

---

## Step 2 - Build one backend endpoint
Endpoint:
- POST /analyze

Request:
- resume
- job_description

Response:
- summary
- match_analysis
- questions
- improvements

## Learn repeatedly
### Topic: FastAPI route
- Meaning: function exposed as HTTP endpoint
- Use here: single analyzer route
- Common mistake: no request validation

### Topic: Pydantic schema
- Meaning: typed input/output validation
- Use here: request and response models
- Common mistake: returning raw uncontrolled JSON

---

## Step 3 - Use one strong structured prompt
Backend should use one prompt that asks for:
- summary
- match analysis
- interview questions
- improvements
- valid JSON only

## Learn repeatedly
### Topic: Prompt engineering
- Meaning: designing instructions for structured output
- Use here: get stable JSON response
- Common mistake: vague prompt leads to inconsistent output

### Topic: Structured output
- Meaning: fixed JSON response
- Use here: frontend rendering
- Common mistake: model returns prose instead of parseable JSON

### Topic: Parsing and validation
- Meaning: validate model output before sending to frontend
- Use here: avoid broken UI
- Common mistake: trusting raw model output blindly

## Deliverable
- working v0 app with real LLM output
- no agents yet

---

# Phase 4 - Make it feel like a product

## Build
Add:
- match score
- top matched skills
- missing skills
- top 10 questions
- 7-day action plan

UX:
- sample resume
- sample jd
- copy buttons
- loading state
- export later

## Learn repeatedly
### Topic: UX polish
- Meaning: make output usable, not just functional
- Use here: buttons, layout, sectioning
- Common mistake: technically works but feels bad to use

### Topic: Heuristic scoring
- Meaning: rough scoring formula before deeper evaluation
- Use here: show match score
- Common mistake: pretending score is perfectly accurate

### Topic: Information hierarchy
- Meaning: show most important things first
- Use here: score, matched skills, missing skills, action plan
- Common mistake: dumping long text first

## Deliverable
- demo-ready single-flow product

---

# Phase 5 - Convert to true agent system

## Build
Split into 4 agent roles:
1. Resume Reviewer
2. JD Analyzer
3. Match Evaluator
4. Mock Interview Generator

The course explains core agent ideas like actions, and shows frameworks for building agent workflows including smolagents, LlamaIndex, and LangGraph. :contentReference[oaicite:3]{index=3}

## Learn repeatedly
### Topic: Agent
- Meaning: model that reasons and can decide actions/tools
- Use here: split one large task into specialized roles
- Common mistake: calling any prompt chain an agent without structure

### Topic: Thoughts, Actions, Observations
- Meaning:
  - Thought = reasoning step
  - Action = tool call / operation
  - Observation = result of that action
- Use here: each role becomes traceable
- Common mistake: hidden spaghetti logic

### Topic: Workflow
- Meaning: ordered steps with clear responsibilities
- Use here: reviewer -> analyzer -> evaluator -> generator
- Common mistake: one giant agent doing everything badly

## Deliverable
- modular backend services behaving like agents

---

# Phase 6 - Add tools, not just prompts

## Build
Add tools:
- resume parser
- skill extractor
- jd keyword extractor
- question bank retriever
- answer evaluator
- later: company research

The course’s agent material emphasizes that actions are concrete operations, often represented as JSON or code, and frameworks then organize those actions into workflows. :contentReference[oaicite:4]{index=4}

## Learn repeatedly
### Topic: Tool calling
- Meaning: model uses external function/tool
- Use here: parsing, extraction, retrieval, evaluation
- Common mistake: using LLM for everything even when deterministic code is better

### Topic: Deterministic vs non-deterministic logic
- Deterministic: parser, regex, keyword extractor
- Non-deterministic: summary, feedback, question generation
- Use here: mix code tools + LLM reasoning
- Common mistake: overusing the model

### Topic: Retrieval
- Meaning: fetch relevant information from a set
- Use here: question bank and later company data
- Common mistake: no ranking, noisy results

## Deliverable
- hybrid system: tools + LLM

---

# Phase 7 - Add answer evaluation loop

## Build
Flow:
1. system asks question
2. user answers
3. evaluator scores:
   - relevance
   - clarity
   - depth
   - confidence
   - missing points

Output:
- score / 10
- ideal answer structure
- rewritten stronger version

## Learn repeatedly
### Topic: Evaluation rubric
- Meaning: fixed criteria for judging answers
- Use here: consistent interview scoring
- Common mistake: random feedback with no scoring basis

### Topic: Conversational loop
- Meaning: multi-turn interaction
- Use here: ask -> answer -> evaluate -> improve
- Common mistake: stateless design loses context

### Topic: Feedback generation
- Meaning: explain what was weak and how to improve
- Use here: strongest product value
- Common mistake: only scoring, no actionable improvement

## Deliverable
- interactive mock interview MVP

# Phase 8 - Add memory

## Build
Store:
- resume versions
- previous answers
- weak topics
- repeated mistakes
- target roles

Show:
- improvement over time
- recurring weak areas
- better personalized questions

## Learn repeatedly
### Topic: Memory
- Meaning: storing useful past context
- Use here: personalized coaching
- Common mistake: saving everything with no retrieval strategy

### Topic: User profile state
- Meaning: stable traits and history
- Use here: better future interview sessions
- Common mistake: mixing temporary session data with long-term memory

## Deliverable
- retention-focused product

---

# Fast execution order

## Week 1
- Phase 1
- Phase 2
- Phase 3

## Week 2
- Phase 4
- Phase 5

## Week 3
- Phase 6
- Phase 7

## Week 4
- Phase 8

---

# Folder direction

## Frontend
- app/
- components/
- lib/api.ts
- types/

## Backend
- app/main.py
- app/routes/analyze.py
- app/services/llm.py
- app/services/prompts.py
- app/services/agents/
- app/services/tools/
- app/schemas/

---

# Repeated topics list you must master
These will come again and again:
- API
- request/response schema
- validation
- prompt engineering
- structured JSON output
- state management
- agents
- tools
- observations
- workflows
- evaluation
- memory

