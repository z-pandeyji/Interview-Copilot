"use client";

import { useState, useRef, useEffect } from "react";
import { AnalyzeResponse, AppState } from "@/types";
import { analyzeResume, parsePdf } from "@/lib/api";
import AnalyzeButton from "@/components/AnalyzeButton";
import ResultCards from "@/components/ResultCards";
import SkeletonResults from "@/components/SkeletonResults";
import { sampleDataList, SampleRole } from "@/lib/sampleData";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string>("");

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<SampleRole | "Custom">("Custom");

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
    setSelectedRole("Custom"); // Reset to custom when manual upload happens

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

  const handleRoleSelect = (role: SampleRole | "Custom") => {
    setSelectedRole(role);
    if (role === "Custom") {
      setResume("");
      setJobDescription("");
      setFileName(null);
    } else {
      const data = sampleDataList.find(r => r.role === role);
      if (data) {
        setResume(data.resume);
        setJobDescription(data.jobDescription);
        setFileName(`Sample_${role.replace(/\s+/g, '_')}_Resume.pdf`);
      }
    }
    setState("idle");
    setResult(null);
    setError("");
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

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setSelectedRole("Custom");
    setResume("");
    setJobDescription("");
    setFileName(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#00dce5]/30">
      
      {/* ── Dashboard Top Navigation ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0e0e0e]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00dce5] to-[#00858b] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,220,229,0.3)]">
              ⚡
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight leading-none">
                UYSO <span className="text-[#00dce5] font-light">|</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e5e2e1] to-[#958e97]">INTERVIEW COPILOT</span>
              </h1>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#00dce5] font-semibold mt-1 block">
                Dashboard Environment
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="w-2 h-2 rounded-full bg-[#00dce5] animate-pulse"></div>
              <span className="text-xs font-medium text-[#958e97]">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Workspace ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Workspace Header & Tabs */}
        <section className="animate-fade-in-up">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Configure Analysis</h2>
              <p className="text-[#958e97] max-w-xl text-sm leading-relaxed">
                Select a preset persona to run a test analysis, or upload custom data to generate a highly personalized interview strategy based on your resume and a target job description.
              </p>
            </div>
          </div>

          {/* Persona Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#131313] border border-[#2a2a2a] rounded-xl w-fit">
            {(["Custom", "Software Developer", "Sales", "Marketing", "Web3", "Writer"] as const).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedRole === role 
                    ? "bg-[#201f1f] text-[#00dce5] shadow-sm border border-[#2a2a2a]" 
                    : "text-[#958e97] hover:text-[#e5e2e1] hover:bg-[#1a1a1a] border border-transparent"
                }`}
              >
                {role === "Custom" ? "✦ Custom Input" : role}
              </button>
            ))}
          </div>
        </section>

        {/* Input Forms Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-200">
          
          {/* Resume Upload Module */}
          <div className="glass-card flex flex-col p-6 h-[25rem] relative group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-[#00dce5]">01.</span> Resume Data
              </h3>
              {fileName && (
                <span className="text-xs font-mono bg-[#00dce5]/10 text-[#00dce5] px-2 py-1 rounded border border-[#00dce5]/20">
                  {resume.length} bytes loaded
                </span>
              )}
            </div>

            <div 
              onClick={() => !uploadingPdf && fileRef.current?.click()}
              className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-300 border-2 border-dashed ${
                fileName ? 'border-[#00dce5]/30 bg-[#00dce5]/5' : 'border-[#2a2a2a] bg-[#131313] hover:border-[#00dce5]/50 hover:bg-[#1a1a1a]'
              } cursor-pointer relative overflow-hidden`}
            >
              <input
                ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={handlePdfUpload} disabled={uploadingPdf}
              />
              
              {uploadingPdf ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="spinner border-t-[#00dce5] w-8 h-8"></div>
                  <span className="text-[#00dce5] font-medium text-sm animate-pulse">Extracting document semantics...</span>
                </div>
              ) : fileName ? (
                <div className="flex flex-col items-center text-center p-6 w-full h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#00dce5]/10 flex items-center justify-center mb-4 border border-[#00dce5]/20 text-[#00dce5] text-2xl">
                    ✓
                  </div>
                  <p className="font-semibold text-lg text-white mb-1 truncate max-w-xs">{fileName}</p>
                  <p className="text-[#958e97] text-sm mb-6">Successfully parsed into structured text</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFileName(null); setResume(""); setSelectedRole("Custom"); }} 
                    className="z-10 px-4 py-2 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm transition-colors"
                  >
                    Upload Alternative
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-[#00dce5]/50 transition-colors text-2xl opacity-80">
                    📥
                  </div>
                  <p className="font-medium text-[15px] mb-1">Upload PDF Document</p>
                  <p className="text-[#958e97] text-sm max-w-xs">Drag and drop your resume here, or click to browse. Text-based PDFs only.</p>
                </div>
              )}
            </div>
            {uploadError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {uploadError}
              </div>
            )}
          </div>

          {/* Job Description Textarea */}
          <div className="glass-card flex flex-col p-6 h-[25rem]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-[#00dce5]">02.</span> Target Specification
              </h3>
              {jobDescription.length > 0 && (
                <button 
                  onClick={() => { setJobDescription(""); setSelectedRole("Custom"); }}
                  className="text-xs text-[#958e97] hover:text-white transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>
            <textarea
              className="flex-1 w-full bg-[#131313] border border-[#2a2a2a] focus:border-[#00dce5] focus:ring-1 ring-[#00dce5]/30 rounded-xl p-5 text-sm leading-relaxed text-[#e5e2e1] placeholder:text-[#958e97]/60 resize-none transition-all outline-none"
              placeholder="Paste the target job description or role requirements here to calibrate the copilot's analysis..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (selectedRole !== "Custom") setSelectedRole("Custom");
              }}
            />
          </div>

        </section>

        {/* Global Analyze Action */}
        <section className="flex justify-center mt-4 animate-fade-in-up delay-300">
          <AnalyzeButton onClick={handleAnalyze} loading={state === "loading"} disabled={!canAnalyze} />
        </section>

        {/* ── Results Dashboard Module ───────────────────────────────────────────────────── */}
        {(state === "loading" || state === "success" || state === "error") && (
          <section id="results-section" className="mt-12 mb-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00dce5]/30 to-transparent mb-12"></div>
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {state === "loading" ? (
                    <span className="flex items-center gap-3">
                      Processing Matrix <span className="flex space-x-1"><span className="animate-bounce inline-block w-1.5 h-1.5 bg-[#00dce5] rounded-full"></span><span className="animate-bounce delay-100 inline-block w-1.5 h-1.5 bg-[#00dce5] rounded-full"></span><span className="animate-bounce delay-200 inline-block w-1.5 h-1.5 bg-[#00dce5] rounded-full"></span></span>
                    </span>
                  ) : state === "success" ? (
                    "Executive Strategy Brief"
                  ) : (
                    <span className="text-red-400">Analysis Exception</span>
                  )}
                </h2>
                {state === "success" && (
                  <p className="text-[#958e97] text-sm mt-2">
                    Actionable insights compiled by UYSO Copilot Engine
                  </p>
                )}
              </div>
              
              {state === "success" && (
                <button
                  onClick={handleReset}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#00dce5]/50 rounded-lg text-sm font-medium transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset Dashboard
                </button>
              )}
            </div>

            <div className="bg-[#131313] border border-[#2a2a2a] rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Subtle grid background for the results container */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              <div className="relative z-10">
                {state === "loading" && <SkeletonResults />}
                {state === "success" && result && <ResultCards data={result} />}
                {state === "error" && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      System Error
                    </h4>
                    <p className="text-red-300 text-sm mb-4">{error}</p>
                    <div className="bg-black/20 p-4 rounded-lg text-xs font-mono text-red-200/70 border border-red-900/30">
                      Diagnostic: Verify that the backend is running at http://localhost:8000 and the Gemini API key is configured correctly in backend/.env.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#2a2a2a] bg-[#0e0e0e] py-6 mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#958e97]">
            © {new Date().getFullYear()} UYSO Interview Copilot. All data processed securely.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-[#958e97]/60">
            <span>Next.js 14</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2a2a]"></span>
            <span>FastAPI</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2a2a]"></span>
            <span>Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
