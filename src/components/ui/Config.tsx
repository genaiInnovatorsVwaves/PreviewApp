import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export function PillSelect({ label, options, selected }: { label?: string; options: string[]; selected: string }) {
  const [value, setValue] = useState(selected);
  return (
    <div>
      {label && <div className="nst-input-label mb-2">{label}</div>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(opt)}
            className={cn("vw-chip is-strong is-clickable", value !== opt && "vw-chip--neutral")}
            style={value === opt ? { background: "var(--color-primary, var(--vw-color-accent-500))", color: "var(--vw-color-white)" } : undefined}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleRow({ label, description, defaultOn = true }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between gap-4"
      style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", padding: "var(--vw-space-lg)" }}
    >
      <div>
        <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{label}</div>
        {description && (
          <div className="mt-0.5" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className="relative shrink-0"
        style={{
          width: 28,
          height: 16,
          borderRadius: "var(--vw-radius-full)",
          padding: 2,
          boxSizing: "border-box",
          background: on ? "var(--vw-color-accent-500)" : "var(--vw-color-gray-200)",
          display: "inline-flex",
          justifyContent: on ? "flex-end" : "flex-start",
          transition: "background 200ms ease-out",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "var(--vw-radius-full)", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,.1)" }} />
      </button>
    </div>
  );
}

export function CheckboxRow({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button type="button" onClick={() => setChecked((c) => !c)} className="flex w-full items-center gap-3 py-1.5 text-left">
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          width: 18,
          height: 18,
          borderRadius: "var(--vw-radius-xs)",
          background: checked ? "var(--vw-color-accent-500)" : "#fff",
          border: `1px solid ${checked ? "var(--vw-color-accent-500)" : "var(--vw-color-gray-200)"}`,
          transition: "all 150ms",
        }}
      >
        {checked && <Check className="size-3" style={{ color: "#fff" }} strokeWidth={3} />}
      </span>
      <span style={{ fontSize: "var(--vw-font-label-md)", color: "var(--vw-color-gray-800)" }}>{label}</span>
    </button>
  );
}

export function ColorSwatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div>
      <div className="nst-input-label mb-1.5">{label}</div>
      <div className="flex items-center gap-2" style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", padding: "8px" }}>
        <span
          className="size-6 shrink-0"
          style={{ borderRadius: "var(--vw-radius-xs)", border: "1px solid var(--vw-color-slate-200)", backgroundColor: hex }}
        />
        <span className="font-mono" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-800)" }}>{hex}</span>
      </div>
    </div>
  );
}

export function MethodBadge({ method }: { method: string }) {
  const tone: Record<string, string> = {
    GET: "vw-chip--success",
    POST: "vw-chip--info",
    PATCH: "vw-chip--warning",
    PUT: "vw-chip--purple",
    DELETE: "vw-chip--error",
  };
  return <span className={cn("vw-chip is-strong w-16 shrink-0 justify-center", tone[method] ?? "vw-chip--neutral")}>{method}</span>;
}

export function DirectionBadge({ direction }: { direction: string }) {
  const tone: Record<string, string> = {
    Bidirectional: "vw-chip--purple",
    Inbound: "vw-chip--success",
    Outbound: "vw-chip--info",
  };
  return <span className={cn("vw-chip is-strong", tone[direction] ?? "vw-chip--neutral")}>{direction}</span>;
}
