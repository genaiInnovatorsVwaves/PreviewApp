import { useState } from "react";
import {
  Database,
  Workflow,
  KeyRound,
  ScrollText,
  Circle,
  Square,
  Diamond,
  GitMerge,
  Flag,
  Maximize2,
  Info,
  MonitorSmartphone,
  Zap,
  ShieldCheck,
  BellRing,
  Waypoints,
  Bot,
  ArrowRightToLine,
  ArrowLeftFromLine,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import type { AppData, WorkflowItem, WorkflowStep } from "../../data/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs } from "../ui/Tabs";
import { Accordion } from "../ui/Accordion";
import { Modal } from "../ui/Modal";
import { AppIdeaPreview, AppPagesOverview } from "./AppIdeaPreview";
import { ERDiagram } from "./ERDiagram";
import { DataDictionary } from "./DataDictionary";
import { BPMNPreview } from "./BPMNPreview";
import { ApiExplorer } from "./ApiExplorer";
import { cn } from "../../lib/utils";

const CREATE_TABS = [
  { key: "uiux", label: "UI/UX" },
  { key: "data-model", label: "Data Model" },
  { key: "workflows", label: "Workflows" },
  { key: "apis", label: "APIs" },
  { key: "ai-agent", label: "AI Agent" },
  { key: "access", label: "Access" },
  { key: "business-rules", label: "Business Rules" },
];

const stepIcon: Record<WorkflowStep["type"], typeof Circle> = {
  start: Circle,
  process: Square,
  decision: Diamond,
  parallel: GitMerge,
  end: Flag,
};

function UIUXPanel({ data }: { data: AppData }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="justify-between">
            <span className="flex items-center gap-2">
              <MonitorSmartphone className="size-5 text-primary" />
              Concept Preview
            </span>
            <button
              type="button"
              title="Expand — view all pages"
              onClick={() => setExpanded(true)}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="-mt-2 mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5 shrink-0" />
            Illustrative concept only, generated from your requirements — not the live application.
          </p>
          <p className="mb-3 text-xs text-muted-foreground">Click a page in the sidebar to preview it.</p>
          <div className="overflow-hidden rounded-lg border border-border">
            <AppIdeaPreview data={data} />
          </div>
        </CardContent>
      </Card>

      <Modal open={expanded} onClose={() => setExpanded(false)} title="Pages Overview" subtitle={`${data.title} — how the application idea comes together across pages`}>
        <AppPagesOverview data={data} />
      </Modal>
    </div>
  );
}

function DataModelPanel({ data }: { data: AppData }) {
  const [view, setView] = useState<"er" | "dictionary">("dictionary");
  return (
    <div>
      <div className="mb-4 inline-flex rounded-lg border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setView("dictionary")}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            view === "dictionary" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Data Dictionary
        </button>
        <button
          type="button"
          onClick={() => setView("er")}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            view === "er" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          ER Diagram
        </button>
      </div>

      {view === "er" ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Database className="size-5 text-primary" />
              Entity Relationship Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ERDiagram data={data} />
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span><span className="rounded bg-amber-50 px-1 py-0.5 font-bold text-amber-600">PK</span> Primary Key</span>
              <span><span className="rounded bg-blue-50 px-1 py-0.5 font-bold text-blue-600">FK</span> Foreign Key</span>
              <span><span className="rounded bg-violet-50 px-1 py-0.5 font-bold text-violet-600">UK</span> Unique Key</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataDictionary data={data} />
      )}
    </div>
  );
}

function WorkflowDetail({ workflow, onPreview }: { workflow: WorkflowItem; onPreview: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Zap className="size-3.5 text-amber-500" />
          Trigger Condition
        </div>
        <p className="mt-1.5 text-sm text-foreground">{workflow.trigger}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ShieldCheck className="size-3.5 text-blue-500" />
            Business Rules
          </div>
          <ul className="mt-2 space-y-1.5">
            {workflow.rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BellRing className="size-3.5 text-violet-500" />
            Notifications
          </div>
          <ul className="mt-2 space-y-1.5">
            {workflow.notifications.map((n, i) => (
              <li key={i} className="text-sm text-foreground">
                <span className="font-medium">{n.event}</span>
                <span className="text-muted-foreground"> → {n.channel} → {n.recipient}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Waypoints className="size-3.5 text-emerald-500" />
            Sequencing
          </div>
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Workflow className="size-3.5" />
            Preview
          </button>
        </div>
        <ol className="space-y-2">
          {workflow.steps.map((s, j) => {
            const Icon = stepIcon[s.type];
            return (
              <li key={j} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-[10px] font-semibold text-muted-foreground">{j + 1}</span>
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{s.label}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{s.actor}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function WorkflowsPanel({ data }: { data: AppData }) {
  const [previewWorkflow, setPreviewWorkflow] = useState<WorkflowItem | null>(null);
  return (
    <div className="space-y-3">
      {data.createData.workflows.map((w, i) => (
        <Accordion
          key={i}
          icon={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Workflow className="size-4" />
            </span>
          }
          title={w.title}
          subtitle={w.description}
          right={
            <div className="hidden gap-4 text-right text-xs text-muted-foreground sm:flex">
              <span>SLA: <span className="font-medium text-foreground">{w.sla}</span></span>
              <span>{w.level}</span>
              <span>Personas: {w.personas}</span>
            </div>
          }
        >
          <WorkflowDetail workflow={w} onPreview={() => setPreviewWorkflow(w)} />
        </Accordion>
      ))}

      <Modal
        open={previewWorkflow !== null}
        onClose={() => setPreviewWorkflow(null)}
        title={previewWorkflow ? `${previewWorkflow.title} — Preview` : ""}
        subtitle="Illustrative process flow generated from the workflow sequence"
      >
        {previewWorkflow && <BPMNPreview workflow={previewWorkflow} />}
      </Modal>
    </div>
  );
}

function APIsPanel({ data }: { data: AppData }) {
  return <ApiExplorer data={data} />;
}

function AIAgentPanel({ data }: { data: AppData }) {
  return (
    <div className="space-y-3">
      {data.createData.aiAgents.map((a, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>
              <Bot className="size-5 text-primary" />
              {a.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{a.description}</p>

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Zap className="size-3.5 text-amber-500" />
                Trigger
              </div>
              <p className="mt-1.5 text-sm text-foreground">{a.trigger}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ArrowRightToLine className="size-3.5 text-blue-500" />
                  Input
                </div>
                <ul className="mt-2 space-y-2">
                  {a.inputs.map((io, j) => (
                    <li key={j} className="text-sm">
                      <span className="font-mono text-xs font-medium text-foreground">{io.name}</span>
                      <span className="block text-xs text-muted-foreground">{io.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ArrowLeftFromLine className="size-3.5 text-emerald-500" />
                  Output
                </div>
                <ul className="mt-2 space-y-2">
                  {a.outputs.map((io, j) => (
                    <li key={j} className="text-sm">
                      <span className="font-mono text-xs font-medium text-foreground">{io.name}</span>
                      <span className="block text-xs text-muted-foreground">{io.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PermissionCell({ on }: { on: boolean }) {
  return (
    <span className={cn("flex size-6 items-center justify-center rounded-full", on ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground/50")}>
      {on ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" />}
    </span>
  );
}

function AccessPanel({ data }: { data: AppData }) {
  return (
    <div className="space-y-3">
      {data.createData.accessRoles.map((r, i) => (
        <Accordion
          key={i}
          icon={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <KeyRound className="size-4" />
            </span>
          }
          title={r.name}
          subtitle={r.description}
          right={<span className="hidden shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground sm:inline-block">{r.scope}</span>}
        >
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Resource</th>
                  <th className="px-4 py-2.5 text-center font-medium">Create</th>
                  <th className="px-4 py-2.5 text-center font-medium">Read</th>
                  <th className="px-4 py-2.5 text-center font-medium">Update</th>
                  <th className="px-4 py-2.5 text-center font-medium">Delete</th>
                  <th className="px-4 py-2.5 text-center font-medium">Approve</th>
                </tr>
              </thead>
              <tbody>
                {r.permissions.map((p, j) => (
                  <tr key={j} className="border-t border-border">
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{p.resource}</td>
                    <td className="px-4 py-2.5 text-center"><PermissionCell on={p.create} /></td>
                    <td className="px-4 py-2.5 text-center"><PermissionCell on={p.read} /></td>
                    <td className="px-4 py-2.5 text-center"><PermissionCell on={p.update} /></td>
                    <td className="px-4 py-2.5 text-center"><PermissionCell on={p.delete} /></td>
                    <td className="px-4 py-2.5 text-center"><PermissionCell on={p.approve} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Accordion>
      ))}
    </div>
  );
}

const severityTone: Record<string, string> = {
  Critical: "bg-red-50 text-red-600",
  High: "bg-orange-50 text-orange-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-slate-100 text-slate-600",
};

function BusinessRulesPanel({ data }: { data: AppData }) {
  return (
    <div className="space-y-3">
      {data.createData.businessRules.map((r, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 pt-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ScrollText className="size-4 shrink-0 text-primary" />
                <span className="text-sm font-semibold text-foreground">{r.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{r.entity}</span>
                <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", severityTone[r.severity])}>
                  <AlertTriangle className="size-3" />
                  {r.severity}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.description}</p>
            <div className="grid gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs sm:grid-cols-3">
              <div>
                <div className="font-semibold uppercase tracking-wide text-muted-foreground">Trigger</div>
                <div className="mt-1 text-foreground">{r.trigger}</div>
              </div>
              <div>
                <div className="font-semibold uppercase tracking-wide text-muted-foreground">Condition</div>
                <div className="mt-1 text-foreground">{r.condition}</div>
              </div>
              <div>
                <div className="font-semibold uppercase tracking-wide text-muted-foreground">Enforcement</div>
                <div className="mt-1 text-foreground">{r.enforcement}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CreateStage({ data }: { data: AppData }) {
  const [tab, setTab] = useState("uiux");
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tabs tabs={CREATE_TABS} active={tab} onChange={setTab} />
      <div className="flex-1 overflow-y-auto p-8">
        {tab === "uiux" && <UIUXPanel data={data} />}
        {tab === "data-model" && <DataModelPanel data={data} />}
        {tab === "workflows" && <WorkflowsPanel data={data} />}
        {tab === "apis" && <APIsPanel data={data} />}
        {tab === "ai-agent" && <AIAgentPanel data={data} />}
        {tab === "access" && <AccessPanel data={data} />}
        {tab === "business-rules" && <BusinessRulesPanel data={data} />}
      </div>
    </div>
  );
}
