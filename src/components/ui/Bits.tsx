import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Dot({ className }: { className?: string }) {
  return <span className={cn("mt-1 size-1.5 shrink-0 rounded-full", className)} style={{ background: "var(--vw-color-accent-500)" }} />;
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 space-y-2" style={{ fontSize: "var(--vw-font-description)" }}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <Dot />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="nst-input-label" style={{ display: "block" }}>{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Pill({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "muted" }) {
  return <span className={cn("vw-chip", tone === "blue" ? "vw-chip--info" : "vw-chip--neutral")}>{children}</span>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("vw-chip vw-chip--neutral", className)}>{children}</span>;
}
