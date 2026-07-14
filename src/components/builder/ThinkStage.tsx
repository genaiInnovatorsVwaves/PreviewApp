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
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-red-50 text-red-600",
};

const sectionIcon = { cloud: Cloud, eye: Eye, database: Database, shield: Shield, plug: Plug };

export function OverviewTab({ data }: { data: AppData }) {
  const o = data.overview;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <Target className="size-5 text-primary" />
            Business Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Organization">
            <p className="text-sm leading-relaxed">{o.organization}</p>
          </Field>
          <Field label="Current Landscape & Challenges">
            <BulletList items={o.challenges} />
          </Field>
          <Field label="Why This Solution Is Needed">
            <p className="text-sm leading-relaxed">{o.whyNeeded}</p>
          </Field>
          <Field label="Target Users & Stakeholders">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {o.users.map((u, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="text-sm font-medium">{u.role}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{u.goals}</div>
                </div>
              ))}
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="size-5 text-primary" />
            Goals & Measurable Success Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Business & Operational Goals">
            <BulletList items={o.goals} />
          </Field>
          <Field label="Expected Improvements & Strategic Alignment">
            <p className="text-sm leading-relaxed">{o.improvements}</p>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Layers className="size-5 text-primary" />
            Scope & Out-of-Scope
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Defined Scope - Phase 1">
            <ul className="mt-2 space-y-2 text-sm">
              {o.scope.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Field>
          <Field label="Explicit Exclusions">
            <ul className="mt-2 space-y-2 text-sm">
              {o.outOfScope.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
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
            <TriangleAlert className="size-5 text-primary" />
            Key Problems & Pain Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {o.painPoints.map((p, i) => (
              <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 p-2">
                    <TriangleAlert className="size-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{p.detail}</div>
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
            <GitBranch className="size-5 text-primary" />
            Risks, Dependencies & Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Known Risks">
            <div className="space-y-2">
              {o.risks.map((r, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{r.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Mitigation: {r.mitigation}</div>
                    </div>
                    <div className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs", riskTone[r.level])}>{r.level}</div>
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
                <Icon className="size-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.pillGroups?.map((pg, j) => <PillSelect key={j} label={pg.label} options={pg.options} selected={pg.selected} />)}
              {section.toggles?.map((t, j) => (
                <ToggleRow key={j} label={t.label} description={t.description} defaultOn={t.on} />
              ))}
              {section.checkboxes && (
                <div className="rounded-lg border border-border p-4">
                  {section.checkboxes.map((c, j) => (
                    <CheckboxRow key={j} label={c} defaultChecked />
                  ))}
                </div>
              )}
              {section.integrations?.map((it, j) => (
                <div key={j} className="rounded-lg border border-border bg-muted/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">{it.name}</div>
                    <DirectionBadge direction={it.direction} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{it.description}</p>
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
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
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
        <li key={i} className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm leading-relaxed">
          <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <span>
            <span className="font-semibold text-emerald-700">Given</span> {c.given}, <span className="font-semibold text-emerald-700">when</span> {c.when}, <span className="font-semibold text-emerald-700">then</span> {c.then}.
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
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
              <p className="text-sm leading-relaxed text-muted-foreground">{u.description}</p>

              <Field label="Trigger">
                <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                  <Zap className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
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
                <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Box className="size-4" />
        </span>
      }
      title={entity.name}
      subtitle={entity.description}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700">Core Fields & Attributes</div>
          <div className="divide-y divide-border">
            {entity.fields.map((f, i) => (
              <div key={i} className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">{f.name}</span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600">{f.type}</span>
                  {f.modifiers.map((m, j) => (
                    <span key={j} className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium", m === "Required" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600")}>
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{f.notes}</div>
                {f.default && <div className="mt-0.5 text-xs text-muted-foreground">Default: <span className="font-mono">{f.default}</span></div>}
              </div>
            ))}
          </div>
        </div>

        {entity.lifecycle && entity.lifecycle.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Route className="size-3.5" />
              Lifecycle & Status Transitions
            </div>
            <div className="space-y-1.5">
              {entity.lifecycle.map((t, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5 text-sm">
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">{t.from}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">{t.to}</span>
                  <span className="text-xs text-muted-foreground">— {t.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Validation Rules
          </div>
          <ul className="space-y-2 text-sm">
            {entity.validationRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-violet-100 bg-violet-50/50 p-2.5">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-violet-500" />
                <span className="text-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {entity.relationships.length > 0 && (
          <details className="group rounded-lg border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground">
              Relationships With Other Entities
              <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2">
              {entity.relationships.map((r, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <div className="text-sm font-medium text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
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
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="space-y-3">
        {filtered.map((p, i) => {
          const Icon = iconFor(p.role);
          return (
            <Accordion
              key={i}
              icon={
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-5" />
                </span>
              }
              title={p.role}
              subtitle={
                <span className="flex items-center gap-1.5">
                  <Box className="size-3.5" />
                  {p.experienceLevel}
                </span>
              }
            >
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">{p.summary}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
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
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Wrench className="size-3.5" />
                    Tools Used Today
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.toolsToday.map((t, j) => (
                      <span key={j} className="rounded-full border border-border px-3 py-1 text-xs text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Gauge className="size-3.5" />
                    Success Metrics
                  </div>
                  <ul className="space-y-2 text-sm">
                    {p.successMetrics.map((m, j) => (
                      <li key={j} className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 p-2.5">
                        <Gauge className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        <span className="text-foreground">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
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
