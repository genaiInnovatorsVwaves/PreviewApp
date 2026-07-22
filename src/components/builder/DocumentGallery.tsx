import { useState } from "react";
import {
  Network,
  Layers,
  Briefcase,
  Package,
  ListChecks,
  Webhook,
  ClipboardList,
  CheckSquare,
  Share2,
  Link2,
  Target,
  FileText,
  History,
  BookOpen,
  Route,
  CircleCheck,
  Clock,
  X,
} from "lucide-react";
import type { AppData, GeneratedDocument, DocumentGalleryData } from "../../data/types";
import { cn } from "../../lib/utils";

const DOC_ICON: Record<GeneratedDocument["icon"], typeof FileText> = {
  hld: Network,
  lld: Layers,
  brd: Briefcase,
  prd: Package,
  feature: ListChecks,
  api: Webhook,
  testplan: ClipboardList,
  testcases: CheckSquare,
  dataflow: Share2,
  traceability: Link2,
  coverage: Target,
  summary: FileText,
  provenance: History,
  tutorial: BookOpen,
};

function DocCard({ doc, onOpen }: { doc: GeneratedDocument; onOpen: () => void }) {
  const Icon = DOC_ICON[doc.icon];
  return (
    <button type="button" onClick={onOpen} className="vw-card-section vw-card--clickable vw-flex vw-flex-col text-left">
      <div className="flex items-center justify-between">
        <span className="vw-card-icon-md vw-chip vw-chip--info">
          <Icon className="size-5" />
        </span>
        <span className="vw-chip vw-chip--success is-strong">
          <CircleCheck className="size-3" />
          Ready
        </span>
      </div>
      <h3 className="vw-card-title" style={{ marginTop: "var(--vw-space-lg)" }}>{doc.title}</h3>
      <p className="vw-card-description" style={{ marginTop: "var(--vw-space-sm)" }}>{doc.description}</p>
      <div
        className="vw-card-footer-divider vw-flex vw-items-center"
        style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}
      >
        <span className="vw-flex vw-items-center vw-gap-xs">
          <Clock className="size-3.5" />
          {doc.readMinutes} min read
        </span>
      </div>
    </button>
  );
}

export function ProcessStepsModal({
  gallery,
  appTitle,
  open,
  onClose,
}: {
  gallery: DocumentGalleryData;
  appTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"events" | "summary">("events");
  if (!open) return null;

  const accent = "var(--color-primary, var(--vw-color-accent-500))";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-4xl overflow-y-auto"
        style={{ borderRadius: "var(--vw-radius-xl)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="vw-card-icon-lg vw-chip vw-chip--info">
              <Route className="size-5" />
            </span>
            <div>
              <h2 className="vw-card-title-lg">Process steps</h2>
              <p style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}>{appTitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-8 flex items-start">
          {gallery.processSteps.map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : accent }} />
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ background: accent, color: "#fff" }}>
                  <CircleCheck className="size-4" />
                </span>
                <span className="h-0.5 flex-1" style={{ background: i === gallery.processSteps.length - 1 ? "transparent" : accent }} />
              </div>
              <div className="mt-3 sm:text-sm" style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{step.label}</div>
              <div className="mt-1 max-w-[130px] leading-snug" style={{ fontSize: "11px", color: "var(--vw-color-gray-400)" }}>{step.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden" style={{ borderRadius: "var(--vw-radius-md)", border: "1px solid var(--vw-color-slate-200)" }}>
          <div className="flex gap-1 p-2" style={{ borderBottom: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)" }}>
            <button
              type="button"
              onClick={() => setTab("events")}
              className="px-3 py-1.5"
              style={{
                borderRadius: "var(--vw-radius-sm)",
                fontSize: "var(--vw-font-label-md)",
                fontWeight: 500,
                background: tab === "events" ? "var(--vw-color-white)" : "transparent",
                color: tab === "events" ? "var(--vw-color-gray-900)" : "var(--vw-color-gray-500)",
                boxShadow: tab === "events" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => setTab("summary")}
              className="px-3 py-1.5"
              style={{
                borderRadius: "var(--vw-radius-sm)",
                fontSize: "var(--vw-font-label-md)",
                fontWeight: 500,
                background: tab === "summary" ? "var(--vw-color-white)" : "transparent",
                color: tab === "summary" ? "var(--vw-color-gray-900)" : "var(--vw-color-gray-500)",
                boxShadow: tab === "summary" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              Summary
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto p-4">
            {tab === "events" ? (
              gallery.events.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--vw-color-gray-50)", padding: "12px 16px" }}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: accent, color: "#fff" }}>
                    <CircleCheck className="size-3.5" />
                  </span>
                  <span style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-700)" }}>{e}</span>
                </div>
              ))
            ) : (
              <p className="leading-relaxed" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
                Cloned <span className="font-mono" style={{ color: "var(--vw-color-gray-700)" }}>{gallery.repoUrl}</span>, parsed the codebase, and generated{" "}
                {gallery.documents.length} documents from {gallery.events.length} analysis events across the repository.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocumentViewerModal({
  doc,
  repoName,
  onClose,
}: {
  doc: GeneratedDocument | null;
  repoName: string;
  onClose: () => void;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  if (!doc) return null;
  const active = activeSection ?? doc.sections[0]?.id;
  const Icon = DOC_ICON[doc.icon];

  function goTo(id: string) {
    setActiveSection(id);
    document.getElementById(`doc-sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const accent = "var(--color-primary, var(--vw-color-accent-500))";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden"
        style={{ borderRadius: "var(--vw-radius-xl)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--vw-color-slate-200)" }}>
          <div className="flex items-center gap-3">
            <span className="vw-card-icon-md vw-chip vw-chip--info">
              <Icon className="size-4" />
            </span>
            <h2 className="vw-card-title-lg">{doc.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            className="no-scrollbar w-64 shrink-0 overflow-y-auto p-5"
            style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)" }}
          >
            <div className="mb-4 uppercase tracking-wide" style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{repoName}</div>
            <div className="mb-2 uppercase tracking-wide" style={{ fontSize: "11px", fontWeight: 500, color: "var(--vw-color-gray-400)" }}>On this page</div>
            <div className="space-y-0.5">
              {doc.sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  className={cn("block w-full truncate text-left transition-colors", s.level === 2 && "pl-5")}
                  style={{
                    borderRadius: "var(--vw-radius-xs)",
                    padding: "6px 10px",
                    fontSize: s.level === 2 ? "var(--vw-font-label-sm)" : "var(--vw-font-label-md)",
                    fontWeight: active === s.id ? 500 : 400,
                    background: active === s.id ? "var(--vw-color-accent-50)" : "transparent",
                    color: active === s.id ? accent : "var(--vw-color-gray-600)",
                  }}
                >
                  {s.id}. {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar flex-1 overflow-y-auto p-8">
            {doc.sections.map((s) => (
              <div key={s.id} id={`doc-sec-${s.id}`} className="mb-8 scroll-mt-4">
                <h3 className={s.level === 1 ? "vw-card-title-lg" : "vw-card-title-sm"}>
                  {s.id}. {s.title}
                </h3>
                <div className="mt-3 space-y-3">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-600)" }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocumentGallery({ data }: { data: AppData }) {
  const gallery = data.documentGallery;
  const [openDoc, setOpenDoc] = useState<GeneratedDocument | null>(null);
  const [processOpen, setProcessOpen] = useState(false);
  if (!gallery) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="vw-card-title-lg">Documentation gallery</h2>
        <button type="button" onClick={() => setProcessOpen(true)} className="nst-btn nst-btn--action flex items-center gap-2">
          <Route className="size-4" />
          View process
        </button>
      </div>

      <div className="vw-grid vw-grid-cols-auto-320 vw-gap-lg">
        {gallery.documents.map((doc) => (
          <DocCard key={doc.key} doc={doc} onOpen={() => setOpenDoc(doc)} />
        ))}
      </div>

      <ProcessStepsModal gallery={gallery} appTitle={data.title} open={processOpen} onClose={() => setProcessOpen(false)} />
      <DocumentViewerModal doc={openDoc} repoName={gallery.repoName} onClose={() => setOpenDoc(null)} />
    </div>
  );
}
