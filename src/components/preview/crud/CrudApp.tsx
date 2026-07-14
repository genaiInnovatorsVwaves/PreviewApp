import { useMemo, useState } from "react";
import { LayoutDashboard, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, LogOut, CircleCheck } from "lucide-react";
import type { CrudAppConfig, CrudEntityConfig, CrudRow } from "../../../data/crudTypes";
import { CRUD_ICONS } from "./CrudIcons";
import { EntityFormModal } from "./EntityFormModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { BarChart, DonutChart, LineChart } from "../Charts";

const TONE_CLASSES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-600",
  purple: "bg-purple-50 text-purple-600",
};

const STAT_TONE_CLASSES: Record<string, string> = {
  up: "text-emerald-600",
  down: "text-red-500",
  flat: "text-slate-500",
  warn: "text-amber-600",
};

const PAGE_SIZE = 8;

function formatCell(entity: CrudEntityConfig, key: string, value: string | number) {
  const field = entity.fields.find((f) => f.key === key);
  if (field?.type === "currency" && typeof value === "number") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }
  if (field?.suffix && (typeof value === "number" || value !== "")) {
    return `${value}${field.suffix}`;
  }
  return String(value);
}

function StatusPill({ entity, fieldKey, value }: { entity: CrudEntityConfig; fieldKey: string; value: string | number }) {
  const field = entity.fields.find((f) => f.key === fieldKey);
  const option = field?.options?.find((o) => o.value === value);
  const tone = option?.tone ?? "slate";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}>{String(value)}</span>;
}

function Sidebar({
  config,
  active,
  onSelect,
  onLogout,
  role,
  rowCounts,
}: {
  config: CrudAppConfig;
  active: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
  role: string | null;
  rowCounts: Record<string, number>;
}) {
  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})` }}
        >
          {config.appName.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900">{config.appName}</div>
          <div className="truncate text-xs text-slate-400">{config.tagline}</div>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => onSelect("dashboard")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active === "dashboard" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard className="size-[18px] shrink-0" />
          Dashboard
        </button>

        <div className="pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Records</div>
        {config.entities.map((e) => {
          const Icon = CRUD_ICONS[e.icon];
          const isActive = active === e.key;
          return (
            <button
              key={e.key}
              type="button"
              onClick={() => onSelect(e.key)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-[18px] shrink-0" />
                {e.labelPlural}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"}`}>
                {rowCounts[e.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            {(role ?? "Admin").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-800">{role ?? "Admin"}</div>
            <div className="text-[11px] text-emerald-600">● Live sandbox</div>
          </div>
          <button type="button" onClick={onLogout} title="Sign out" className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: CrudAppConfig["dashboardStats"][number] }) {
  const Icon = CRUD_ICONS[stat.icon];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
          <Icon className="size-4" />
        </span>
        {stat.delta && <span className={`text-xs font-medium ${STAT_TONE_CLASSES[stat.tone]}`}>{stat.delta}</span>}
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</div>
      <div className="text-xs text-slate-500">{stat.label}</div>
    </div>
  );
}

function DashboardView({ config, appName, role }: { config: CrudAppConfig; appName: string; role: string | null }) {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Signed in as {role ?? "Admin"} · Live sandbox preview</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">● Live</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {config.dashboardStats.map((s, i) => (
          <StatCard key={i} stat={s} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {config.dashboardCharts.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{c.title}</h3>
            {c.kind === "bar" && c.bars && <BarChart data={c.bars} />}
            {c.kind === "donut" && c.donut && <DonutChart data={c.donut} />}
            {c.kind === "line" && c.lineA && c.lineB && (
              <LineChart seriesA={c.lineA} seriesB={c.lineB} labelA={c.lineLabelA ?? "A"} labelB={c.lineLabelB ?? "B"} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EntityView({
  entity,
  rows,
  onCreate,
  onEdit,
  onDelete,
}: {
  entity: CrudEntityConfig;
  rows: CrudRow[];
  onCreate: () => void;
  onEdit: (row: CrudRow) => void;
  onDelete: (row: CrudRow) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const columns = entity.fields.filter((f) => !f.hideInTable);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{entity.labelPlural}</h1>
          <p className="text-sm text-slate-500">{rows.length} total records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${entity.labelPlural.toLowerCase()}`}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="size-4" />
            New {entity.label}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5">
                      {c.key === entity.primaryKey ? (
                        <span className="font-medium text-slate-900">{String(row[c.key])}</span>
                      ) : c.isStatus ? (
                        <StatusPill entity={entity} fieldKey={c.key} value={row[c.key]} />
                      ) : (
                        <span className="text-slate-600">{formatCell(entity, c.key, row[c.key])}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        title="Edit"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        title="Delete"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-sm text-slate-400">
                    No {entity.labelPlural.toLowerCase()} match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>
            Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}-{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 text-slate-600">
              Page {pageSafe} of {totalPages}
            </span>
            <button
              type="button"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrudApp({ config, role, onLogout }: { config: CrudAppConfig; role: string | null; onLogout: () => void }) {
  const [section, setSection] = useState("dashboard");
  const [rowsByEntity, setRowsByEntity] = useState<Record<string, CrudRow[]>>(() => {
    const init: Record<string, CrudRow[]> = {};
    for (const e of config.entities) init[e.key] = e.seedRows;
    return init;
  });
  const [modalEntity, setModalEntity] = useState<CrudEntityConfig | null>(null);
  const [editingRow, setEditingRow] = useState<CrudRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ entity: CrudEntityConfig; row: CrudRow } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function openCreate(entity: CrudEntityConfig) {
    setModalEntity(entity);
    setEditingRow(null);
  }

  function openEdit(entity: CrudEntityConfig, row: CrudRow) {
    setModalEntity(entity);
    setEditingRow(row);
  }

  function handleSave(values: Record<string, string | number>) {
    if (!modalEntity) return;
    setRowsByEntity((prev) => {
      const rows = prev[modalEntity.key];
      if (editingRow) {
        return { ...prev, [modalEntity.key]: rows.map((r) => (r.id === editingRow.id ? { ...r, ...values } : r)) };
      }
      const newId = `${modalEntity.key}-${String(rows.length + 1).padStart(3, "0")}-${Math.random().toString(36).slice(2, 6)}`;
      return { ...prev, [modalEntity.key]: [{ id: newId, ...values }, ...rows] };
    });
    showToast(editingRow ? `${modalEntity.label} updated successfully.` : `${modalEntity.label} created successfully.`);
    setModalEntity(null);
    setEditingRow(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setRowsByEntity((prev) => ({
      ...prev,
      [deleteTarget.entity.key]: prev[deleteTarget.entity.key].filter((r) => r.id !== deleteTarget.row.id),
    }));
    showToast(`${deleteTarget.entity.label} deleted.`);
    setDeleteTarget(null);
  }

  const rowCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of config.entities) counts[e.key] = rowsByEntity[e.key]?.length ?? 0;
    return counts;
  }, [rowsByEntity, config.entities]);

  const activeEntity = config.entities.find((e) => e.key === section) ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar config={config} active={section} onSelect={setSection} onLogout={onLogout} role={role} rowCounts={rowCounts} />
      <div className="flex-1 overflow-y-auto">
        {section === "dashboard" && <DashboardView config={config} appName={config.appName} role={role} />}
        {activeEntity && (
          <EntityView
            entity={activeEntity}
            rows={rowsByEntity[activeEntity.key] ?? []}
            onCreate={() => openCreate(activeEntity)}
            onEdit={(row) => openEdit(activeEntity, row)}
            onDelete={(row) => setDeleteTarget({ entity: activeEntity, row })}
          />
        )}
      </div>

      {modalEntity && (
        <EntityFormModal
          entity={modalEntity}
          initial={editingRow}
          onCancel={() => {
            setModalEntity(null);
            setEditingRow(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete this ${deleteTarget.entity.label.toLowerCase()}?`}
          message={`"${deleteTarget.row[deleteTarget.entity.primaryKey]}" will be permanently removed. This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl">
          <CircleCheck className="size-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
