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
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-2px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),0_12px_28px_-4px_rgba(15,23,42,0.14)]"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <Icon className="size-5" />
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <CircleCheck className="size-3" />
          Ready
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{doc.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
      <div className="mt-4 flex items-center border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Route className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Process steps</h2>
              <p className="text-sm text-slate-400">{appTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex items-start">
          {gallery.processSteps.map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : "bg-blue-500")} />
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <CircleCheck className="size-4" />
                </span>
                <span className={cn("h-0.5 flex-1", i === gallery.processSteps.length - 1 ? "bg-transparent" : "bg-blue-500")} />
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-800 sm:text-sm">{step.label}</div>
              <div className="mt-1 max-w-[130px] text-[11px] leading-snug text-slate-400">{step.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
          <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => setTab("events")}
              className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", tab === "events" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => setTab("summary")}
              className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", tab === "summary" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
            >
              Summary
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto p-4">
            {tab === "events" ? (
              gallery.events.map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <CircleCheck className="size-3.5" />
                  </span>
                  <span className="text-sm text-slate-700">{e}</span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-relaxed text-slate-500">
                Cloned <span className="font-mono text-slate-700">{gallery.repoUrl}</span>, parsed the codebase, and generated{" "}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Icon className="size-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">{doc.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Raw</span>
            <span className="relative h-5 w-9 shrink-0 rounded-full bg-slate-200">
              <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow" />
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="no-scrollbar w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-800">{repoName}</div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">On this page</div>
            <div className="space-y-0.5">
              {doc.sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  className={cn(
                    "block w-full truncate rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                    s.level === 2 && "pl-5 text-xs",
                    active === s.id ? "bg-blue-50 font-medium text-blue-600" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {s.id}. {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar flex-1 overflow-y-auto p-8">
            {doc.sections.map((s) => (
              <div key={s.id} id={`doc-sec-${s.id}`} className="mb-8 scroll-mt-4">
                <h3 className={cn("font-bold text-slate-900", s.level === 1 ? "text-xl" : "text-base")}>
                  {s.id}. {s.title}
                </h3>
                <div className="mt-3 space-y-3">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-slate-600">
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
        <h2 className="text-lg font-bold text-foreground">Documentation gallery</h2>
        <button
          type="button"
          onClick={() => setProcessOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <Route className="size-4" />
          View process
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {gallery.documents.map((doc) => (
          <DocCard key={doc.key} doc={doc} onOpen={() => setOpenDoc(doc)} />
        ))}
      </div>

      <ProcessStepsModal gallery={gallery} appTitle={data.title} open={processOpen} onClose={() => setProcessOpen(false)} />
      <DocumentViewerModal doc={openDoc} repoName={gallery.repoName} onClose={() => setOpenDoc(null)} />
    </div>
  );
}
