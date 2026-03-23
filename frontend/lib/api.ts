import { AnalyzeRequest, AnalyzeResponse, EvaluateRequest, EvaluateResponse } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeResume(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function parsePdf(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_BASE}/api/parse-pdf`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `PDF parsing failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.text as string;
}

export async function evaluateAnswer(request: EvaluateRequest): Promise<EvaluateResponse> {
  const response = await fetch(`${API_BASE}/api/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to evaluate answer.");
  }

  const data = await response.json();
  return data;
}

export async function getMemoryProgress(userId: string = "default_user"): Promise<any> {
  const response = await fetch(`${API_BASE}/api/memory/progress?user_id=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch memory progress.");
  }
  return await response.json();
}
