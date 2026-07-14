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
    <div className={cn("rounded-xl border border-border bg-card", tone === "muted" && "bg-muted/40")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {right}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>
      {open && <div className="border-t border-border px-5 py-4">{children}</div>}
    </div>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

export function PriorityBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const tone =
    level === "High" ? "bg-red-50 text-red-600" : level === "Medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600";
  return <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium", tone)}>{level} Priority</span>;
}
