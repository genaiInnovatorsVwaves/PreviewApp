import { useState } from "react";
import { Plug, DollarSign, LayoutGrid, ServerCog, ShieldCheck, Play, ExternalLink } from "lucide-react";
import type { AppData } from "../../data/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs } from "../ui/Tabs";
import { PillSelect, DirectionBadge } from "../ui/Config";
import { cn } from "../../lib/utils";

const OPERATE_TABS = [
  { key: "integration", label: "Integration" },
  { key: "monetization", label: "Monetization" },
  { key: "modules", label: "Modules" },
  { key: "operations", label: "Operations" },
  { key: "security", label: "Security" },
  { key: "preview", label: "Preview" },
];

function IntegrationPanel({ data }: { data: AppData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Plug className="size-5 text-primary" />
          External System Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.operateData.integrations.map((it, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold text-foreground">{it.name}</div>
                <DirectionBadge direction={it.direction} />
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MonetizationPanel({ data }: { data: AppData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <DollarSign className="size-5 text-primary" />
          Metering Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.meteringCategories.map((cat, i) => (
          <div key={i}>
            <div className="mb-2 text-sm font-semibold text-foreground">{cat.category}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {cat.metrics.map((m, j) => (
                <div key={j} className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-foreground">
                    <span>{m.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{m.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ModulesPanel({ data }: { data: AppData }) {
  const total = data.operateData.moduleGroups.flatMap((g) => g.modules).length;
  const enabled = data.operateData.moduleGroups.flatMap((g) => g.modules).filter((m) => m.enabled).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="justify-between">
          <span className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-primary" />
            Available Modules
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {enabled} Enabled &nbsp;|&nbsp; {total} Total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.moduleGroups.map((g, i) => (
          <div key={i}>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {g.category} ({g.modules.length} modules)
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.modules.map((m, j) => (
                <div key={j} className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", m.enabled ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground")}>
                      {m.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OperationsPanel({ data }: { data: AppData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ServerCog className="size-5 text-primary" />
          Operations Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.operationsConfig.map((pg, i) => (
          <PillSelect key={i} label={pg.label} options={pg.options} selected={pg.selected} />
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">Reset to Defaults</button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save Configuration</button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityPanel({ data }: { data: AppData }) {
  const s = data.operateData.security;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <ShieldCheck className="size-5 text-primary" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PillSelect label={s.authModes.label} options={s.authModes.options} selected={s.authModes.selected} />
          <div>
            <div className="mb-2 text-sm font-medium text-foreground">Supported SSO Protocols</div>
            <div className="flex flex-wrap gap-2">
              {s.ssoProtocols.map((p, i) => (
                <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">{p}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-foreground">Configured Identity Providers</div>
            <div className="space-y-2">
              {s.identityProviders.map((idp, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{idp.name}</div>
                    <div className="text-xs text-muted-foreground">{idp.protocol} • {idp.domain}</div>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", idp.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                    {idp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <PillSelect label={s.mfaPolicy.label} options={s.mfaPolicy.options} selected={s.mfaPolicy.selected} />
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewPanel({ data }: { data: AppData }) {
  function launch() {
    window.open(data.externalPreviewUrl ?? `/preview/${data.id}`, "_blank", "noopener,noreferrer");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Play className="size-5 text-primary" />
          Application Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="text-sm font-semibold text-foreground">Launch Preview</div>
          <p className="mt-1 text-sm text-muted-foreground">Preview your application in a sandbox environment</p>
          <button
            onClick={launch}
            className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <ExternalLink className="size-4" />
            Start Preview
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OperateStage({ data }: { data: AppData }) {
  const [tab, setTab] = useState("integration");
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Tabs tabs={OPERATE_TABS} active={tab} onChange={setTab} />
      <div className="flex-1 overflow-y-auto p-8">
        {tab === "integration" && <IntegrationPanel data={data} />}
        {tab === "monetization" && <MonetizationPanel data={data} />}
        {tab === "modules" && <ModulesPanel data={data} />}
        {tab === "operations" && <OperationsPanel data={data} />}
        {tab === "security" && <SecurityPanel data={data} />}
        {tab === "preview" && <PreviewPanel data={data} />}
      </div>
    </div>
  );
}
