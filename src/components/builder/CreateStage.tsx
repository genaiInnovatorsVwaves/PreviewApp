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
              <MonitorSmartphone className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
              Concept Preview
            </span>
            <button
              type="button"
              title="Expand — view all pages"
              onClick={() => setExpanded(true)}
              className="nst-btn nst-btn--icon nst-btn--sm"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="-mt-2 mb-1 flex items-center gap-1.5" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
            <Info className="size-3.5 shrink-0" />
            Illustrative concept only, generated from your requirements — not the live application.
          </p>
          <p className="mb-3" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>Click a page in the sidebar to preview it.</p>
          <div style={{ overflow: "hidden", borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)" }}>
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
  const accent = "var(--color-primary, var(--vw-color-accent-500))";
  return (
    <div>
      <div
        className="mb-4 inline-flex items-center gap-1"
        style={{ padding: "3px 4px", border: "1px solid var(--vw-color-gray-200)", borderRadius: "var(--vw-radius-sm)" }}
      >
        <button
          type="button"
          onClick={() => setView("dictionary")}
          style={{
            padding: "6px 12px",
            borderRadius: "var(--vw-radius-xs)",
            fontSize: "var(--vw-font-label-md)",
            fontWeight: 500,
            background: view === "dictionary" ? accent : "transparent",
            color: view === "dictionary" ? "#fff" : "var(--vw-color-gray-600)",
          }}
        >
          Data Dictionary
        </button>
        <button
          type="button"
          onClick={() => setView("er")}
          style={{
            padding: "6px 12px",
            borderRadius: "var(--vw-radius-xs)",
            fontSize: "var(--vw-font-label-md)",
            fontWeight: 500,
            background: view === "er" ? accent : "transparent",
            color: view === "er" ? "#fff" : "var(--vw-color-gray-600)",
          }}
        >
          ER Diagram
        </button>
      </div>

      {view === "er" ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Database className="size-5" style={{ color: accent }} />
              Entity Relationship Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ERDiagram data={data} />
            <div className="mt-4 flex flex-wrap gap-4" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
              <span><span className="vw-chip vw-chip--warning is-strong">PK</span> Primary Key</span>
              <span><span className="vw-chip vw-chip--info is-strong">FK</span> Foreign Key</span>
              <span><span className="vw-chip vw-chip--purple is-strong">UK</span> Unique Key</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataDictionary data={data} />
      )}
    </div>
  );
}

const eyebrowStyle = {
  fontSize: "var(--vw-font-label-sm)",
  fontWeight: 500,
  color: "var(--vw-color-gray-500)",
} as const;

function WorkflowDetail({ workflow, onPreview }: { workflow: WorkflowItem; onPreview: () => void }) {
  const accent = "var(--color-primary, var(--vw-color-accent-500))";
  return (
    <div className="space-y-4">
      <div className="vw-card-child-shaded">
        <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
          <Zap className="size-3.5" style={{ color: "var(--vw-color-amber-500)" }} />
          Trigger Condition
        </div>
        <p className="mt-1.5" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>{workflow.trigger}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="vw-card-child-shaded">
          <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
            <ShieldCheck className="size-3.5" style={{ color: "var(--vw-color-blue-500)" }} />
            Business Rules
          </div>
          <ul className="mt-2 space-y-1.5">
            {workflow.rules.map((r, i) => (
              <li key={i} className="flex gap-2" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>
                <span className="mt-1.5 size-1 shrink-0 rounded-full" style={{ background: "var(--vw-color-gray-400)" }} />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="vw-card-child-shaded">
          <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
            <BellRing className="size-3.5" style={{ color: "var(--vw-color-violet-500)" }} />
            Notifications
          </div>
          <ul className="mt-2 space-y-1.5">
            {workflow.notifications.map((n, i) => (
              <li key={i} style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>
                <span style={{ fontWeight: 500 }}>{n.event}</span>
                <span style={{ color: "var(--vw-color-gray-500)" }}> → {n.channel} → {n.recipient}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
            <Waypoints className="size-3.5" style={{ color: "var(--vw-color-emerald-500)" }} />
            Sequencing
          </div>
          <button type="button" onClick={onPreview} className="nst-btn nst-btn--filled nst-btn--sm flex items-center gap-1.5">
            <Workflow className="size-3.5" />
            Preview
          </button>
        </div>
        <ol className="space-y-2">
          {workflow.steps.map((s, j) => {
            const Icon = stepIcon[s.type];
            return (
              <li key={j} className="vw-card-child-shaded flex items-center gap-3" style={{ padding: "8px 12px" }}>
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--vw-color-white)", fontSize: "10px", fontWeight: 500, color: "var(--vw-color-gray-500)" }}
                >
                  {j + 1}
                </span>
                <Icon className="size-4 shrink-0" style={{ color: accent }} />
                <span style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>{s.label}</span>
                <span className="ml-auto shrink-0" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{s.actor}</span>
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
            <span className="vw-card-icon-sm vw-chip vw-chip--info">
              <Workflow className="size-4" />
            </span>
          }
          title={w.title}
          subtitle={w.description}
          right={
            <div className="hidden gap-4 text-right sm:flex" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
              <span>SLA: <span style={{ fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{w.sla}</span></span>
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
              <Bot className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
              {a.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{a.description}</p>

            <div className="vw-card-child-shaded">
              <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
                <Zap className="size-3.5" style={{ color: "var(--vw-color-amber-500)" }} />
                Trigger
              </div>
              <p className="mt-1.5" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>{a.trigger}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="vw-card-child-shaded">
                <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
                  <ArrowRightToLine className="size-3.5" style={{ color: "var(--vw-color-blue-500)" }} />
                  Input
                </div>
                <ul className="mt-2 space-y-2">
                  {a.inputs.map((io, j) => (
                    <li key={j} style={{ fontSize: "var(--vw-font-description)" }}>
                      <span className="font-mono" style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{io.name}</span>
                      <span className="block" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{io.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="vw-card-child-shaded">
                <div className="flex items-center gap-1.5 uppercase tracking-wide" style={eyebrowStyle}>
                  <ArrowLeftFromLine className="size-3.5" style={{ color: "var(--vw-color-emerald-500)" }} />
                  Output
                </div>
                <ul className="mt-2 space-y-2">
                  {a.outputs.map((io, j) => (
                    <li key={j} style={{ fontSize: "var(--vw-font-description)" }}>
                      <span className="font-mono" style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{io.name}</span>
                      <span className="block" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{io.description}</span>
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
    <span
      className="flex size-6 items-center justify-center rounded-full"
      style={{
        background: on ? "var(--vw-color-emerald-50)" : "var(--vw-color-gray-100)",
        color: on ? "var(--vw-color-emerald-600)" : "var(--vw-color-gray-400)",
      }}
    >
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
            <span className="vw-card-icon-sm vw-chip vw-chip--info">
              <KeyRound className="size-4" />
            </span>
          }
          title={r.name}
          subtitle={r.description}
          right={<span className="vw-chip vw-chip--neutral is-strong hidden shrink-0 sm:inline-flex">{r.scope}</span>}
        >
          <div className="overflow-x-auto" style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)" }}>
            <table className="nst-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th style={{ textAlign: "center" }}>Create</th>
                  <th style={{ textAlign: "center" }}>Read</th>
                  <th style={{ textAlign: "center" }}>Update</th>
                  <th style={{ textAlign: "center" }}>Delete</th>
                  <th style={{ textAlign: "center" }}>Approve</th>
                </tr>
              </thead>
              <tbody>
                {r.permissions.map((p, j) => (
                  <tr key={j}>
                    <td className="nst-table-td--primary">{p.resource}</td>
                    <td style={{ textAlign: "center" }}><PermissionCell on={p.create} /></td>
                    <td style={{ textAlign: "center" }}><PermissionCell on={p.read} /></td>
                    <td style={{ textAlign: "center" }}><PermissionCell on={p.update} /></td>
                    <td style={{ textAlign: "center" }}><PermissionCell on={p.delete} /></td>
                    <td style={{ textAlign: "center" }}><PermissionCell on={p.approve} /></td>
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
  Critical: "vw-chip--error",
  High: "vw-chip--orange",
  Medium: "vw-chip--warning",
  Low: "vw-chip--neutral",
};

function BusinessRulesPanel({ data }: { data: AppData }) {
  return (
    <div className="space-y-3">
      {data.createData.businessRules.map((r, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 pt-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ScrollText className="size-4 shrink-0" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
                <span style={{ fontSize: "var(--vw-font-description)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{r.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="vw-chip vw-chip--neutral is-strong">{r.entity}</span>
                <span className={cn("vw-chip is-strong flex items-center gap-1", severityTone[r.severity])}>
                  <AlertTriangle className="size-3" />
                  {r.severity}
                </span>
              </div>
            </div>
            <p style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{r.description}</p>
            <div className="vw-card-child-shaded grid gap-2 sm:grid-cols-3" style={{ fontSize: "var(--vw-font-label-sm)" }}>
              <div>
                <div className="uppercase tracking-wide" style={{ fontWeight: 500, color: "var(--vw-color-gray-500)" }}>Trigger</div>
                <div className="mt-1" style={{ color: "var(--vw-color-gray-800)" }}>{r.trigger}</div>
              </div>
              <div>
                <div className="uppercase tracking-wide" style={{ fontWeight: 500, color: "var(--vw-color-gray-500)" }}>Condition</div>
                <div className="mt-1" style={{ color: "var(--vw-color-gray-800)" }}>{r.condition}</div>
              </div>
              <div>
                <div className="uppercase tracking-wide" style={{ fontWeight: 500, color: "var(--vw-color-gray-500)" }}>Enforcement</div>
                <div className="mt-1" style={{ color: "var(--vw-color-gray-800)" }}>{r.enforcement}</div>
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
