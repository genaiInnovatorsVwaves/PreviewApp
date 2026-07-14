import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GitBranch, X, Sparkles, CircleCheck, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const DEFAULT_REPO = "https://github.com/merikbest2015/ecommerce-backend-app";

const PROCESS_STEPS = [
  { label: "Cloning repository", description: "Fetching source code from remote" },
  { label: "Parsing codebase", description: "Reading and analyzing file structure" },
  { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
  { label: "Extracting architecture", description: "Identifying patterns and system design" },
  { label: "Generating documentation", description: "Writing structured docs from analysis" },
];

const EVENTS = [
  "Cloned repository — 214 files across 37 modules",
  "Parsed Spring Boot project structure and build config",
  "Built module dependency graph",
  "Extracted layered architecture and REST/GraphQL surface",
  "Generated Business Requirements",
  "Generated Product Requirements",
  "Generated High-Level Design",
  "Generated Data Flow Diagram",
  "Generated Low-Level Design — 37 modules",
  "Generated API Reference, Test Plan, and Test Cases",
];

type Phase = "input" | "analyzing" | "done";

export function GitImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [repoUrl, setRepoUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [stepIndex, setStepIndex] = useState(-1);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (stepIndex >= PROCESS_STEPS.length - 1) {
      const t = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [phase, stepIndex]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (eventCount >= EVENTS.length) return;
    const t = setTimeout(() => setEventCount((c) => c + 1), 340);
    return () => clearTimeout(t);
  }, [phase, eventCount]);

  if (!open) return null;

  function reset() {
    setRepoUrl("");
    setPhase("input");
    setStepIndex(-1);
    setEventCount(0);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function startAnalysis() {
    setPhase("analyzing");
    setStepIndex(0);
    setEventCount(0);
  }

  function viewDocs() {
    handleClose();
    navigate("/app/ecommerce-backend-app", { state: { from: location.pathname } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={handleClose}>
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <GitBranch className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Codebase Documentation Agent</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
            <Sparkles className="size-4 shrink-0" />
            Point us at a Git repository & we&apos;ll reverse-engineer its documentation
          </div>
        </div>

        {phase === "input" && (
          <>
            <div className="space-y-2 px-6 pb-6 pt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                Repository URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder={DEFAULT_REPO}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-400">We&apos;ll clone, parse, and analyze the codebase — no code leaves your environment.</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={startAnalysis}
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Analyze Repository
              </button>
            </div>
          </>
        )}

        {(phase === "analyzing" || phase === "done") && (
          <div className="px-6 pb-6 pt-6">
            <div className="mb-1 text-sm text-slate-500">
              Analyzing <span className="font-mono font-medium text-slate-700">{repoUrl.trim() || DEFAULT_REPO}</span>
            </div>

            <div className="mt-6 flex items-start">
              {PROCESS_STEPS.map((step, i) => {
                const state = i < stepIndex || phase === "done" ? "done" : i === stepIndex ? "active" : "pending";
                return (
                  <div key={i} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : state !== "pending" ? "bg-blue-500" : "bg-slate-200")} />
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                          state === "pending" ? "bg-slate-100 text-slate-400" : "bg-blue-500 text-white"
                        )}
                      >
                        {state === "pending" ? <span className="size-1.5 rounded-full bg-slate-400" /> : <CircleCheck className="size-4" />}
                      </span>
                      <span
                        className={cn(
                          "h-0.5 flex-1",
                          i === PROCESS_STEPS.length - 1 ? "bg-transparent" : state === "done" ? "bg-blue-500" : "bg-slate-200"
                        )}
                      />
                    </div>
                    <div className={cn("mt-2 text-[11px] font-semibold leading-snug sm:text-xs", state === "pending" ? "text-slate-400" : "text-slate-800")}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="space-y-1.5">
                {EVENTS.slice(0, eventCount).map((e, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                    <CircleCheck className="size-3.5 shrink-0 text-blue-500" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {phase === "done" && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                <CircleCheck className="size-5 shrink-0 text-emerald-500" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-emerald-700">Documentation generated</div>
                  <div className="text-xs text-emerald-600">14 documents ready — HLD, LLD, BRD, PRD, test plans, test cases, and a tutorial.</div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {phase === "done" ? "Close" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={phase !== "done"}
                onClick={viewDocs}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors",
                  phase === "done" ? "bg-slate-900 text-white hover:bg-slate-800" : "cursor-not-allowed bg-slate-100 text-slate-400"
                )}
              >
                View Documentation Gallery
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
