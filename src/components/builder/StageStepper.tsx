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
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {s.label}
            </button>
            {i < STAGES.length - 1 && <div className="mx-2 h-px w-6 shrink-0 bg-border sm:w-10" />}
          </div>
        );
      })}
    </div>
  );
}
