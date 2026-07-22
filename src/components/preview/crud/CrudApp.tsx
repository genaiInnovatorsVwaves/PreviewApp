import { useMemo, useState } from "react";
import { LayoutDashboard, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, LogOut, CircleCheck } from "lucide-react";
import type { CrudAppConfig, CrudEntityConfig, CrudRow } from "../../../data/crudTypes";
import { CRUD_ICONS } from "./CrudIcons";
import { EntityFormModal } from "./EntityFormModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { BarChart, DonutChart, LineChart } from "../Charts";

const TONE_CLASSES: Record<string, string> = {
  green: "vw-chip--success",
  amber: "vw-chip--warning",
  red: "vw-chip--error",
  blue: "vw-chip--info",
  slate: "vw-chip--neutral",
  purple: "vw-chip--purple",
};

const STAT_TONE_TOKENS: Record<string, string> = {
  up: "var(--vw-color-emerald-600)",
  down: "var(--vw-color-red-500)",
  flat: "var(--vw-color-gray-500)",
  warn: "var(--vw-color-amber-600)",
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
  return <span className={`vw-chip is-strong ${TONE_CLASSES[tone]}`}>{String(value)}</span>;
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
  const accent = "var(--color-primary, var(--vw-color-accent-500))";
  return (
    <div className="flex w-64 shrink-0 flex-col" style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)" }}>
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid var(--vw-color-slate-100)" }}>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "#fff" }}
        >
          {config.appName.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="truncate" style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-900)" }}>{config.appName}</div>
          <div className="truncate" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}>{config.tagline}</div>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => onSelect("dashboard")}
          className="flex w-full items-center gap-3 transition-colors"
          style={{
            borderRadius: "var(--vw-radius-sm)",
            padding: "10px 12px",
            fontSize: "var(--vw-font-label-md)",
            fontWeight: 500,
            background: active === "dashboard" ? accent : "transparent",
            color: active === "dashboard" ? "#fff" : "var(--vw-color-gray-600)",
          }}
        >
          <LayoutDashboard className="size-[18px] shrink-0" />
          Dashboard
        </button>

        <div className="pt-3 pb-1" style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--vw-color-gray-400)" }}>
          Records
        </div>
        {config.entities.map((e) => {
          const Icon = CRUD_ICONS[e.icon];
          const isActive = active === e.key;
          return (
            <button
              key={e.key}
              type="button"
              onClick={() => onSelect(e.key)}
              className="flex w-full items-center justify-between gap-3 transition-colors"
              style={{
                borderRadius: "var(--vw-radius-sm)",
                padding: "10px 12px",
                fontSize: "var(--vw-font-label-md)",
                fontWeight: 500,
                background: isActive ? accent : "transparent",
                color: isActive ? "#fff" : "var(--vw-color-gray-600)",
              }}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-[18px] shrink-0" />
                {e.labelPlural}
              </span>
              <span
                style={{
                  borderRadius: "var(--vw-radius-full)",
                  padding: "2px 8px",
                  fontSize: "11px",
                  background: isActive ? "rgba(255,255,255,0.15)" : "var(--vw-color-gray-100)",
                  color: isActive ? "#fff" : "var(--vw-color-gray-500)",
                }}
              >
                {rowCounts[e.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3" style={{ borderTop: "1px solid var(--vw-color-slate-100)" }}>
        <div className="flex items-center gap-2.5" style={{ borderRadius: "var(--vw-radius-sm)", padding: "8px 12px" }}>
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--vw-color-gray-200)", fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: "var(--vw-color-gray-600)" }}
          >
            {(role ?? "Admin").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{role ?? "Admin"}</div>
            <div style={{ fontSize: "11px", color: "var(--vw-color-emerald-600)" }}>● Live sandbox</div>
          </div>
          <button type="button" onClick={onLogout} title="Sign out" className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
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
    <div className="vw-card-section">
      <div className="flex items-center justify-between">
        <span className="vw-card-icon-md vw-chip vw-chip--neutral">
          <Icon className="size-4" />
        </span>
        {stat.delta && (
          <span style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: STAT_TONE_TOKENS[stat.tone] }}>{stat.delta}</span>
        )}
      </div>
      <div className="vw-card-metric-lg mt-3">{stat.value}</div>
      <div className="vw-card-metric-label">{stat.label}</div>
    </div>
  );
}

function DashboardView({ config, appName, role }: { config: CrudAppConfig; appName: string; role: string | null }) {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="vw-page-title">Dashboard</h1>
          <p className="vw-page-description">Signed in as {role ?? "Admin"} · Live sandbox preview</p>
        </div>
        <span className="vw-chip vw-chip--success is-strong">● Live</span>
      </div>

      <div className="vw-grid vw-grid-cols-4 vw-gap-lg">
        {config.dashboardStats.map((s, i) => (
          <StatCard key={i} stat={s} />
        ))}
      </div>

      <div className="mt-6 vw-grid vw-grid-cols-2 vw-gap-lg">
        {config.dashboardCharts.map((c, i) => (
          <div key={i} className="vw-card-section">
            <h3 className="vw-card-title-sm mb-4">{c.title}</h3>
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
          <h1 className="vw-page-title">{entity.labelPlural}</h1>
          <p className="vw-page-description">{rows.length} total records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="nst-input-shell w-64">
            <i className="nst-input-icon">
              <Search className="size-4" />
            </i>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${entity.labelPlural.toLowerCase()}`}
            />
          </div>
          <button type="button" onClick={onCreate} className="nst-btn nst-btn--filled flex items-center gap-2">
            <Plus className="size-4" />
            New {entity.label}
          </button>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="nst-table w-full">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.key === entity.primaryKey ? "nst-table-td--primary" : undefined}>
                      {c.key === entity.primaryKey ? (
                        String(row[c.key])
                      ) : c.isStatus ? (
                        <StatusPill entity={entity} fieldKey={c.key} value={row[c.key]} />
                      ) : (
                        formatCell(entity, c.key, row[c.key])
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => onEdit(row)} title="Edit" className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        title="Delete"
                        className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm"
                        style={{ color: "var(--vw-color-red-500)" }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "40px 20px", color: "var(--vw-color-gray-400)" }}>
                    No {entity.labelPlural.toLowerCase()} match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}
        >
          <span>
            Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}-{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="nst-btn nst-btn--icon nst-btn--sm disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2" style={{ color: "var(--vw-color-gray-600)" }}>
              Page {pageSafe} of {totalPages}
            </span>
            <button
              type="button"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="nst-btn nst-btn--icon nst-btn--sm disabled:opacity-40"
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
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--vw-color-gray-50)" }}>
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
        <div
          className="fixed bottom-6 right-6 z-[70] flex items-center gap-2.5"
          style={{
            borderRadius: "var(--vw-radius-md)",
            background: "var(--vw-color-gray-900)",
            padding: "12px 16px",
            fontSize: "var(--vw-font-label-md)",
            fontWeight: 500,
            color: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <CircleCheck className="size-4" style={{ color: "var(--vw-color-emerald-400)" }} />
          {toast}
        </div>
      )}
    </div>
  );
}
