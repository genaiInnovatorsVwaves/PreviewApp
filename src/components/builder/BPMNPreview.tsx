import type { CSSProperties } from "react";
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

const shapeShellStyle: Record<WorkflowStep["type"], CSSProperties> = {
  start: { width: 56, height: 56, borderRadius: "var(--vw-radius-full)", border: "2px solid var(--vw-color-emerald-500)", background: "var(--vw-color-emerald-50)", color: "var(--vw-color-emerald-600)" },
  process: { height: 56, width: 96, borderRadius: "var(--vw-radius-sm)", border: "2px solid var(--vw-color-blue-500)", background: "var(--vw-color-blue-50)", color: "var(--vw-color-blue-600)" },
  decision: { width: 64, height: 64, borderRadius: "var(--vw-radius-sm)", border: "2px solid var(--vw-color-amber-500)", background: "var(--vw-color-amber-50)", color: "var(--vw-color-amber-600)", transform: "rotate(45deg)" },
  parallel: { width: 64, height: 64, borderRadius: "var(--vw-radius-sm)", border: "2px solid var(--vw-color-violet-500)", background: "var(--vw-color-violet-50)", color: "var(--vw-color-violet-600)", transform: "rotate(45deg)" },
  end: { width: 56, height: 56, borderRadius: "var(--vw-radius-full)", border: "3px solid var(--vw-color-slate-700)", background: "var(--vw-color-slate-100)", color: "var(--vw-color-slate-700)" },
};

const shapeTypeLabel: Record<WorkflowStep["type"], string> = {
  start: "Start Event",
  process: "Task",
  decision: "Gateway (Decision)",
  parallel: "Gateway (Parallel)",
  end: "End Event",
};

const ACTOR_COLORS = [
  "var(--vw-color-slate-900)",
  "var(--vw-color-blue-600)",
  "var(--vw-color-violet-600)",
  "var(--vw-color-amber-600)",
  "var(--vw-color-emerald-600)",
  "var(--vw-color-rose-600)",
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
      <div className="flex flex-wrap items-center gap-3" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
        {actorOrder.map((actor) => (
          <span key={actor} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full" style={{ background: actorColor(actor, actorOrder) }} />
            {actor}
          </span>
        ))}
      </div>

      <div
        className="overflow-x-auto"
        style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)", padding: "var(--vw-space-3xl)" }}
      >
        <div className="flex min-w-max items-start gap-1">
          {steps.map((step, i) => {
            const Icon = stepIcon[step.type];
            const isDiamond = step.type === "decision" || step.type === "parallel";
            return (
              <div key={i} className="flex items-start">
                <div className="flex w-32 flex-col items-center gap-2">
                  <span
                    className="rounded-full"
                    style={{ padding: "2px 8px", fontSize: "10px", fontWeight: 500, background: actorColor(step.actor, actorOrder), color: "#fff" }}
                  >
                    {step.actor}
                  </span>
                  <div className="flex items-center justify-center shadow-sm" style={shapeShellStyle[step.type]}>
                    <Icon className={cn("size-5", isDiamond && "-rotate-45")} />
                  </div>
                  <div className="text-center">
                    <p className="leading-snug" style={{ fontSize: "11px", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{step.label}</p>
                    <p className="mt-0.5 uppercase tracking-wide" style={{ fontSize: "9px", color: "var(--vw-color-gray-500)" }}>{shapeTypeLabel[step.type]}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex h-14 w-8 shrink-0 items-center justify-center" style={{ color: "var(--vw-color-gray-400)" }}>
                    <ChevronRight className="size-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full" style={{ border: "2px solid var(--vw-color-emerald-500)", background: "var(--vw-color-emerald-50)" }} /> Start Event</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded" style={{ border: "2px solid var(--vw-color-blue-500)", background: "var(--vw-color-blue-50)" }} /> Task</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rotate-45 rounded" style={{ border: "2px solid var(--vw-color-amber-500)", background: "var(--vw-color-amber-50)" }} /> Decision Gateway</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rotate-45 rounded" style={{ border: "2px solid var(--vw-color-violet-500)", background: "var(--vw-color-violet-50)" }} /> Parallel Gateway</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full" style={{ border: "3px solid var(--vw-color-slate-700)", background: "var(--vw-color-slate-100)" }} /> End Event</span>
      </div>
    </div>
  );
}
