"use client";

import { useState, useEffect } from "react";
import { AnalyzeResponse, EvaluateResponse } from "@/types";
import { evaluateAnswer, getMemoryProgress } from "@/lib/api";

interface ResultCardsProps {
  data: AnalyzeResponse;
}

/* ── Copy Button ──────────────────────────────────────────────────────────── */
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn ${copied ? "copy-btn--done" : ""}`}
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ── Card Header (label + copy) ───────────────────────────────────────────── */
function CardHeader({
  dotColor,
  title,
  copyText,
  copyLabel,
}: {
  dotColor: string;
  title: string;
  copyText?: string;
  copyLabel?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
      <div className="result-label" style={{ marginBottom: 0 }}>
        <span className="result-label-dot" style={{ background: dotColor }} />
        {title}
      </div>
      {copyText && <CopyButton text={copyText} label={copyLabel} />}
    </div>
  );
}

/* ── Score Ring ───────────────────────────────────────────────────────────── */
function ScoreRing({ score, matchAnalysis }: { score: number; matchAnalysis: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#00dce5" : score >= 50 ? "#ffb693" : "#ffb4ab";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Weak Match";

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
      {/* Ring */}
      <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease-out, stroke 0.5s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>/ 100</span>
        </div>
      </div>
      {/* Verdict + analysis */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: `${color}18`, border: `1px solid ${color}40`,
          borderRadius: "50px", padding: "0.2rem 0.625rem",
          marginBottom: "0.625rem",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color, letterSpacing: "0.04em" }}>{label}</span>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7 }}>
          {matchAnalysis}
        </p>
      </div>
    </div>
  );
}

/* ── Interactive Question Item ───────────────────────────────────────────── */
function InterviewQuestionItem({ index, question, roleContext, onAnswerResult }: { index: number; question: string; roleContext: string, onAnswerResult: () => void }) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<EvaluateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (answerText.trim().length < 5) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await evaluateAnswer({
        question,
        user_answer: answerText,
        role_context: roleContext
      });
      setFeedback(res);
      setIsAnswering(false);
      onAnswerResult(); // Refresh memory!
    } catch (err: any) {
      setError(err.message || "Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="numbered-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>
      <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
        <span className="numbered-item-num" style={{ marginTop: "0.2rem" }}>{index + 1}</span>
        <div style={{ flex: 1 }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: "1.65", display: "block", marginBottom: "0.5rem" }}>
            {question}
          </span>
          {!isAnswering && !feedback && (
            <button 
              onClick={() => setIsAnswering(true)}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", fontWeight: 600, background: "rgba(0, 220, 229, 0.1)", color: "#00dce5", border: "1px solid rgba(0, 220, 229, 0.2)", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease" }}
            >
              Answer this
            </button>
          )}
        </div>
      </div>

      {isAnswering && (
        <div style={{ width: "100%", paddingLeft: "2.5rem", marginTop: "0.5rem" }}>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Type your mock answer here... Be as detailed as you would in a real interview."
            style={{ width: "100%", minHeight: "100px", padding: "0.875rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-primary)", fontSize: "0.875rem", fontFamily: "inherit", resize: "vertical", marginBottom: "0.5rem" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || answerText.trim().length < 5}
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, background: "#00dce5", color: "#003739", border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting || answerText.trim().length < 5 ? 0.7 : 1 }}
            >
              {isSubmitting ? "Grading..." : "Submit Answer"}
            </button>
            <button 
              onClick={() => setIsAnswering(false)}
              disabled={isSubmitting}
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, background: "transparent", color: "var(--text-muted)", border: "none", cursor: "pointer" }}
            >
              Cancel
            </button>
            {error && <span style={{ color: "#ffb4ab", fontSize: "0.75rem", marginLeft: "auto" }}>{error}</span>}
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ width: "100%", paddingLeft: "2.5rem", marginTop: "0.5rem", animation: "fadeIn 0.4s ease forwards" }}>
          <div style={{ background: "rgba(0, 220, 229, 0.05)", border: "1px solid rgba(0, 220, 229, 0.15)", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>Evaluation Results</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Score</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: feedback.score >= 80 ? "#00dce5" : feedback.score >= 50 ? "#ffb693" : "#ffb4ab" }}>
                  {feedback.score}/100
                </span>
              </div>
            </div>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              {feedback.feedback}
            </p>

            {feedback.missing_points.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#ffb4ab", textTransform: "uppercase", letterSpacing: "0.05em" }}>Missing Concepts</span>
                <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {feedback.missing_points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}

            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#00dce5", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ideal Answer Framework</span>
              <p style={{ margin: "0.5rem 0 0 0", color: "var(--text-secondary)", fontSize: "0.85rem", fontStyle: "italic", lineHeight: 1.6 }}>
                &quot;{feedback.ideal_answer}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function ResultCards({ data }: ResultCardsProps) {
  type TabName = "Overview" | "Skills" | "Questions" | "Action Plan";
  const TABS: TabName[] = ["Overview", "Skills", "Questions", "Action Plan"];

  const [memoryData, setMemoryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const fetchMemory = async () => {
    try {
      const mem = await getMemoryProgress();
      setMemoryData(mem);
    } catch {
      // Ignore initial errors if memory doesn't exist
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  // Flatten text content for copy
  const questionsText = data.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  const improvementsText = data.improvements.join("\n");
  const actionPlanText = data.action_plan.join("\n");
  const allResultsText = `
=== AI INTERVIEW COPILOT ANALYSIS ===

MATCH SCORE: ${data.match_score}/100

SUMMARY:
${data.summary}

MATCH ANALYSIS:
${data.match_analysis}

MATCHED SKILLS: ${data.matched_skills.join(", ")}
MISSING SKILLS: ${data.missing_skills.join(", ")}

TOP ${data.questions.length} INTERVIEW QUESTIONS:
${questionsText}

IMPROVEMENT SUGGESTIONS:
${improvementsText}

7-DAY ACTION PLAN:
${actionPlanText}
`.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* ── Tabs Navigation ── */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", gap: "2.5rem", overflowX: "auto" }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0.875rem 0", fontSize: "0.95rem", 
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? "#00dce5" : "var(--text-muted)",
              borderBottom: activeTab === tab ? "2px solid #00dce5" : "2px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content Area ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.25rem", alignItems: "start" }}>

        {activeTab === "Overview" && (
          <>
            {/* ── ROW 1: Match Score & Session Memory ── */}
            {/* Match Score (Span 4) */}
            <div className="glass-card animate-card-appear delay-100 col-span-12 lg:col-span-4" style={{ padding: "1.75rem", height: "100%" }}>
              <CardHeader
                dotColor="#00dce5"
                title="Match Score"
                copyText={`Match Score: ${data.match_score}/100\n\n${data.match_analysis}`}
                copyLabel="Score"
              />
              <ScoreRing score={data.match_score} matchAnalysis={data.match_analysis} />
            </div>

            {/* Copilot Session Memory (Span 8) */}
            {memoryData && memoryData.total_questions_answered > 0 ? (
              <div className="glass-card animate-card-appear col-span-12 lg:col-span-8" style={{ padding: "1.75rem", background: "rgba(0, 220, 229, 0.05)", border: "1px solid rgba(0, 220, 229, 0.15)", height: "100%" }}>
                 <h3 style={{ margin: "0 0 1rem 0", color: "#00dce5", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                   🧠 Copilot Session Memory
                 </h3>
                 <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                   <div>
                     <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Mock Questions Answered:</span>
                     <span style={{ display: "block", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{memoryData.total_questions_answered}</span>
                   </div>
                   <div>
                     <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Average Score:</span>
                     <span style={{ display: "block", fontSize: "1.2rem", fontWeight: 700, color: memoryData.average_score >= 80 ? "#00dce5" : memoryData.average_score >= 50 ? "#ffb693" : "#ffb4ab" }}>
                       {memoryData.average_score}/100
                     </span>
                   </div>
                   <div style={{ flex: 1, minWidth: "200px" }}>
                     <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>Recurring Weaknesses to Review:</span>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                       {memoryData.recurring_weaknesses.length > 0 ? memoryData.recurring_weaknesses.map((w: string, i: number) => (
                         <span key={i} style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "rgba(255, 180, 171, 0.1)", color: "#ffb4ab", borderRadius: "4px" }}>{w}</span>
                       )) : <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>None yet! Great job.</span>}
                     </div>
                   </div>
                 </div>
              </div>
            ) : (
               <div className="glass-card animate-card-appear col-span-12 lg:col-span-8" style={{ padding: "1.75rem", border: "1px solid var(--border-subtle)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                 <h3 style={{ margin: "0 0 0.5rem 0", color: "#00f5ff", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                   🧠 Copilot Session Memory
                 </h3>
                 <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No mock interviews completed yet. Answer questions in the 'Questions' tab to build your profile memory!</p>
               </div>
            )}

            {/* Candidate Summary (Span 12) */}
            <div className="glass-card animate-card-appear delay-300 col-span-12" style={{ padding: "1.5rem 1.75rem" }}>
              <CardHeader
                dotColor="#d3bdf1"
                title="Candidate Summary"
                copyText={data.summary}
                copyLabel="Summary"
              />
              <p style={{ color: "var(--text-primary)", fontSize: "0.9375rem", lineHeight: "1.75" }}>
                {data.summary}
              </p>
            </div>
          </>
        )}

        {activeTab === "Skills" && (
          <>
            {/* Matched Skills */}
            <div className="glass-card animate-card-appear delay-100 col-span-12 md:col-span-6" style={{ padding: "1.5rem 1.75rem" }}>
              <CardHeader
                dotColor="#00dce5"
                title="Matched Skills"
                copyText={data.matched_skills.join(", ")}
                copyLabel="Skills"
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {data.matched_skills.map((skill, i) => (
                  <span key={i} className="skill-tag skill-tag--matched" style={{ background: "rgba(0, 220, 229, 0.1)", border: "1px solid rgba(0, 220, 229, 0.2)", color: "#00dce5", padding: "0.2rem 0.6rem", fontSize: "0.75rem", borderRadius: "4px" }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card animate-card-appear delay-200 col-span-12 md:col-span-6" style={{ padding: "1.5rem 1.75rem" }}>
              <CardHeader
                dotColor="#ffb4ab"
                title="Missing Skills"
                copyText={data.missing_skills.join(", ")}
                copyLabel="Gaps"
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {data.missing_skills.length > 0 ? data.missing_skills.map((skill, i) => (
                  <span key={i} className="skill-tag skill-tag--missing" style={{ background: "rgba(255, 180, 171, 0.05)", border: "1px solid rgba(255, 180, 171, 0.2)", color: "#ffb4ab", padding: "0.2rem 0.6rem", fontSize: "0.75rem", borderRadius: "4px" }}>{skill}</span>
                )) : (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No significant gaps found 🎉</span>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "Questions" && (
          <div className="glass-card animate-card-appear delay-100 col-span-12" style={{ padding: "1.5rem 1.75rem" }}>
            {/* ── ROW 3: Interview Questions (Span 12) ── */}
            <CardHeader
              dotColor="#00dce5"
              title={`Top ${data.questions.length} Interview Questions`}
              copyText={questionsText}
              copyLabel="Questions"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {data.questions.map((q, i) => (
                <InterviewQuestionItem 
                  key={i} 
                  index={i} 
                  question={q} 
                  roleContext={data.summary}
                  onAnswerResult={fetchMemory}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Action Plan" && (
          <>
            {/* Improvement Suggestions */}
            <div className="glass-card animate-card-appear delay-100 col-span-12 md:col-span-5" style={{ padding: "1.5rem 1.75rem", height: "fit-content" }}>
              <CardHeader
                dotColor="#ffb693"
                title="Improvement Suggestions"
                copyText={improvementsText}
                copyLabel="Tips"
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {data.improvements.map((item, i) => (
                  <div key={i} className="bullet-item">
                    <svg className="bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "3px", flexShrink: 0 }}>
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Action Plan */}
            <div className="glass-card animate-card-appear delay-200 col-span-12 md:col-span-7" style={{ padding: "1.5rem 1.75rem" }}>
              <CardHeader
                dotColor="#00dce5"
                title="7-Day Action Plan"
                copyText={actionPlanText}
                copyLabel="Plan"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.action_plan.map((step, i) => {
                  const colonIdx = step.indexOf(":");
                  const dayLabel = colonIdx > -1 ? step.slice(0, colonIdx) : `Day ${i + 1}`;
                  const taskText = colonIdx > -1 ? step.slice(colonIdx + 1).trim() : step;
                  return (
                    <div key={i} className="action-plan-item">
                      <span className="action-plan-day">{dayLabel}</span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{taskText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── Export All ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5rem" }}>
        <CopyButton text={allResultsText} label="Copy Full Report" />
      </div>

    </div>
  );
}
