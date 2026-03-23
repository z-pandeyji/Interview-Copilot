"use client";

import { useState, useEffect } from "react";

const AGENT_STEPS = [
  {
    id: 1,
    name: "Resume Reviewer",
    desc: "Calling tools (parse_contact_info, extract_verified_skills)…",
    color: "#818cf8",
  },
  {
    id: 2,
    name: "JD Analyzer",
    desc: "Calling tool (extract_jd_keywords) & extracting requirements…",
    color: "#818cf8",
    parallel: true,
  },
  {
    id: 3,
    name: "Match Evaluator",
    desc: "Comparing candidate to role, computing match score…",
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Interview Generator",
    desc: "Calling tool (retrieve_questions) & crafting action plan…",
    color: "#a78bfa",
  },
];

export default function SkeletonResults() {
  const [activeAgent, setActiveAgent] = useState(0);

  // Cycle through agents while loading — purely cosmetic
  useEffect(() => {
    const intervals = [1800, 3600, 5400]; // rough timing
    const timers = intervals.map((ms, i) =>
      setTimeout(() => setActiveAgent(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Agent Pipeline Status ─────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div className="result-label" style={{ marginBottom: "0.375rem" }}>
            <span className="result-label-dot" style={{ background: "#818cf8" }} />
            Agent Pipeline Running
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Agents 1 &amp; 2 run in parallel · Agent 3 &amp; 4 use their combined output
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {AGENT_STEPS.map((agent, i) => {
            const isDone = activeAgent > i;
            const isActive = activeAgent === i;
            const color = isDone ? "#34d399" : isActive ? agent.color : "var(--text-muted)";

            return (
              <div
                key={agent.id}
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "10px",
                  background: isActive ? `rgba(99,102,241,0.07)` : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.18)" : "1px solid transparent",
                  transition: "all 0.4s ease",
                  opacity: activeAgent < i ? 0.4 : 1,
                }}
              >
                {/* Status icon */}
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  background: isDone ? "rgba(52,211,153,0.12)" : isActive ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isDone ? "rgba(52,211,153,0.3)" : isActive ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.4s ease",
                }}>
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isActive ? (
                    <div className="spinner" style={{ width: "12px", height: "12px", border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#818cf8" }} />
                  ) : (
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700 }}>{agent.id}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.83rem", fontWeight: 600, color: isDone ? "#34d399" : isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                      Agent {agent.id}: {agent.name}
                    </span>
                    {agent.parallel && (
                      <span style={{
                        fontSize: "0.6rem", fontWeight: 700, color: "#818cf8",
                        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "4px", padding: "0.05rem 0.35rem", letterSpacing: "0.04em",
                      }}>
                        PARALLEL
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                    {isDone ? "Complete" : isActive ? agent.desc : "Waiting…"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Result card skeletons ─────────────────────────────────────── */}
      {/* Match score */}
      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <div className="skeleton-line" style={{ width: "20%", height: "10px", marginBottom: "1.25rem" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(30,41,59,0.5)", animation: "skeleton-pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[80, 100, 65].map((w, i) => (
              <div key={i} className="skeleton-line" style={{ height: "12px", width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {[0, 1].map((j) => (
          <div key={j} className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
            <div className="skeleton-line" style={{ width: "40%", height: "10px", marginBottom: "1rem" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[60, 80, 55, 74, 66].map((w, i) => (
                <div key={i} className="skeleton-line" style={{ height: "26px", width: `${w}px`, borderRadius: "50px" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
        <div className="skeleton-line" style={{ width: "32%", height: "10px", marginBottom: "1rem" }} />
        {[100, 95, 72].map((w, i) => (
          <div key={i} className="skeleton-line" style={{ height: "12px", width: `${w}%`, marginBottom: "0.5rem" }} />
        ))}
      </div>

      {/* Questions */}
      <div className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
        <div className="skeleton-line" style={{ width: "40%", height: "10px", marginBottom: "1rem" }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "0.875rem", paddingBottom: "0.5rem", marginBottom: "0.375rem" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(30,41,59,0.8)", flexShrink: 0 }} />
            <div className="skeleton-line" style={{ height: "12px", flex: 1 }} />
          </div>
        ))}
      </div>

      {/* Action Plan */}
      <div className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
        <div className="skeleton-line" style={{ width: "35%", height: "10px", marginBottom: "1rem" }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "center", marginBottom: "0.625rem" }}>
            <div style={{ width: "56px", height: "22px", borderRadius: "6px", background: "rgba(30,41,59,0.8)", flexShrink: 0 }} />
            <div className="skeleton-line" style={{ height: "12px", flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
