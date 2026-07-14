import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Dot({ className }: { className?: string }) {
  return <span className={cn("mt-1 size-1.5 shrink-0 rounded-full bg-primary", className)} />;
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 space-y-2 text-sm">
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
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Pill({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "muted" }) {
  const toneClasses =
    tone === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-muted/70 text-muted-foreground";
  return <div className={cn("rounded-full px-3 py-1 text-sm", toneClasses)}>{children}</div>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground", className)}>
      {children}
    </span>
  );
}
