import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Home,
  FileText,
  Users,
  ShieldAlert,
  LogOut,
  MessageSquare,
  Settings,
  Send,
  Sparkles,
  Compass,
  CircleDollarSign,
  BarChart3,
  Lightbulb,
  Bot,
  Cog,
  Box,
  Bell,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { getAppData } from "../data";
import { getCrudApp } from "../data/crudApps";
import { CrudApp } from "../components/preview/crud/CrudApp";
import { BarChart, DonutChart, LineChart } from "../components/preview/Charts";

const NAV_ICON: Record<string, typeof Home> = {
  Home: Home,
  Insurance: FileText,
  Cases: FileText,
  Fraud: ShieldAlert,
  Users: Users,
  Chats: MessageSquare,
  Team: Users,
  Settings: Settings,
};

function LoginScreen({
  appName,
  tagline,
  gradientFrom,
  gradientTo,
  email,
  onSignIn,
}: {
  appName: string;
  tagline: string;
  gradientFrom: string;
  gradientTo: string;
  email: string;
  onSignIn: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <div
        className="hidden w-1/2 items-center justify-center lg:flex"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <ShieldCheck className="size-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-medium text-white">{appName}</h1>
          <p className="mt-2 text-white/70">{tagline}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6">
        <div
          className="w-full max-w-sm"
          style={{ borderRadius: "var(--vw-radius-lg)", background: "var(--vw-color-white)", padding: "32px", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
        >
          <h2 className="vw-card-title-lg">Welcome Back</h2>
          <p className="mt-1" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
            Sign in to access your dashboard
          </p>

          <label className="nst-input-label mt-6" style={{ display: "block" }}>Email Address</label>
          <div
            className="mt-1.5 flex items-center gap-2"
            style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", padding: "10px 12px" }}
          >
            <Mail className="size-4" style={{ color: "var(--vw-color-gray-400)" }} />
            <span style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-700)" }}>{email}</span>
          </div>

          <label className="nst-input-label mt-4" style={{ display: "block" }}>Password</label>
          <div
            className="mt-1.5 flex items-center gap-2"
            style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", padding: "10px 12px" }}
          >
            <Lock className="size-4" style={{ color: "var(--vw-color-gray-400)" }} />
            <span className="tracking-widest" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-700)" }}>••••••••</span>
          </div>

          <button
            onClick={onSignIn}
            className="mt-6 w-full transition-opacity hover:opacity-90"
            style={{
              borderRadius: "var(--vw-radius-sm)",
              padding: "10px",
              fontSize: "var(--vw-font-label-md)",
              fontWeight: 500,
              color: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
          >
            Sign In
          </button>
        </div>
        <p className="mt-6" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}>
          © 2026 {appName}. Secure enterprise platform.
        </p>
      </div>
    </div>
  );
}

function Sidebar({ navItems, appName }: { navItems: string[]; appName: string }) {
  const [active, setActive] = useState(navItems[0]);
  return (
    <div
      className="flex w-20 shrink-0 flex-col items-center py-4"
      style={{ borderRight: "1px solid var(--vw-color-gray-800)", background: "var(--vw-color-gray-900)" }}
    >
      <div
        className="mb-6 flex size-10 items-center justify-center"
        style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--color-primary, var(--vw-color-accent-500))" }}
      >
        <span style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "#fff" }}>{appName.slice(0, 1)}</span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => {
          const Icon = NAV_ICON[item] ?? Home;
          const isActive = item === active;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className="flex w-16 flex-col items-center gap-1 transition-colors"
              style={{
                borderRadius: "var(--vw-radius-sm)",
                padding: "10px 0",
                fontSize: "10px",
                background: isActive ? "var(--color-primary, var(--vw-color-accent-500))" : "transparent",
                color: isActive ? "#fff" : "var(--vw-color-gray-400)",
              }}
            >
              <Icon className="size-5" />
              {item}
            </button>
          );
        })}
      </div>
      <button
        className="flex w-16 flex-col items-center gap-1 transition-colors"
        style={{ borderRadius: "var(--vw-radius-sm)", padding: "10px 0", fontSize: "10px", color: "var(--vw-color-gray-400)" }}
      >
        <LogOut className="size-5" />
        Logout
      </button>
    </div>
  );
}

const RAN_NAV_ICON: Record<string, LucideIcon> = {
  "Network Overview": Home,
  "Network Planning": Compass,
  "Rollout & Deployment": Users,
  Commercial: CircleDollarSign,
  "Network Intelligence": BarChart3,
  "AI Insights": Lightbulb,
  "AI Agents": Bot,
  Operations: Cog,
  "Digital Twin": Box,
  "Platform & Admin": Settings,
};

const RAN_NAV_EXPANDABLE = new Set([
  "Network Planning",
  "Rollout & Deployment",
  "Commercial",
  "Network Intelligence",
  "Operations",
  "Platform & Admin",
]);

function RanSidebar({ navItems }: { navItems: string[] }) {
  const [active, setActive] = useState(navItems[0]);
  return (
    <div className="flex w-64 shrink-0 flex-col" style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}>
      <div className="flex-1 space-y-1 overflow-y-auto p-3 pt-4">
        {navItems.map((item) => {
          const Icon = RAN_NAV_ICON[item] ?? Home;
          const isActive = item === active;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className="flex w-full items-center justify-between gap-3 transition-colors"
              style={{
                borderRadius: "var(--vw-radius-sm)",
                padding: "10px 14px",
                fontSize: "var(--vw-font-label-md)",
                fontWeight: 500,
                background: isActive ? "var(--color-primary, var(--vw-color-accent-500))" : "transparent",
                color: isActive ? "#fff" : "var(--vw-color-gray-700)",
              }}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-[18px] shrink-0" />
                {item}
              </span>
              {RAN_NAV_EXPANDABLE.has(item) && <ChevronRight className="size-3.5 shrink-0 opacity-60" />}
            </button>
          );
        })}
      </div>

      <div className="p-3" style={{ borderTop: "1px solid var(--vw-color-gray-100)" }}>
        <button
          className="flex w-full items-center gap-3"
          style={{ borderRadius: "var(--vw-radius-sm)", padding: "10px 14px", fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-700)" }}
        >
          <span className="relative flex items-center">
            <Bell className="size-[18px]" />
            <span
              className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center text-[9px] font-medium"
              style={{ borderRadius: "var(--vw-radius-full)", background: "var(--vw-color-red-500)", color: "#fff" }}
            >
              9+
            </span>
          </span>
          Notifications
        </button>
        <button
          className="mt-1 flex w-full items-center justify-between gap-3"
          style={{ borderRadius: "var(--vw-radius-sm)", padding: "10px 14px", fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-700)" }}
        >
          <span className="flex items-center gap-2.5">
            <span
              className="flex size-7 shrink-0 items-center justify-center text-xs font-medium"
              style={{ borderRadius: "var(--vw-radius-full)", background: "var(--vw-color-orange-500)", color: "#fff" }}
            >
              MS
            </span>
            Mohak Soni
          </span>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, delta, deltaUp }: any) {
  return (
    <div className="vw-card-section">
      <div className="flex items-center justify-between">
        <span className={`vw-card-icon-md vw-chip ${iconBg}`}>
          <Icon className={`size-4 ${iconColor}`} />
        </span>
        <span className={`vw-card-variance ${deltaUp ? "is-positive" : "is-negative"}`}>{delta}</span>
      </div>
      <div className="vw-card-metric-lg mt-3">{value}</div>
      <div className="vw-card-metric-label">{label}</div>
    </div>
  );
}

function StructuredDashboard({ data, role }: { data: ReturnType<typeof getAppData>; role: string | null }) {
  if (!data || data.operatePreview.kind !== "structured") return null;
  const p = data.operatePreview;
  const c = p.charts;
  const statusChip: Record<string, string> = {
    green: "vw-chip--success",
    amber: "vw-chip--warning",
    red: "vw-chip--error",
    blue: "vw-chip--info",
  };
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--vw-color-gray-50)" }}>
      {data.id === "ran" || data.id === "telecom-rollout" ? (
        <RanSidebar navItems={p.navItems} />
      ) : (
        <Sidebar navItems={p.navItems} appName={p.appName} />
      )}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="vw-page-title">{p.appName}</h1>
            <p className="vw-page-description" style={{ color: "var(--vw-color-gray-500)" }}>
              Signed in as {role ?? "Admin"} · Live sandbox preview
            </p>
          </div>
          <span className="vw-chip vw-chip--success is-strong">● Live</span>
        </div>

        <div className="vw-grid vw-grid-cols-4 vw-gap-lg">
          {p.stats.map((s, i) => (
            <StatCard
              key={i}
              icon={Sparkles}
              iconBg={s.tone === "warn" ? "vw-chip--warning" : "vw-chip--info"}
              iconColor=""
              value={s.value}
              label={s.label}
              delta={s.delta}
              deltaUp={s.tone === "up"}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="vw-card-section">
            <h3 className="vw-card-title-sm mb-4">{c.stageTitle}</h3>
            <BarChart data={c.stageBars} />
          </div>
          <div className="vw-card-section">
            <h3 className="vw-card-title-sm mb-4">{c.typeTitle}</h3>
            <DonutChart data={c.typeSlices} />
          </div>
          <div className="vw-card-section">
            <h3 className="vw-card-title-sm mb-4">{c.trendTitle}</h3>
            <LineChart seriesA={c.trendA} seriesB={c.trendB} labelA={c.trendLabelA} labelB={c.trendLabelB} />
          </div>
          <div className="vw-card-section">
            <h3 className="vw-card-title-sm mb-4">{c.riskTitle}</h3>
            <BarChart data={c.riskBars} />
          </div>
        </div>

        <div className="mt-6" style={{ borderRadius: "var(--vw-radius-lg)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}>
          <div className="vw-card-title-sm" style={{ borderBottom: "1px solid var(--vw-color-slate-200)", padding: "16px 20px" }}>
            {p.tableTitle}
          </div>
          <div className="overflow-x-auto">
            <table className="nst-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {p.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((row) => (
                  <tr key={row.id}>
                    {p.columns.map((col) => (
                      <td key={col.key} className={col.key === "id" ? "nst-table-td--primary" : undefined}>
                        {col.key === "id" ? (
                          <span className="font-mono" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
                            {row.id}
                          </span>
                        ) : (
                          row.cells[col.key]
                        )}
                      </td>
                    ))}
                    <td>
                      <span className={`vw-chip ${statusChip[row.statusTone] ?? "vw-chip--neutral"}`} style={{ fontSize: "var(--vw-font-label-sm)" }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatDashboard({ data, role }: { data: ReturnType<typeof getAppData>; role: string | null }) {
  if (!data || data.operatePreview.kind !== "chat") return null;
  const p = data.operatePreview;
  const [messages, setMessages] = useState(p.conversation);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: draft.trim(), time: "now" }, { from: "bot", text: "Got it — checking that against your record now.", time: "now" }]);
    setDraft("");
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--vw-color-gray-50)" }}>
      <Sidebar navItems={p.navItems} appName={p.appName} />
      <div className="flex flex-1 flex-col">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}
        >
          <div>
            <h1 className="vw-card-title">{p.assistantName}</h1>
            <p style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-emerald-600)" }}>
              ● Online — signed in as {role ?? "Employee"}
            </p>
          </div>
          <span className="vw-chip vw-chip--success is-strong">Live sandbox preview</span>
        </div>
        <div className="flex flex-1">
          <div
            className="hidden w-60 shrink-0 flex-col p-4 lg:flex"
            style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}
          >
            <div className="nst-input-label">Channels</div>
            <div className="mt-3 space-y-1.5">
              {p.channels.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "var(--vw-radius-sm)",
                    padding: "8px 12px",
                    fontSize: "var(--vw-font-label-md)",
                    fontWeight: i === 0 ? 500 : 400,
                    background: i === 0 ? "var(--vw-color-accent-50)" : "transparent",
                    color: i === 0 ? "var(--color-primary, var(--vw-color-accent-600))" : "var(--vw-color-gray-500)",
                  }}
                >
                  {ch}
                </div>
              ))}
            </div>
            <div className="nst-input-label mt-6">Try asking</div>
            <div className="mt-3 space-y-2">
              {p.suggestedPrompts.map((sp, i) => (
                <button
                  key={i}
                  onClick={() => setDraft(sp)}
                  className="w-full text-left transition-colors"
                  style={{
                    borderRadius: "var(--vw-radius-sm)",
                    border: "1px solid var(--vw-color-slate-200)",
                    padding: "10px",
                    fontSize: "var(--vw-font-label-sm)",
                    color: "var(--vw-color-gray-500)",
                  }}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((m, i) =>
                m.from === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div
                      className="max-w-md leading-relaxed"
                      style={{
                        borderRadius: "var(--vw-radius-md) var(--vw-radius-md) var(--vw-radius-xs) var(--vw-radius-md)",
                        padding: "10px 16px",
                        fontSize: "var(--vw-font-description)",
                        background: "var(--color-primary, var(--vw-color-accent-500))",
                        color: "#fff",
                      }}
                    >
                      {m.text}
                      <div className="mt-1" style={{ fontSize: "10px", color: "var(--vw-color-accent-100)" }}>{m.time}</div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start gap-3">
                    <div
                      className="flex size-8 shrink-0 items-center justify-center"
                      style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--vw-color-accent-50)" }}
                    >
                      <Sparkles className="size-4" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
                    </div>
                    <div
                      className="max-w-md leading-relaxed"
                      style={{
                        borderRadius: "var(--vw-radius-md) var(--vw-radius-md) var(--vw-radius-md) var(--vw-radius-xs)",
                        padding: "10px 16px",
                        fontSize: "var(--vw-font-description)",
                        background: "var(--vw-color-white)",
                        color: "var(--vw-color-gray-800)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {m.text}
                      <div className="mt-1" style={{ fontSize: "10px", color: "var(--vw-color-gray-400)" }}>{m.time}</div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="p-4" style={{ borderTop: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}>
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about leave, payroll, onboarding..."
                  className="nst-input flex-1"
                />
                <button onClick={send} disabled={!draft.trim()} className="nst-btn nst-btn--filled nst-btn--icon">
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewApp() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const role = params.get("role");
  const crudConfig = id ? getCrudApp(id) : undefined;
  const data = !crudConfig && id ? getAppData(id) : undefined;
  const [signedIn, setSignedIn] = useState(false);

  if (!crudConfig && !data) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--vw-color-gray-50)", color: "var(--vw-color-gray-500)" }}
      >
        Preview not found.
      </div>
    );
  }

  const branding = crudConfig
    ? { appName: crudConfig.appName, tagline: crudConfig.tagline, gradientFrom: crudConfig.gradientFrom, gradientTo: crudConfig.gradientTo, email: crudConfig.email }
    : data!.operateData.previewBranding;

  if (!signedIn) {
    return (
      <LoginScreen
        appName={branding.appName}
        tagline={branding.tagline}
        gradientFrom={branding.gradientFrom}
        gradientTo={branding.gradientTo}
        email={branding.email}
        onSignIn={() => setSignedIn(true)}
      />
    );
  }

  if (crudConfig) {
    return <CrudApp config={crudConfig} role={role} onLogout={() => setSignedIn(false)} />;
  }

  return data!.operatePreview.kind === "structured" ? (
    <StructuredDashboard data={data} role={role} />
  ) : (
    <ChatDashboard data={data} role={role} />
  );
}
