import { useState } from "react";
import {
  Target,
  TrendingUp,
  Layers,
  TriangleAlert,
  GitBranch,
  Cloud,
  Eye,
  Database,
  Shield,
  Plug,
  User,
  Box,
  ChevronDown,
  Zap,
  ListChecks,
  CircleCheck,
  Route,
  ShieldCheck,
  Wrench,
  Gauge,
  ListOrdered,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import type { AppData, AcceptanceCriterion } from "../../data/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BulletList, Field, Pill } from "../ui/Bits";
import { Accordion, PriorityBadge } from "../ui/Accordion";
import { PillSelect, ToggleRow, DirectionBadge, CheckboxRow } from "../ui/Config";
import { cn } from "../../lib/utils";

const riskTone: Record<string, string> = {
  Low: "vw-chip--success",
  Medium: "vw-chip--warning",
  High: "vw-chip--error",
};

const sectionIcon = { cloud: Cloud, eye: Eye, database: Database, shield: Shield, plug: Plug };

export function OverviewTab({ data }: { data: AppData }) {
  const o = data.overview;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Target className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
            Business Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Organization">
            <p style={{ fontSize: "var(--vw-font-description)", lineHeight: "var(--vw-line-description)" }}>{o.organization}</p>
          </Field>
          <Field label="Current Landscape & Challenges">
            <BulletList items={o.challenges} />
          </Field>
          <Field label="Why This Solution Is Needed">
            <p style={{ fontSize: "var(--vw-font-description)", lineHeight: "var(--vw-line-description)" }}>{o.whyNeeded}</p>
          </Field>
          <Field label="Target Users & Stakeholders">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {o.users.map((u, i) => (
                <div key={i} className="vw-card-child">
                  <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{u.role}</div>
                  <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{u.goals}</div>
                </div>
              ))}
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
            Goals & Measurable Success Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Business & Operational Goals">
            <BulletList items={o.goals} />
          </Field>
          <Field label="Expected Improvements & Strategic Alignment">
            <p style={{ fontSize: "var(--vw-font-description)", lineHeight: "var(--vw-line-description)" }}>{o.improvements}</p>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Layers className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
            Scope & Out-of-Scope
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Defined Scope - Phase 1">
            <ul className="mt-2 space-y-2" style={{ fontSize: "var(--vw-font-description)" }}>
              {o.scope.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: "var(--color-primary, var(--vw-color-accent-500))" }} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Field>
          <Field label="Explicit Exclusions">
            <ul className="mt-2 space-y-2" style={{ fontSize: "var(--vw-font-description)" }}>
              {o.outOfScope.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: "var(--vw-color-gray-400)" }} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <TriangleAlert className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
            Key Problems & Pain Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {o.painPoints.map((p, i) => (
              <div key={i} className="vw-card-section vw-card--warning" style={{ padding: "var(--vw-space-lg)" }}>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2" style={{ background: "var(--vw-color-amber-100)" }}>
                    <TriangleAlert className="size-4" style={{ color: "var(--vw-color-amber-500)" }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{p.title}</div>
                    <div className="mt-1" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{p.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Field label="Priority Issues to Address">
            <div className="flex flex-wrap gap-2">
              {o.priorities.map((p, i) => (
                <Pill key={i}>{p}</Pill>
              ))}
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <GitBranch className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
            Risks, Dependencies & Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Known Risks">
            <div className="space-y-2">
              {o.risks.map((r, i) => (
                <div key={i} className="vw-card-child">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{r.title}</div>
                      <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>Mitigation: {r.mitigation}</div>
                    </div>
                    <span className={cn("vw-chip shrink-0", riskTone[r.level])} style={{ fontSize: "var(--vw-font-label-xs)" }}>{r.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </Field>
          <Field label="Dependencies">
            <BulletList items={o.dependencies} />
          </Field>
          <Field label="Foundational Assumptions">
            <BulletList items={o.assumptions} />
          </Field>
        </CardContent>
      </Card>
    </>
  );
}

export function ArchitectureTab({ data }: { data: AppData }) {
  return (
    <div className="space-y-6">
      {data.architecture.sections.map((section, i) => {
        const Icon = sectionIcon[section.icon];
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Icon className="size-5" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.pillGroups?.map((pg, j) => <PillSelect key={j} label={pg.label} options={pg.options} selected={pg.selected} />)}
              {section.toggles?.map((t, j) => (
                <ToggleRow key={j} label={t.label} description={t.description} defaultOn={t.on} />
              ))}
              {section.checkboxes && (
                <div style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", padding: "var(--vw-space-lg)" }}>
                  {section.checkboxes.map((c, j) => (
                    <CheckboxRow key={j} label={c} defaultChecked />
                  ))}
                </div>
              )}
              {section.integrations?.map((it, j) => (
                <div key={j} className="vw-card-child-shaded">
                  <div className="flex items-start justify-between gap-3">
                    <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{it.name}</div>
                    <DirectionBadge direction={it.direction} />
                  </div>
                  <p className="mt-1.5" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{it.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((step, i) => (
        <li key={i} className="flex items-start gap-3" style={{ fontSize: "var(--vw-font-description)" }}>
          <span
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--vw-color-accent-100)", fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--color-primary, var(--vw-color-accent-500))" }}
          >
            {i + 1}
          </span>
          <span className="leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function AcceptanceCriteriaList({ items }: { items: AcceptanceCriterion[] }) {
  return (
    <ol className="space-y-2">
      {items.map((c, i) => (
        <li
          key={i}
          className="vw-card-section vw-card--success flex items-start gap-2.5 leading-relaxed"
          style={{ padding: "12px", fontSize: "var(--vw-font-description)" }}
        >
          <CircleCheck className="mt-0.5 size-4 shrink-0" style={{ color: "var(--vw-color-emerald-500)" }} />
          <span>
            <span style={{ fontWeight: 500, color: "var(--vw-color-emerald-700)" }}>Given</span> {c.given},{" "}
            <span style={{ fontWeight: 500, color: "var(--vw-color-emerald-700)" }}>when</span> {c.when},{" "}
            <span style={{ fontWeight: 500, color: "var(--vw-color-emerald-700)" }}>then</span> {c.then}.
          </span>
        </li>
      ))}
    </ol>
  );
}

export function UseCasesTab({ data }: { data: AppData }) {
  const [q, setQ] = useState("");
  const filtered = data.useCases.filter(
    (u) => u.title.toLowerCase().includes(q.toLowerCase()) || u.actor.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search use cases by title or persona..."
        className="nst-input"
      />
      <div className="space-y-3">
        {filtered.map((u, i) => (
          <Accordion
            key={i}
            title={u.title}
            subtitle={
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {u.actor}
              </span>
            }
            right={<PriorityBadge level={u.priority} />}
          >
            <div className="space-y-5">
              <p className="leading-relaxed" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{u.description}</p>

              <Field label="Trigger">
                <p className="flex items-start gap-2 leading-relaxed" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>
                  <Zap className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--vw-color-amber-500)" }} />
                  {u.trigger}
                </p>
              </Field>

              <Field label="Preconditions">
                <BulletList items={u.preconditions} />
              </Field>

              <Field label="Main Flow">
                <NumberedList items={u.mainFlow} />
              </Field>

              <div>
                <label className="nst-input-label flex items-center gap-1.5">
                  <ListChecks className="size-3.5" />
                  Acceptance Criteria
                </label>
                <div className="mt-2">
                  <AcceptanceCriteriaList items={u.acceptanceCriteria} />
                </div>
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

function EntityCard({ entity, defaultOpen }: { entity: AppData["entities"][number]; defaultOpen?: boolean }) {
  return (
    <Accordion
      icon={
        <span className="vw-card-icon-md vw-chip vw-chip--info">
          <Box className="size-4" />
        </span>
      }
      title={entity.name}
      subtitle={entity.description}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        <div className="overflow-hidden" style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-blue-100)" }}>
          <div
            className="flex items-center gap-2"
            style={{ background: "var(--vw-color-blue-50)", padding: "10px 16px", fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-blue-700)" }}
          >
            Core Fields & Attributes
          </div>
          <div className="divide-y" style={{ borderColor: "var(--vw-color-slate-200)" }}>
            {entity.fields.map((f, i) => (
              <div key={i} className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono" style={{ fontSize: "var(--vw-font-description)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{f.name}</span>
                  <span className="vw-chip vw-chip--info is-strong" style={{ fontSize: "var(--vw-font-label-xs)", padding: "2px 6px" }}>{f.type}</span>
                  {f.modifiers.map((m, j) => (
                    <span
                      key={j}
                      className={cn("vw-chip is-strong", m === "Required" ? "vw-chip--error" : "vw-chip--warning")}
                      style={{ fontSize: "var(--vw-font-label-xs)", padding: "2px 6px" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{f.notes}</div>
                {f.default && (
                  <div className="mt-0.5" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
                    Default: <span className="font-mono">{f.default}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {entity.lifecycle && entity.lifecycle.length > 0 && (
          <div>
            <div className="nst-input-label mb-2 flex items-center gap-1.5">
              <Route className="size-3.5" />
              Lifecycle & Status Transitions
            </div>
            <div className="space-y-1.5">
              {entity.lifecycle.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-2"
                  style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)", padding: "10px", fontSize: "var(--vw-font-description)" }}
                >
                  <span className="vw-chip vw-chip--neutral font-mono" style={{ fontSize: "var(--vw-font-label-xs)", padding: "2px 8px" }}>{t.from}</span>
                  <ArrowRight className="size-3.5 shrink-0" style={{ color: "var(--vw-color-gray-500)" }} />
                  <span className="vw-chip vw-chip--neutral font-mono" style={{ fontSize: "var(--vw-font-label-xs)", padding: "2px 8px" }}>{t.to}</span>
                  <span style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>— {t.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="nst-input-label mb-2 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Validation Rules
          </div>
          <ul className="space-y-2" style={{ fontSize: "var(--vw-font-description)" }}>
            {entity.validationRules.map((rule, i) => (
              <li key={i} className="vw-card-section vw-card--purple flex items-start gap-2" style={{ padding: "10px" }}>
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--vw-color-purple-500)" }} />
                <span style={{ color: "var(--vw-color-gray-800)" }}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {entity.relationships.length > 0 && (
          <details className="group" style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)" }}>
            <summary
              className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5"
              style={{ fontSize: "var(--vw-font-description)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}
            >
              Relationships With Other Entities
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" style={{ color: "var(--vw-color-gray-500)" }} />
            </summary>
            <div className="grid gap-2 p-3 sm:grid-cols-2" style={{ borderTop: "1px solid var(--vw-color-slate-200)" }}>
              {entity.relationships.map((r, i) => (
                <div key={i} className="vw-card-child-shaded">
                  <div style={{ fontSize: "var(--vw-font-description)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{r.name}</div>
                  <div style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{r.description}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </Accordion>
  );
}

export function EntitiesTab({ data }: { data: AppData }) {
  const [q, setQ] = useState("");
  const filtered = data.entities.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search entities..."
        className="nst-input"
      />
      <div className="space-y-4">
        {filtered.map((e, i) => (
          <EntityCard key={i} entity={e} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}

const personaIcon: Record<string, typeof Shield> = {
  Manager: Shield,
  Assessor: Target,
  Adjuster: Target,
  Fraud: TriangleAlert,
  Support: User,
  Analyst: TriangleAlert,
};

function iconFor(role: string) {
  const key = Object.keys(personaIcon).find((k) => role.includes(k));
  return key ? personaIcon[key] : User;
}

export function PersonaTab({ data }: { data: AppData }) {
  const [q, setQ] = useState("");
  const filtered = data.personas.filter(
    (p) => p.role.toLowerCase().includes(q.toLowerCase()) || p.summary.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search personas..."
        className="nst-input"
      />
      <div className="space-y-3">
        {filtered.map((p, i) => {
          const Icon = iconFor(p.role);
          return (
            <Accordion
              key={i}
              icon={
                <span className="vw-card-icon-lg vw-chip vw-chip--neutral">
                  <Icon className="size-5" />
                </span>
              }
              title={p.role}
            >
              <div className="space-y-5">
                <p style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{p.summary}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="vw-chip vw-chip--info is-strong">
                    <KeyRound className="size-3" />
                    {p.accessLevel}
                  </span>
                </div>

                <Field label="Goals">
                  <BulletList items={p.goals} />
                </Field>
                <Field label="Pain Points">
                  <BulletList items={p.painPoints} />
                </Field>

                <div>
                  <div className="nst-input-label mb-2 flex items-center gap-1.5">
                    <Wrench className="size-3.5" />
                    Tools Used Today
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.toolsToday.map((t, j) => (
                      <span key={j} className="vw-chip vw-chip--neutral">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="nst-input-label mb-2 flex items-center gap-1.5">
                    <Gauge className="size-3.5" />
                    Success Metrics
                  </div>
                  <ul className="space-y-2" style={{ fontSize: "var(--vw-font-description)" }}>
                    {p.successMetrics.map((m, j) => (
                      <li key={j} className="vw-card-section vw-card--success flex items-start gap-2" style={{ padding: "10px" }}>
                        <Gauge className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--vw-color-emerald-500)" }} />
                        <span style={{ color: "var(--vw-color-gray-800)" }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="nst-input-label mb-2 flex items-center gap-1.5">
                    <ListOrdered className="size-3.5" />
                    Typical Workflow
                  </div>
                  <NumberedList items={p.typicalWorkflow} />
                </div>
              </div>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
