import { Circle, Square, Diamond, GitMerge, Flag, ChevronRight } from "lucide-react";
import type { WorkflowItem, WorkflowStep } from "../../data/types";
import { cn } from "../../lib/utils";

const stepIcon: Record<WorkflowStep["type"], typeof Circle> = {
  start: Circle,
  process: Square,
  decision: Diamond,
  parallel: GitMerge,
  end: Flag,
};

const shapeShellClass: Record<WorkflowStep["type"], string> = {
  start: "size-14 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600",
  process: "h-14 w-24 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-600",
  decision: "size-16 rounded-lg border-2 border-amber-500 bg-amber-50 text-amber-600 rotate-45",
  parallel: "size-16 rounded-lg border-2 border-violet-500 bg-violet-50 text-violet-600 rotate-45",
  end: "size-14 rounded-full border-[3px] border-slate-700 bg-slate-100 text-slate-700",
};

const shapeTypeLabel: Record<WorkflowStep["type"], string> = {
  start: "Start Event",
  process: "Task",
  decision: "Gateway (Decision)",
  parallel: "Gateway (Parallel)",
  end: "End Event",
};

const ACTOR_COLORS = [
  "bg-slate-900 text-white",
  "bg-blue-600 text-white",
  "bg-violet-600 text-white",
  "bg-amber-600 text-white",
  "bg-emerald-600 text-white",
  "bg-rose-600 text-white",
];

function actorColor(actor: string, order: string[]) {
  const idx = order.indexOf(actor);
  return ACTOR_COLORS[idx % ACTOR_COLORS.length];
}

export function BPMNPreview({ workflow }: { workflow: WorkflowItem }) {
  const steps = workflow.steps;
  const actorOrder = Array.from(new Set(steps.map((s) => s.actor)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {actorOrder.map((actor) => (
          <span key={actor} className="flex items-center gap-1.5">
            <span className={cn("inline-block size-2.5 rounded-full", actorColor(actor, actorOrder))} />
            {actor}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-8">
        <div className="flex min-w-max items-start gap-1">
          {steps.map((step, i) => {
            const Icon = stepIcon[step.type];
            const isDiamond = step.type === "decision" || step.type === "parallel";
            return (
              <div key={i} className="flex items-start">
                <div className="flex w-32 flex-col items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", actorColor(step.actor, actorOrder))}>
                    {step.actor}
                  </span>
                  <div className={cn("flex items-center justify-center shadow-sm", shapeShellClass[step.type])}>
                    <Icon className={cn("size-5", isDiamond && "-rotate-45")} />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-medium leading-snug text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">{shapeTypeLabel[step.type]}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex h-14 w-8 shrink-0 items-center justify-center text-muted-foreground">
                    <ChevronRight className="size-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border-2 border-emerald-500 bg-emerald-50" /> Start Event</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded border-2 border-blue-500 bg-blue-50" /> Task</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rotate-45 rounded border-2 border-amber-500 bg-amber-50" /> Decision Gateway</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rotate-45 rounded border-2 border-violet-500 bg-violet-50" /> Parallel Gateway</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border-[3px] border-slate-700 bg-slate-100" /> End Event</span>
      </div>
    </div>
  );
}
