import { Target, Circle, Lock } from "lucide-react";
import type { Stage } from "./ChatPanel";
import { cn } from "../../lib/utils";

const STAGES: { key: Stage; label: string; icon: typeof Target }[] = [
  { key: "think", label: "Think", icon: Target },
  { key: "create", label: "Create", icon: Circle },
  { key: "operate", label: "Operate", icon: Lock },
];

export function StageStepper({ stage, onStageChange }: { stage: Stage; onStageChange: (s: Stage) => void }) {
  return (
    <div className="flex items-center">
      {STAGES.map((s, i) => {
        const isActive = s.key === stage;
        const Icon = s.icon;
        return (
          <div key={s.key} className="flex items-center">
            <button
              type="button"
              onClick={() => onStageChange(s.key)}
              className={cn("vw-chip is-strong is-clickable whitespace-nowrap", !isActive && "vw-chip--neutral")}
              style={{
                fontSize: "var(--vw-font-label-md)",
                padding: "8px 16px",
                ...(isActive
                  ? { background: "var(--color-primary, var(--vw-color-accent-500))", color: "var(--vw-color-white)" }
                  : {}),
              }}
            >
              <Icon className="size-4" />
              {s.label}
            </button>
            {i < STAGES.length - 1 && (
              <div className="mx-2 h-px w-6 shrink-0 sm:w-10" style={{ background: "var(--vw-color-gray-200)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
