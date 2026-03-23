export interface AnalyzeRequest {
  resume: string;
  job_description: string;
}

export interface AnalyzeResponse {
  summary: string;
  match_analysis: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  questions: string[];
  improvements: string[];
  action_plan: string[];
}

export type AppState = "idle" | "loading" | "success" | "error";

export type InputMode = "text" | "pdf";

export interface EvaluateRequest {
  question: string;
  user_answer: string;
  role_context: string;
}

export interface EvaluateResponse {
  score: number;
  feedback: string;
  missing_points: string[];
  ideal_answer: string;
}
