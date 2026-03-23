"use client";

interface TextAreaInputProps {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TextAreaInput({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  disabled,
}: TextAreaInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        {label}
      </label>
      <textarea
        id={id}
        className="copilot-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
        }}
      >
        {value.length.toLocaleString()} chars
      </div>
    </div>
  );
}
