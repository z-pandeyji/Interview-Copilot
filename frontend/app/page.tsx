"use client";

import { useState, useRef } from "react";
import { AnalyzeResponse, AppState } from "@/types";
import { analyzeResume, parsePdf } from "@/lib/api";
import AnalyzeButton from "@/components/AnalyzeButton";
import ResultCards from "@/components/ResultCards";
import SkeletonResults from "@/components/SkeletonResults";

const SAMPLE_RESUME = `Software Engineer with 3 years of experience building scalable web applications.

Skills: React, TypeScript, Node.js, Python, PostgreSQL, REST APIs, Git, Docker

Experience:
• Frontend Engineer at TechCorp (2022–present)
  - Built and maintained React dashboard used by 50,000 daily active users
  - Reduced page load time by 40% through code splitting and lazy loading
  - Led migration from JavaScript to TypeScript across 3 major modules

• Junior Developer at StartupXYZ (2021–2022)
  - Developed RESTful APIs using Node.js and Express
  - Collaborated with product team to ship 2 major features per sprint

Education: B.Tech Computer Science, Delhi University (2021)`;

const SAMPLE_JD = `Senior Frontend Engineer — FinTech Startup

We're looking for a Senior Frontend Engineer to join our growing team building the next generation of personal finance tools.

Requirements:
• 4+ years of experience with React or similar frameworks
• Strong TypeScript skills
• Experience with state management (Redux, Zustand, or similar)
• Familiarity with REST APIs and GraphQL
• Experience with performance optimization
• Strong communication and ability to work in fast-paced environments

Nice to have:
• Experience with financial products
• Knowledge of accessibility standards (WCAG)
• Open source contributions

We offer competitive salary, equity, remote-first culture, and fast career growth.`;

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string>("");

  // PDF Upload State
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canAnalyze = resume.trim().length >= 20 && jobDescription.trim().length >= 20;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setUploadError(null);
    setFileName(file.name);

    try {
      const text = await parsePdf(file);
      setResume(text);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to extract PDF text.");
      setFileName(null);
    } finally {
      setUploadingPdf(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    setState("loading");
    setError("");
    setResult(null);
    try {
      const data = await analyzeResume({ resume, job_description: jobDescription });
      setResult(data);
      setState("success");
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const handleLoadSample = () => {
    setResume(SAMPLE_RESUME);
    setFileName("sample_resume.pdf");
    setJobDescription(SAMPLE_JD);
    setState("idle");
    setResult(null);
    setError("");
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
  };

  return (
    <main>
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(14, 14, 14, 0.85)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #00dce5, #00858b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0, 220, 229, 0.3)",
            }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Aetheris <span className="gradient-text">Copilot</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, color: "#00dce5",
              background: "rgba(0, 220, 229, 0.1)", border: "1px solid rgba(0, 220, 229, 0.2)",
              borderRadius: "50px", padding: "0.25rem 0.75rem", letterSpacing: "0.05em",
            }}>
              V10.0
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "5rem 1.5rem 3rem", textAlign: "center" }}>
        <div className="animate-fade-in-up">
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.04em",
            marginBottom: "1.25rem", color: "var(--text-primary)",
          }}>
            Analyze your profile.<br />
            <span className="gradient-text">Dominate the interview.</span>
          </h1>

          <p style={{
            fontSize: "1.125rem", color: "var(--text-secondary)",
            lineHeight: 1.6, maxWidth: "600px", margin: "0 auto",
            fontWeight: 400
          }}>
            Upload your resume and paste the job description to unlock a personalized, interactive interview strategy.
          </p>
        </div>
      </section>

      {/* ── Input Section (Stitch Redesign) ────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div className="animate-fade-in-up delay-200" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <button
            onClick={handleLoadSample}
            style={{
              background: "transparent", border: "1px solid var(--border-subtle)",
              borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit",
              padding: "0.5rem 1rem", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.color = "var(--text-primary)"; (e.currentTarget).style.borderColor = "var(--accent-from)"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.color = "var(--text-muted)"; (e.currentTarget).style.borderColor = "var(--border-subtle)"; }}
          >
            ✧ Load Sample Data
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          
          {/* PDF Dropzone (Left) */}
          <div className="glass-card animate-fade-in-up delay-300" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderStyle: "dashed", borderColor: "var(--border-subtle)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem", alignSelf: "flex-start" }}>📄 Resume Upload</h3>
            <div 
              onClick={() => !uploadingPdf && fileRef.current?.click()}
              style={{
                width: "100%", height: "220px",
                background: "rgba(255, 255, 255, 0.02)", borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
                position: "relative"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-from)"; e.currentTarget.style.background = "rgba(0, 220, 229, 0.05)" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)" }}
            >
              <input
                ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
                onChange={handlePdfUpload} disabled={uploadingPdf}
              />
              
              {uploadingPdf ? (
                <>
                  <div className="spinner" style={{ marginBottom: "1rem" }} />
                  <span style={{ color: "var(--accent-from)", fontSize: "0.9rem", fontWeight: 500 }}>Extracting semantics...</span>
                </>
              ) : fileName ? (
                <>
                  <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✓</span>
                  <span style={{ fontWeight: 600, color: "var(--success)", fontSize: "1rem" }}>{fileName}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>{resume.length.toLocaleString()} chars loaded</span>
                  <button onClick={(e) => { e.stopPropagation(); setFileName(null); setResume(""); }} style={{ marginTop: "1rem", background: "rgba(255, 255, 255, 0.05)", border: "none", color: "var(--text-primary)", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.8rem", cursor: "pointer" }}>Replace File</button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "3.5rem", marginBottom: "1rem", opacity: 0.8 }}>📥</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "1rem" }}>Click or drag PDF here</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Text-based PDFs only (Max 10MB)</span>
                </>
              )}
            </div>
            {uploadError && <div className="error-box" style={{ width: "100%", marginTop: "1rem" }}>{uploadError}</div>}
          </div>

          {/* Job Description Textarea (Right) */}
          <div className="glass-card animate-fade-in-up delay-400" style={{ padding: "2.5rem", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem" }}>💼 Job Description</h3>
            <textarea
              className="copilot-textarea"
              placeholder="Paste the full job description here. Include responsibilities, requirements, and company details..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          
        </div>

        <div className="animate-fade-in-up delay-500" style={{ display: "flex", justifyContent: "center" }}>
          <AnalyzeButton onClick={handleAnalyze} loading={state === "loading"} disabled={!canAnalyze} />
        </div>
      </section>

      {/* ── Results ────────────────────────────────────────────────────── */}
      {(state === "loading" || state === "success" || state === "error") && (
        <section id="results-section" style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem 1.5rem 5rem" }}>
          <div className="gradient-divider" />

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem",
          }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {state === "loading" ? "Analyzing your profile…" : state === "success" ? "Your Analysis" : "Analysis failed"}
              </h2>
              {state === "success" && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Personalized results based on your resume and job description
                </p>
              )}
            </div>
            {state === "success" && (
              <button
                onClick={handleReset}
                style={{
                  background: "none", border: "1px solid var(--border-subtle)",
                  borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer",
                  fontSize: "0.8rem", fontFamily: "inherit", fontWeight: 500,
                  padding: "0.375rem 0.875rem", transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.color = "var(--text-primary)"; (e.currentTarget).style.borderColor = "var(--border-glow)"; }}
                onMouseLeave={(e) => { (e.currentTarget).style.color = "var(--text-muted)"; (e.currentTarget).style.borderColor = "var(--border-subtle)"; }}
              >
                ↑ New Analysis
              </button>
            )}
          </div>

          {state === "loading" && <SkeletonResults />}
          {state === "success" && result && <ResultCards data={result} />}
          {state === "error" && (
            <div className="error-box animate-fade-in">
              <strong>Error:</strong> {error}
              <br />
              <span style={{ opacity: 0.7, fontSize: "0.82rem", marginTop: "0.5rem", display: "block" }}>
                Make sure the backend is running at{" "}
                <code style={{ fontFamily: "monospace" }}>http://localhost:8000</code> and your Gemini API key is set in <code style={{ fontFamily: "monospace" }}>backend/.env</code>.
              </span>
            </div>
          )}
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          UYSO Interview Pilot · Phase 9 · Next.js + FastAPI + Gemini
        </p>
      </footer>
    </main>
  );
}
