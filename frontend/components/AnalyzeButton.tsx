"use client";

interface AnalyzeButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function AnalyzeButton({ onClick, loading, disabled }: AnalyzeButtonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <button
        id="analyze-button"
        className="analyze-btn"
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span className="spinner" />
            Analyzing...
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            Analyze My Resume
          </span>
        )}
      </button>
      {loading && (
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "0.02em" }}>
          AI is analyzing your profile — this takes 10–20 seconds
        </p>
      )}
    </div>
  );
}
