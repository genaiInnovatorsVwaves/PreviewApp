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

const accent = "var(--color-primary, var(--vw-color-accent-500))";

function IntegrationPanel({ data }: { data: AppData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Plug className="size-5" style={{ color: accent }} />
          External System Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.operateData.integrations.map((it, i) => (
            <div key={i} className="vw-card-child">
              <div className="flex items-start justify-between gap-3">
                <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{it.name}</div>
                <DirectionBadge direction={it.direction} />
              </div>
              <p className="mt-1.5" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>{it.description}</p>
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
          <DollarSign className="size-5" style={{ color: accent }} />
          Metering Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.meteringCategories.map((cat, i) => (
          <div key={i}>
            <div className="mb-2" style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{cat.category}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {cat.metrics.map((m, j) => (
                <div key={j} className="vw-card-child">
                  <div className="flex items-center justify-between" style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>
                    <span>{m.name}</span>
                    <span style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 400, color: "var(--vw-color-gray-500)" }}>{m.unit}</span>
                  </div>
                  <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{m.description}</div>
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
            <LayoutGrid className="size-5" style={{ color: accent }} />
            Available Modules
          </span>
          <span style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 400, color: "var(--vw-color-gray-500)" }}>
            {enabled} Enabled &nbsp;|&nbsp; {total} Total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.moduleGroups.map((g, i) => (
          <div key={i}>
            <div className="mb-2 uppercase tracking-wide" style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--vw-color-gray-500)" }}>
              {g.category} ({g.modules.length} modules)
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.modules.map((m, j) => (
                <div key={j} className="vw-card-child">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{m.name}</span>
                    <span className={cn("vw-chip is-strong", m.enabled ? "vw-chip--success" : "vw-chip--neutral")} style={{ fontSize: "10px", padding: "1px 8px" }}>
                      {m.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{m.description}</div>
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
          <ServerCog className="size-5" style={{ color: accent }} />
          Operations Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.operateData.operationsConfig.map((pg, i) => (
          <PillSelect key={i} label={pg.label} options={pg.options} selected={pg.selected} />
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button className="nst-btn">Reset to Defaults</button>
          <button className="nst-btn nst-btn--filled">Save Configuration</button>
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
            <ShieldCheck className="size-5" style={{ color: accent }} />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PillSelect label={s.authModes.label} options={s.authModes.options} selected={s.authModes.selected} />
          <div>
            <div className="mb-2" style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>Supported SSO Protocols</div>
            <div className="flex flex-wrap gap-2">
              {s.ssoProtocols.map((p, i) => (
                <span key={i} className="vw-chip vw-chip--neutral">{p}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2" style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>Configured Identity Providers</div>
            <div className="space-y-2">
              {s.identityProviders.map((idp, i) => (
                <div key={i} className="flex items-center justify-between vw-card-child">
                  <div>
                    <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{idp.name}</div>
                    <div style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{idp.protocol} • {idp.domain}</div>
                  </div>
                  <span className={cn("vw-chip is-strong", idp.status === "Active" ? "vw-chip--success" : "vw-chip--warning")}>
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
          <Play className="size-5" style={{ color: accent }} />
          Application Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ borderRadius: "var(--vw-radius-md)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)", padding: "var(--vw-space-2xl)" }}>
          <div style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>Launch Preview</div>
          <p className="mt-1" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>Preview your application in a sandbox environment</p>
          <button onClick={launch} className="nst-btn nst-btn--filled mt-4 flex items-center gap-2">
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
