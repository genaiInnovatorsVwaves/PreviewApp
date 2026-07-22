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
        className="no-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto"
        style={{ borderRadius: "var(--vw-radius-xl)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vw-flex vw-items-center vw-justify-between" style={{ padding: "24px 24px 0" }}>
          <div className="vw-flex vw-items-center vw-gap-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--vw-color-gray-900)" }}>
              <GitBranch className="size-5" style={{ color: "var(--vw-color-white)" }} />
            </div>
            <h2 className="vw-card-title-lg">Modernize App</h2>
          </div>
          <button type="button" onClick={handleClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>

        <div style={{ padding: "20px 24px 0" }}>
          <div
            className="vw-card-section vw-card--info vw-flex vw-items-center vw-gap-sm"
            style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-sky-700)" }}
          >
            <Sparkles className="size-4 shrink-0" />
            Point us at a Git repository & we&apos;ll reverse-engineer its documentation
          </div>
        </div>

        {phase === "input" && (
          <>
            <div className="vw-flex vw-flex-col vw-gap-xs" style={{ padding: "20px 24px 24px" }}>
              <label className="nst-input-label" style={{ display: "block" }}>
                Repository URL <span style={{ color: "var(--vw-color-red-500)" }}>*</span>
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder={DEFAULT_REPO}
                className="nst-input"
              />
              <p style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}>
                We&apos;ll clone, parse, and analyze the codebase — no code leaves your environment.
              </p>
            </div>
            <div
              className="vw-flex vw-items-center vw-justify-between"
              style={{ padding: "16px 24px", borderTop: "1px solid var(--vw-color-gray-100)" }}
            >
              <button type="button" onClick={handleClose} className="nst-btn">
                Back
              </button>
              <button type="button" onClick={startAnalysis} className="nst-btn nst-btn--filled">
                Modernize
              </button>
            </div>
          </>
        )}

        {(phase === "analyzing" || phase === "done") && (
          <div style={{ padding: "24px" }}>
            <div className="mb-1" style={{ fontSize: "var(--vw-font-label-md)", color: "var(--vw-color-gray-500)" }}>
              Analyzing{" "}
              <span className="font-mono" style={{ fontWeight: 500, color: "var(--vw-color-gray-700)" }}>
                {repoUrl.trim() || DEFAULT_REPO}
              </span>
            </div>

            <div className="mt-6 flex items-start">
              {PROCESS_STEPS.map((step, i) => {
                const state = i < stepIndex || phase === "done" ? "done" : i === stepIndex ? "active" : "pending";
                const accent = "var(--color-primary, var(--vw-color-accent-500))";
                return (
                  <div key={i} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <span className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : state !== "pending" ? accent : "var(--vw-color-gray-200)" }} />
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
                        style={{
                          background: state === "pending" ? "var(--vw-color-gray-100)" : accent,
                          color: state === "pending" ? "var(--vw-color-gray-400)" : "#fff",
                        }}
                      >
                        {state === "pending" ? (
                          <span className="size-1.5 rounded-full" style={{ background: "var(--vw-color-gray-400)" }} />
                        ) : (
                          <CircleCheck className="size-4" />
                        )}
                      </span>
                      <span
                        className="h-0.5 flex-1"
                        style={{ background: i === PROCESS_STEPS.length - 1 ? "transparent" : state === "done" ? accent : "var(--vw-color-gray-200)" }}
                      />
                    </div>
                    <div
                      className="mt-2 leading-snug"
                      style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: state === "pending" ? "var(--vw-color-gray-400)" : "var(--vw-color-gray-800)" }}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-6 h-40 overflow-y-auto"
              style={{ borderRadius: "var(--vw-radius-md)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)", padding: "12px" }}
            >
              <div className="space-y-1.5">
                {EVENTS.slice(0, eventCount).map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5"
                    style={{
                      borderRadius: "var(--vw-radius-sm)",
                      background: "var(--vw-color-white)",
                      padding: "8px 12px",
                      fontSize: "var(--vw-font-label-sm)",
                      color: "var(--vw-color-gray-600)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <CircleCheck className="size-3.5 shrink-0" style={{ color: "var(--vw-color-accent-500)" }} />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {phase === "done" && (
              <div className="vw-card-section vw-card--success mt-5 flex items-center gap-3" style={{ padding: "14px 16px" }}>
                <CircleCheck className="size-5 shrink-0" style={{ color: "var(--vw-color-emerald-500)" }} />
                <div className="flex-1">
                  <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-emerald-700)" }}>
                    Documentation generated
                  </div>
                  <div style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-emerald-600)" }}>
                    14 documents ready — HLD, LLD, BRD, PRD, test plans, test cases, and a tutorial.
                  </div>
                </div>
              </div>
            )}

            <div className="vw-flex vw-items-center vw-justify-between mt-5">
              <button type="button" onClick={handleClose} className="nst-btn">
                {phase === "done" ? "Close" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={phase !== "done"}
                onClick={viewDocs}
                className={cn("nst-btn flex items-center gap-2", phase === "done" ? "nst-btn--filled" : "is-disabled")}
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
