import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export function Accordion({
  icon,
  title,
  subtitle,
  right,
  children,
  defaultOpen = false,
  tone = "default",
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  tone?: "default" | "muted";
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        borderRadius: "var(--vw-radius-md)",
        border: "1px solid var(--vw-color-slate-200)",
        background: tone === "muted" ? "var(--vw-color-gray-50)" : "var(--vw-color-white)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
        style={{ padding: "16px 20px" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon}
          <div className="min-w-0">
            <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{title}</div>
            {subtitle && (
              <div className="mt-0.5" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {right}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} style={{ color: "var(--vw-color-gray-500)" }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid var(--vw-color-slate-200)", padding: "16px 20px" }}>{children}</div>
      )}
    </div>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return <input type="text" placeholder={placeholder} className="nst-input" />;
}

export function PriorityBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const tone = level === "High" ? "vw-chip--error" : level === "Medium" ? "vw-chip--warning" : "vw-chip--info";
  return <span className={cn("vw-chip is-strong shrink-0", tone)}>{level} Priority</span>;
}
