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
          <h1 className="mt-6 text-3xl font-semibold text-white">{appName}</h1>
          <p className="mt-2 text-white/70">{tagline}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl shadow-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your dashboard</p>

          <label className="mt-6 block text-sm font-medium text-slate-700">Email Address</label>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
            <Mail className="size-4 text-slate-400" />
            <span className="text-sm text-slate-700">{email}</span>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
            <Lock className="size-4 text-slate-400" />
            <span className="text-sm tracking-widest text-slate-700">••••••••</span>
          </div>

          <button
            onClick={onSignIn}
            className="mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          >
            Sign In
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-400">© 2026 {appName}. Secure enterprise platform.</p>
      </div>
    </div>
  );
}

function Sidebar({ navItems, appName }: { navItems: string[]; appName: string }) {
  const [active, setActive] = useState(navItems[0]);
  return (
    <div className="flex w-20 shrink-0 flex-col items-center border-r border-slate-800 bg-slate-950 py-4">
      <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-blue-600">
        <span className="text-sm font-bold text-white">{appName.slice(0, 1)}</span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => {
          const Icon = NAV_ICON[item] ?? Home;
          const isActive = item === active;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`flex w-16 flex-col items-center gap-1 rounded-lg py-2.5 text-[10px] transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="size-5" />
              {item}
            </button>
          );
        })}
      </div>
      <button className="flex w-16 flex-col items-center gap-1 rounded-lg py-2.5 text-[10px] text-slate-400 hover:bg-slate-800 hover:text-slate-200">
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
    <div className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex-1 space-y-1 overflow-y-auto p-3 pt-4">
        {navItems.map((item) => {
          const Icon = RAN_NAV_ICON[item] ?? Home;
          const isActive = item === active;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
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

      <div className="border-t border-slate-100 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
          <span className="relative flex items-center">
            <Bell className="size-[18px]" />
            <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white">
              9+
            </span>
          </span>
          Notifications
        </button>
        <button className="mt-1 flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
          <span className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">MS</span>
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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`flex size-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`size-4 ${iconColor}`} />
        </span>
        <span className={`text-xs font-medium ${deltaUp ? "text-emerald-600" : "text-red-500"}`}>{delta}</span>
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function StructuredDashboard({ data, role }: { data: ReturnType<typeof getAppData>; role: string | null }) {
  if (!data || data.operatePreview.kind !== "structured") return null;
  const p = data.operatePreview;
  const c = p.charts;
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {data.id === "ran" || data.id === "telecom-rollout" ? (
        <RanSidebar navItems={p.navItems} />
      ) : (
        <Sidebar navItems={p.navItems} appName={p.appName} />
      )}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{p.appName}</h1>
            <p className="text-sm text-slate-500">Signed in as {role ?? "Admin"} · Live sandbox preview</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">● Live</span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {p.stats.map((s, i) => (
            <StatCard
              key={i}
              icon={Sparkles}
              iconBg={s.tone === "warn" ? "bg-amber-50" : "bg-blue-50"}
              iconColor={s.tone === "warn" ? "text-amber-600" : "text-blue-600"}
              value={s.value}
              label={s.label}
              delta={s.delta}
              deltaUp={s.tone === "up"}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{c.stageTitle}</h3>
            <BarChart data={c.stageBars} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{c.typeTitle}</h3>
            <DonutChart data={c.typeSlices} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{c.trendTitle}</h3>
            <LineChart seriesA={c.trendA} seriesB={c.trendB} labelA={c.trendLabelA} labelB={c.trendLabelB} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{c.riskTitle}</h3>
            <BarChart data={c.riskBars} />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">{p.tableTitle}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {p.columns.map((col) => (
                    <th key={col.key} className="px-5 py-2.5 font-medium">{col.label}</th>
                  ))}
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                    {p.columns.map((col) => (
                      <td key={col.key} className="px-5 py-3">
                        {col.key === "id" ? <span className="font-mono text-xs text-slate-500">{row.id}</span> : row.cells[col.key]}
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          row.statusTone === "green"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.statusTone === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : row.statusTone === "red"
                                ? "bg-red-50 text-red-600"
                                : row.statusTone === "blue"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-600"
                        }`}
                      >
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar navItems={p.navItems} appName={p.appName} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-slate-900">{p.assistantName}</h1>
            <p className="text-xs text-emerald-600">● Online — signed in as {role ?? "Employee"}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">Live sandbox preview</span>
        </div>
        <div className="flex flex-1">
          <div className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Channels</div>
            <div className="mt-3 space-y-1.5">
              {p.channels.map((ch, i) => (
                <div key={i} className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-blue-50 font-medium text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>{ch}</div>
              ))}
            </div>
            <div className="mt-6 text-xs font-medium uppercase tracking-wide text-slate-400">Try asking</div>
            <div className="mt-3 space-y-2">
              {p.suggestedPrompts.map((sp, i) => (
                <button key={i} onClick={() => setDraft(sp)} className="w-full rounded-lg border border-slate-200 p-2.5 text-left text-xs text-slate-500 hover:border-blue-300 hover:text-slate-800">
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
                    <div className="max-w-md rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white">
                      {m.text}
                      <div className="mt-1 text-[10px] text-blue-100">{m.time}</div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Sparkles className="size-4 text-blue-600" />
                    </div>
                    <div className="max-w-md rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm">
                      {m.text}
                      <div className="mt-1 text-[10px] text-slate-400">{m.time}</div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about leave, payroll, onboarding..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                />
                <button onClick={send} disabled={!draft.trim()} className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
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
