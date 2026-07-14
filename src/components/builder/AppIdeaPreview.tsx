import { useState, type ReactNode } from "react";
import {
  LayoutGrid,
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Sparkles,
  Bot,
  Boxes,
  Wrench,
  ShieldCheck,
  Radio,
  DollarSign,
} from "lucide-react";
import type { AppData, ChatPreview, StructuredPreview } from "../../data/types";
import { cn } from "../../lib/utils";

const STAGE_COLORS = ["#94a3b8", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];
const DIST_COLORS = ["#ea580c", "#92400e", "#be123c", "#0f766e", "#4338ca", "#0369a1"];

const toneIcon: Record<string, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
  warn: TrendingUp,
};

const toneClass: Record<string, string> = {
  up: "text-emerald-600 bg-emerald-50",
  down: "text-red-600 bg-red-50",
  flat: "text-slate-500 bg-slate-100",
  warn: "text-amber-600 bg-amber-50",
};

function getInitials(title: string) {
  const words = title.split(" ").filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return initials || title.slice(0, 2).toUpperCase();
}

function InsightsHome({ data, preview, primary }: { data: AppData; preview: StructuredPreview; primary: string }) {
  const c = preview.charts;
  const typeMax = Math.max(...c.typeSlices.map((s) => s.value), 1);
  const riskMax = Math.max(...c.riskBars.map((b) => b.value), 1);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-bold text-slate-900">{data.title} Overview</div>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{data.tagline}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {preview.stats.map((s, i) => {
          const ToneIcon = toneIcon[s.tone] ?? Minus;
          return (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-400">{s.label}</div>
              <div className="mt-1.5 text-2xl font-bold text-slate-900">{s.value}</div>
              {s.delta && (
                <div className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", toneClass[s.tone])}>
                  <ToneIcon className="size-3" />
                  {s.delta}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <LayoutGrid className="size-3.5" />
            </span>
            {c.stageTitle}
          </div>
          <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
            {c.stageBars.map((b, i) => (
              <div key={i} style={{ flex: b.value, backgroundColor: STAGE_COLORS[i % STAGE_COLORS.length] }} />
            ))}
          </div>
          <div className="mt-5 space-y-2.5">
            {c.stageBars.map((b, i) => {
              const stageTotal = c.stageBars.reduce((sum, x) => sum + x.value, 0) || 1;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: STAGE_COLORS[i % STAGE_COLORS.length] }} />
                  <span className="w-28 shrink-0 truncate text-xs text-slate-500">{b.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${(b.value / stageTotal) * 100}%`, backgroundColor: STAGE_COLORS[i % STAGE_COLORS.length] }} />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-700">{b.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
              <PieChart className="size-3.5" />
            </span>
            {c.typeTitle}
          </div>
          <div className="flex h-32 gap-3">
            {c.typeSlices.map((s, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-xs font-semibold text-slate-600">{s.value}</span>
                <div className="w-full rounded-t-md" style={{ height: `${8 + (s.value / typeMax) * 92}%`, backgroundColor: DIST_COLORS[i % DIST_COLORS.length] }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            {c.typeSlices.map((s, i) => (
              <span key={i} className="flex-1 truncate text-center text-[11px] text-slate-400">{s.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex size-7 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
            <BarChart3 className="size-3.5" />
          </span>
          {c.riskTitle}
        </div>
        <div className="flex h-24 gap-3">
          {c.riskBars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-xs font-semibold text-slate-600">{b.value}</span>
              <div className="w-full rounded-t-md" style={{ height: `${10 + (b.value / riskMax) * 90}%`, backgroundColor: primary }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-3">
          {c.riskBars.map((b, i) => (
            <span key={i} className="flex-1 truncate text-center text-[11px] text-slate-400">{b.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniReportsView({ preview }: { preview: StructuredPreview }) {
  const cols = preview.columns.slice(0, 4);
  return (
    <div>
      <div className="mb-4 text-lg font-bold text-slate-900">{preview.tableTitle}</div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {cols.map((c) => (
            <span key={c.key} className="flex-1 truncate">{c.label}</span>
          ))}
          <span className="w-20 shrink-0 text-right">Status</span>
        </div>
        {preview.rows.slice(0, 8).map((r) => (
          <div key={r.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-600 last:border-0">
            {cols.map((c) => (
              <span key={c.key} className="flex-1 truncate">{c.key === "id" ? r.id : r.cells[c.key]}</span>
            ))}
            <span className="w-20 shrink-0 truncate text-right text-xs text-slate-400">{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatHome({ data, preview, primary }: { data: AppData; preview: ChatPreview; primary: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-lg font-bold text-slate-900">{preview.assistantName}</div>
      <div className="flex-1 space-y-3 overflow-hidden">
        {preview.conversation.slice(0, 6).map((m, i) => (
          <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
            <div
              className="max-w-[70%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
              style={m.from === "user" ? { backgroundColor: primary, color: "#fff" } : { backgroundColor: "#f1f5f9", color: "#334155" }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-400">
        Ask about {data.entities[0]?.name.toLowerCase() ?? "anything"}...
      </div>
    </div>
  );
}

function MiniListView({ entityName, primary }: { entityName: string; primary: string }) {
  const rowCount = 12;
  const filters = ["All", "Mine", "Recent", "Flagged"];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900">{entityName} List</div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: primary }}>
          <Plus className="size-3.5" />
          New
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {filters.map((f, i) => (
            <span
              key={f}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={i === 0 ? { backgroundColor: primary, color: "#fff" } : { backgroundColor: "#f1f5f9", color: "#64748b" }}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="h-8 w-40 rounded-lg border border-slate-200 bg-white" />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
            <div className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: i === 0 ? primary : "#e2e8f0" }} />
            <div className="h-2.5 flex-1 rounded bg-slate-100" style={{ maxWidth: `${45 + ((i * 11) % 40)}%` }} />
            <div className="h-2.5 w-16 shrink-0 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">Showing {rowCount} of 212</div>
    </div>
  );
}

function MiniSettingsView({ primary }: { primary: string }) {
  const groups = [
    { label: "General", rows: ["Roles & Permissions", "Notifications", "Branding"] },
    { label: "Advanced", rows: ["Integrations", "Workflow Rules", "Data Retention", "API Access", "Audit Logging"] },
  ];
  let idx = 0;
  return (
    <div className="space-y-6">
      <div className="text-lg font-bold text-slate-900">Settings</div>
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.label}</div>
          <div className="space-y-2">
            {g.rows.map((r) => {
              const i = idx++;
              return (
                <div key={r} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                  <span className="text-sm text-slate-700">{r}</span>
                  <span className="relative h-5 w-9 shrink-0 rounded-full" style={{ backgroundColor: i % 3 !== 1 ? primary : "#e2e8f0" }}>
                    <span className="absolute top-0.5 size-4 rounded-full bg-white shadow" style={{ left: i % 3 !== 1 ? "18px" : "2px" }} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniHistoryView({ primary }: { primary: string }) {
  const groups = [
    { label: "Today", items: ["Leave balance question", "Onboarding checklist status", "Payroll policy question"] },
    { label: "Earlier", items: ["Team calendar request", "Leave request approved", "Escalated to HR", "Benefits enrollment question", "Manager approval reminder"] },
  ];
  let idx = 0;
  return (
    <div className="space-y-6">
      <div className="text-lg font-bold text-slate-900">History</div>
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.label}</div>
          <div className="space-y-2">
            {g.items.map((t) => {
              const i = idx++;
              return (
                <div key={t} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: i === 0 ? primary : "#e2e8f0" }} />
                  <span className="text-sm text-slate-600">{t}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConceptStatRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="mb-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-400">{it.label}</div>
          <div className="mt-1 text-xl font-bold text-slate-900">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function ConceptTable({
  columns,
  rows,
  toneMap,
}: {
  columns: { key: string; label: string; width?: string }[];
  rows: { id: string; cells: Record<string, string>; status?: string }[];
  toneMap?: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {columns.map((c) => (
          <span key={c.key} className={c.width ?? "flex-1"}>
            {c.label}
          </span>
        ))}
        {toneMap && <span className="w-28 shrink-0 text-right">Status</span>}
      </div>
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-600 last:border-0">
          {columns.map((c, i) => (
            <span key={c.key} className={cn("truncate", c.width ?? "flex-1", i === 0 && "font-mono text-xs text-slate-500")}>
              {r.cells[c.key]}
            </span>
          ))}
          {toneMap && r.status && (
            <span className="w-28 shrink-0 text-right">
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", toneMap[r.status] ?? "bg-slate-100 text-slate-600")}>
                {r.status}
              </span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const RAN_CANDIDATE_SITES = [
  { id: "NYC-0301", cells: { site: "NYC-0301", market: "New York Metro", type: "Rooftop", priority: "High" }, status: "RF Design" },
  { id: "NYC-0312", cells: { site: "NYC-0312", market: "New York Metro", type: "Small Cell", priority: "Medium" }, status: "Candidate" },
  { id: "BOS-0140", cells: { site: "BOS-0140", market: "Boston Metro", type: "Greenfield Tower", priority: "High" }, status: "Survey" },
  { id: "CHI-0098", cells: { site: "CHI-0098", market: "Chicago Metro", type: "Colocation", priority: "Low" }, status: "Candidate" },
  { id: "CHI-0103", cells: { site: "CHI-0103", market: "Chicago Metro", type: "Rooftop", priority: "Medium" }, status: "RF Design" },
  { id: "SEA-0022", cells: { site: "SEA-0022", market: "Seattle Metro", type: "Small Cell", priority: "High" }, status: "Survey" },
];

function RanNetworkPlanningPanel({ primary }: { primary: string }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900">Candidate Site Pipeline</div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: primary }}>
          <Plus className="size-3.5" />
          New Candidate
        </div>
      </div>
      <ConceptStatRow items={[{ label: "Candidates", value: "86" }, { label: "In Survey", value: "41" }, { label: "RF Design Approved", value: "37" }]} />
      <ConceptTable
        columns={[
          { key: "site", label: "Site", width: "w-24 shrink-0" },
          { key: "market", label: "Market" },
          { key: "type", label: "Type", width: "w-32 shrink-0" },
          { key: "priority", label: "Priority", width: "w-16 shrink-0" },
        ]}
        rows={RAN_CANDIDATE_SITES}
        toneMap={{ Candidate: "bg-slate-100 text-slate-600", Survey: "bg-amber-50 text-amber-600", "RF Design": "bg-blue-50 text-blue-600" }}
      />
    </div>
  );
}

const RAN_ROLLOUT_COLUMNS: { label: string; tone: string; sites: { id: string; name: string; manager: string }[] }[] = [
  { label: "Permitting", tone: "border-t-amber-400", sites: [{ id: "NYC-0158", name: "Queens Small Cell 12", manager: "Marcus Reyes" }] },
  {
    label: "Construction",
    tone: "border-t-blue-400",
    sites: [
      { id: "NYC-0142", name: "Midtown Rooftop", manager: "Marcus Reyes" },
      { id: "CHI-0072", name: "West Loop Small Cell 3", manager: "Layla Ahmadi" },
    ],
  },
  { label: "Integration", tone: "border-t-violet-400", sites: [{ id: "BOS-0104", name: "Somerville Colocation", manager: "Layla Ahmadi" }] },
  { label: "Live", tone: "border-t-emerald-400", sites: [{ id: "CHI-0067", name: "Loop Rooftop 4", manager: "Marcus Reyes" }] },
];

function RanRolloutDeploymentPanel() {
  return (
    <div>
      <div className="mb-4 text-lg font-bold text-slate-900">Rollout Board — PRG-5G-DENSIFY-24</div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RAN_ROLLOUT_COLUMNS.map((col) => (
          <div key={col.label} className={cn("rounded-xl border border-t-4 border-slate-200 bg-slate-50 p-3", col.tone)}>
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              {col.label}
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-slate-400">{col.sites.length}</span>
            </div>
            <div className="space-y-2">
              {col.sites.map((s) => (
                <div key={s.id} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="font-mono text-[10px] text-slate-400">{s.id}</div>
                  <div className="truncate text-xs font-medium text-slate-700">{s.name}</div>
                  <div className="mt-1 truncate text-[10px] text-slate-400">{s.manager}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RanCommercialPanel() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <DollarSign className="size-5 text-emerald-500" />
        Program Commercials — PRG-5G-DENSIFY-24
      </div>
      <ConceptStatRow
        items={[
          { label: "Capex Committed", value: "$18.4M" },
          { label: "Capex Spent", value: "$11.2M" },
          { label: "Change Orders Pending", value: "6" },
          { label: "Avg. Cost / Site", value: "$53.6K" },
        ]}
      />
      <ConceptTable
        columns={[
          { key: "vendor", label: "Vendor", width: "w-40 shrink-0" },
          { key: "scope", label: "Scope" },
          { key: "amount", label: "Invoice Amount", width: "w-32 shrink-0" },
        ]}
        rows={[
          { id: "INV-3381", cells: { vendor: "Summit Tower Crews", scope: "Construction — 4 sites", amount: "$186,400" } },
          { id: "INV-3376", cells: { vendor: "Beacon RF Engineering", scope: "RF design — 12 sites", amount: "$94,200" } },
          { id: "INV-3362", cells: { vendor: "Lakeside Permitting Co.", scope: "Permit filings — 9 sites", amount: "$41,750" } },
        ]}
      />
    </div>
  );
}

function RanNetworkIntelligencePanel() {
  const coverage = [
    { label: "New York Metro", value: 94 },
    { label: "Boston Metro", value: 88 },
    { label: "Chicago Metro", value: 91 },
    { label: "Seattle Metro", value: 79 },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <BarChart3 className="size-5 text-violet-500" />
        Network Intelligence
      </div>
      <ConceptStatRow items={[{ label: "Avg. Coverage", value: "88%" }, { label: "Capacity Utilization", value: "71%" }, { label: "Predicted Congestion (90d)", value: "5 sites" }]} />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 text-sm font-semibold text-slate-700">Coverage by Market</div>
        <div className="space-y-3">
          {coverage.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-xs text-slate-500">{c.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-violet-400" style={{ width: `${c.value}%` }} />
              </div>
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-slate-700">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RAN_AI_INSIGHTS = [
  { text: "3 sites in Chicago Metro are trending toward permit expiration within 14 days — recommend expediting CHI-0072 first.", impact: "High" },
  { text: "Boston Metro survey backlog has grown 22% this month; historical pattern suggests a 2-week integration delay if unaddressed.", impact: "Medium" },
  { text: "Vendor Summit Tower Crews is completing construction milestones 18% faster than the program average — candidate for scope expansion.", impact: "Low" },
];

function RanAiInsightsPanel() {
  const toneMap: Record<string, string> = { High: "bg-red-50 text-red-600", Medium: "bg-amber-50 text-amber-600", Low: "bg-emerald-50 text-emerald-600" };
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Sparkles className="size-5 text-amber-500" />
        AI Insights
      </div>
      <div className="space-y-3">
        {RAN_AI_INSIGHTS.map((ins, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Sparkles className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-slate-700">{ins.text}</p>
              <span className={cn("mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", toneMap[ins.impact])}>{ins.impact} impact</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const RAN_AI_AGENTS = [
  { name: "Permit Expediter Agent", role: "Monitors filings and escalates stalled municipal reviews", status: "Active", lastAction: "Escalated CHI-0072 permit review — 3m ago" },
  { name: "RF Design QA Agent", role: "Validates RF design packages against interference thresholds", status: "Active", lastAction: "Approved BOS-0140 design package — 41m ago" },
  { name: "Vendor Invoice Auditor", role: "Cross-checks vendor invoices against milestone completion", status: "Idle", lastAction: "Flagged INV-3376 for scope mismatch — 2h ago" },
];

function RanAiAgentsPanel() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Bot className="size-5 text-blue-500" />
        AI Agents
      </div>
      <div className="space-y-3">
        {RAN_AI_AGENTS.map((a) => (
          <div key={a.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Bot className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-slate-800">{a.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", a.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                  {a.status}
                </span>
              </div>
              <p className="truncate text-xs text-slate-400">{a.role}</p>
              <p className="mt-1 truncate text-[11px] text-slate-400">{a.lastAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RanOperationsPanel() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Wrench className="size-5 text-orange-500" />
        Maintenance & Operations Queue
      </div>
      <ConceptStatRow items={[{ label: "Open Tickets", value: "31" }, { label: "Critical", value: "3" }, { label: "SLA at Risk", value: "5" }]} />
      <ConceptTable
        columns={[
          { key: "ticket", label: "Ticket", width: "w-24 shrink-0" },
          { key: "site", label: "Site" },
          { key: "issue", label: "Issue", width: "w-48 shrink-0" },
        ]}
        rows={[
          { id: "TCK-8841", cells: { ticket: "TCK-8841", site: "CHI-0067", issue: "Backhaul link flapping" }, status: "Critical" },
          { id: "TCK-8837", cells: { ticket: "TCK-8837", site: "NYC-0142", issue: "Generator fuel low" }, status: "High" },
          { id: "TCK-8822", cells: { ticket: "TCK-8822", site: "BOS-0104", issue: "Scheduled antenna tilt adjustment" }, status: "Scheduled" },
        ]}
        toneMap={{ Critical: "bg-red-50 text-red-600", High: "bg-amber-50 text-amber-600", Scheduled: "bg-blue-50 text-blue-600" }}
      />
    </div>
  );
}

function RanDigitalTwinPanel() {
  const tiles = Array.from({ length: 24 }).map((_, i) => {
    const stages = ["#94a3b8", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];
    return stages[(i * 7) % stages.length];
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Boxes className="size-5 text-cyan-600" />
        Digital Twin — Site Topology
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 text-xs text-slate-400">Simplified topology view — each tile represents a site, colored by lifecycle stage.</div>
        <div className="grid grid-cols-8 gap-2">
          {tiles.map((color, i) => (
            <div key={i} className="flex aspect-square items-center justify-center rounded-md" style={{ backgroundColor: `${color}33` }}>
              <Radio className="size-3.5" style={{ color }} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-slate-500">
          {[
            ["Candidate", "#94a3b8"],
            ["Survey", "#f59e0b"],
            ["Permitting", "#3b82f6"],
            ["Construction", "#8b5cf6"],
            ["Integration", "#06b6d4"],
            ["Live", "#10b981"],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RanPlatformAdminPanel({ primary }: { primary: string }) {
  const groups = [
    { label: "Access & Identity", rows: ["Roles & Permissions", "SSO / Identity Providers", "MFA Policy"] },
    { label: "Platform", rows: ["API Access & Rate Limits", "Data Retention Policy", "Audit Logging", "Notification Rules"] },
  ];
  let idx = 0;
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <ShieldCheck className="size-5 text-slate-600" />
        Platform & Admin
      </div>
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.label}</div>
            <div className="space-y-2">
              {g.rows.map((r) => {
                const i = idx++;
                return (
                  <div key={r} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                    <span className="text-sm text-slate-700">{r}</span>
                    <span className="relative h-5 w-9 shrink-0 rounded-full" style={{ backgroundColor: i % 3 !== 1 ? primary : "#e2e8f0" }}>
                      <span className="absolute top-0.5 size-4 rounded-full bg-white shadow" style={{ left: i % 3 !== 1 ? "18px" : "2px" }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AppPage {
  key: string;
  label: string;
  node: ReactNode;
}

interface AppSection {
  label: string;
  pages: AppPage[];
}

const RAN_MENU = [
  "Network Overview",
  "Network Planning",
  "Rollout & Deployment",
  "Commercial",
  "Network Intelligence",
  "AI Insights",
  "AI Agents",
  "Operations",
  "Digital Twin",
  "Platform & Admin",
];

function ConceptPagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-center">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <p className="mt-1.5 max-w-xs text-xs text-slate-400">Illustrative concept page — detailed layout not yet generated for this section.</p>
    </div>
  );
}

function getAppLayout(data: AppData): { title: string; sections: AppSection[]; settingsPage: AppPage | null } {
  const primary = data.createData.uiux.primaryColor;
  const settingsPage: AppPage = { key: "settings", label: "Settings", node: <MiniSettingsView primary={primary} /> };

  if (data.id === "ran" || data.id === "telecom-rollout") {
    const preview = data.operatePreview.kind === "structured" ? data.operatePreview : null;
    const ranPageNode: Record<string, ReactNode> = {
      "Network Overview": preview ? <InsightsHome data={data} preview={preview} primary={primary} /> : <ConceptPagePlaceholder label="Network Overview" />,
      "Network Planning": <RanNetworkPlanningPanel primary={primary} />,
      "Rollout & Deployment": <RanRolloutDeploymentPanel />,
      Commercial: <RanCommercialPanel />,
      "Network Intelligence": <RanNetworkIntelligencePanel />,
      "AI Insights": <RanAiInsightsPanel />,
      "AI Agents": <RanAiAgentsPanel />,
      Operations: <RanOperationsPanel />,
      "Digital Twin": <RanDigitalTwinPanel />,
      "Platform & Admin": <RanPlatformAdminPanel primary={primary} />,
    };
    return {
      title: data.title,
      sections: [
        {
          label: "",
          pages: RAN_MENU.map((label) => ({
            key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            label,
            node: ranPageNode[label],
          })),
        },
      ],
      settingsPage: null,
    };
  }

  if (data.operatePreview.kind === "chat") {
    const preview = data.operatePreview;
    return {
      title: preview.assistantName,
      sections: [
        {
          label: "Assistant",
          pages: [
            { key: "chat", label: "Chat", node: <ChatHome data={data} preview={preview} primary={primary} /> },
            { key: "history", label: "History", node: <MiniHistoryView primary={primary} /> },
          ],
        },
      ],
      settingsPage,
    };
  }

  const preview = data.operatePreview;

  const groupOrder: string[] = [];
  const grouped: Record<string, AppPage[]> = {};
  data.entities.forEach((e) => {
    const g = e.group ?? "Workspace";
    if (!grouped[g]) {
      grouped[g] = [];
      groupOrder.push(g);
    }
    grouped[g].push({ key: e.name, label: e.name, node: <MiniListView entityName={e.name} primary={primary} /> });
  });

  return {
    title: preview.appName,
    sections: [
      {
        label: "Overview",
        pages: [
          { key: "home", label: "Insights", node: <InsightsHome data={data} preview={preview} primary={primary} /> },
          { key: "reports", label: "Reports", node: <MiniReportsView preview={preview} /> },
        ],
      },
      ...groupOrder.map((g) => ({ label: g, pages: grouped[g] })),
    ],
    settingsPage,
  };
}

export function AppIdeaPreview({ data }: { data: AppData }) {
  const primary = data.createData.uiux.primaryColor;
  const initials = getInitials(data.title);
  const { title, sections, settingsPage } = getAppLayout(data);
  const allPages = [...sections.flatMap((s) => s.pages), ...(settingsPage ? [settingsPage] : [])];
  const [active, setActive] = useState(allPages[0].key);
  const activePage = allPages.find((p) => p.key === active) ?? allPages[0];

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[560px] overflow-hidden rounded-lg bg-white text-sm">
      <div className="w-56 shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50 p-4">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: primary }}>
            {initials}
          </div>
          <div className="truncate text-sm font-semibold text-slate-800">{title}</div>
        </div>

        {sections.map((section, si) => (
          <div key={section.label || si} className="mb-4">
            {section.label && <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{section.label}</div>}
            <div className="space-y-1">
              {section.pages.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActive(p.key)}
                  className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
                  style={active === p.key ? { backgroundColor: primary, color: "#fff" } : { color: "#475569" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {settingsPage && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={() => setActive(settingsPage.key)}
              className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
              style={active === settingsPage.key ? { backgroundColor: primary, color: "#fff" } : { color: "#475569" }}
            >
              {settingsPage.label}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">{activePage.node}</div>
    </div>
  );
}

function PageFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="size-1.5 rounded-full bg-slate-300" />
        <span className="size-1.5 rounded-full bg-slate-300" />
        <span className="size-1.5 rounded-full bg-slate-300" />
        <span className="ml-2 truncate text-[10px] font-medium text-slate-500">{label}</span>
      </div>
      <div className="h-[210px] overflow-hidden bg-white">
        <div className="w-[200%] p-6" style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AppPagesOverview({ data }: { data: AppData }) {
  const { sections, settingsPage } = getAppLayout(data);
  const allPages = [...sections.flatMap((s) => s.pages), ...(settingsPage ? [settingsPage] : [])];

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {allPages.length} core pages sketched out from your requirements, grouped to match the application's menu — an illustrative site map, not the working application.
      </p>
      <div className="space-y-6">
        {sections.map((section, si) => (
          <div key={section.label || si}>
            {section.label && <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{section.label}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              {section.pages.map((p) => (
                <PageFrame key={p.key} label={p.label}>
                  {p.node}
                </PageFrame>
              ))}
            </div>
          </div>
        ))}
        {settingsPage && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Settings</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <PageFrame label={settingsPage.label}>{settingsPage.node}</PageFrame>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
