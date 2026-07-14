import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export function PillSelect({ label, options, selected }: { label?: string; options: string[]; selected: string }) {
  const [value, setValue] = useState(selected);
  return (
    <div>
      {label && <div className="mb-2 text-sm font-medium text-foreground">{label}</div>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(opt)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              value === opt
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            )}
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
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-muted")}
      >
        <span className={cn("absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

export function CheckboxRow({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button type="button" onClick={() => setChecked((c) => !c)} className="flex w-full items-center gap-3 py-1.5 text-left">
      <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", checked ? "border-primary bg-primary" : "border-border")}>
        {checked && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}

export function ColorSwatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 rounded-lg border border-border p-2">
        <span className="size-6 shrink-0 rounded-md border border-border" style={{ backgroundColor: hex }} />
        <span className="font-mono text-xs text-foreground">{hex}</span>
      </div>
    </div>
  );
}

export function MethodBadge({ method }: { method: string }) {
  const tone: Record<string, string> = {
    GET: "bg-emerald-50 text-emerald-600",
    POST: "bg-blue-50 text-blue-600",
    PATCH: "bg-amber-50 text-amber-600",
    PUT: "bg-violet-50 text-violet-600",
    DELETE: "bg-red-50 text-red-600",
  };
  return <span className={cn("w-16 shrink-0 rounded px-2 py-1 text-center text-xs font-bold", tone[method] ?? "bg-muted text-muted-foreground")}>{method}</span>;
}

export function DirectionBadge({ direction }: { direction: string }) {
  const tone: Record<string, string> = {
    Bidirectional: "bg-violet-50 text-violet-600",
    Inbound: "bg-emerald-50 text-emerald-600",
    Outbound: "bg-blue-50 text-blue-600",
  };
  return <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", tone[direction] ?? "bg-muted text-muted-foreground")}>{direction}</span>;
}
