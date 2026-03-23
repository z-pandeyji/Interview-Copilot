"use client";

import { useRef, useState } from "react";
import { InputMode } from "@/types";
import { parsePdf } from "@/lib/api";

interface FileInputProps {
  id: string;
  label: string;
  icon: string;
  textPlaceholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function FileInput({
  id,
  label,
  icon,
  textPlaceholder,
  value,
  onChange,
  disabled,
}: FileInputProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setFileName(file.name);

    try {
      const text = await parsePdf(file);
      onChange(text);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to extract PDF text.");
      setFileName(null);
    } finally {
      setUploading(false);
      // reset so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setFileName(null);
    setUploadError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          htmlFor={`${id}-textarea`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{icon}</span>
          {label}
        </label>

        {/* Mode Toggle */}
        <div className="input-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === "text" ? "active" : ""}`}
            onClick={() => { setMode("text"); setFileName(null); setUploadError(null); }}
            disabled={disabled}
          >
            ✍ Paste Text
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "pdf" ? "active" : ""}`}
            onClick={() => setMode("pdf")}
            disabled={disabled}
          >
            📎 Upload PDF
          </button>
        </div>
      </div>

      {/* Text mode */}
      {mode === "text" && (
        <>
          <textarea
            id={`${id}-textarea`}
            className="copilot-textarea"
            placeholder={textPlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {value.length.toLocaleString()} chars
          </div>
        </>
      )}

      {/* PDF Upload mode */}
      {mode === "pdf" && (
        <div className="pdf-drop-zone" onClick={() => !disabled && !uploading && fileRef.current?.click()}>
          <input
            ref={fileRef}
            id={`${id}-file`}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={disabled || uploading}
          />

          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <div className="spinner" style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "#818cf8" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Extracting text from PDF…</span>
            </div>
          ) : fileName && value ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontSize: "2rem" }}>📄</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>{fileName}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{value.length.toLocaleString()} characters extracted</span>
              <button
                type="button"
                className="clear-btn"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
              >
                ✕ Remove & upload another
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "2.25rem" }}>☁</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                Click to upload PDF
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                Max 10MB · Text-based PDFs only
              </span>
            </div>
          )}

          {uploadError && (
            <div className="upload-error">⚠ {uploadError}</div>
          )}
        </div>
      )}
    </div>
  );
}
