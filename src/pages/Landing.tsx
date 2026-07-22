import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Filter, User, Clock } from "lucide-react";
import { catalog, PLATFORM_ORDER } from "../data/catalog";
import type { PlatformKey } from "../data/types";
import { timeAgo, authorFullName, cn } from "../lib/utils";
import { getCardVisual } from "../lib/cardVisuals";
import { CreateAppDialog } from "../components/landing/CreateAppDialog";
import { GitImportDialog } from "../components/landing/GitImportDialog";
import { FilterPopover, EMPTY_FILTERS, type CatalogFilters } from "../components/landing/FilterPopover";

export default function Landing({ platform, createMode = "agent" }: { platform?: PlatformKey; createMode?: "agent" | "git" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const scoped = useMemo(() => {
    if (!platform) return catalog;
    const byId = new Map(catalog.map((c) => [c.id, c]));
    return PLATFORM_ORDER[platform].map((id) => byId.get(id)).filter((c): c is (typeof catalog)[number] => Boolean(c));
  }, [platform]);

  const filtered = useMemo(() => {
    const name = filters.name.trim().toLowerCase();
    if (!name) return scoped;
    return scoped.filter((c) => c.title.toLowerCase().includes(name));
  }, [scoped, filters]);

  const activeFilterCount = filters.name.trim() ? 1 : 0;

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="shrink-0 border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            title="New application"
            onClick={() => setCreateOpen(true)}
            className="nst-icon-btn shrink-0"
          >
            <Plus className="size-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              title="Filters"
              onClick={() => setFilterOpen((o) => !o)}
              className={cn("nst-icon-btn relative shrink-0", activeFilterCount > 0 && "is-active")}
            >
              <Filter className="size-4" />
              {activeFilterCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center text-[10px] font-medium text-white"
                  style={{ background: "var(--vw-color-accent-500)", borderRadius: "var(--vw-radius-full)" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            <FilterPopover open={filterOpen} onClose={() => setFilterOpen(false)} value={filters} onApply={setFilters} />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-5">
        <div className="vw-grid vw-grid-cols-auto-320 vw-gap-xl">
          {filtered.map((card) => {
            const { Icon } = getCardVisual(card.title);
            return (
            <button
              key={card.id}
              onClick={() => navigate(`/app/${card.id}`, { state: { from: location.pathname } })}
              className="vw-card-section vw-card--clickable vw-flex vw-flex-col h-full text-left"
            >
              <div
                className="vw-flex vw-items-center vw-gap-sm"
                style={{ minHeight: "calc(var(--vw-font-heading-md) * var(--vw-line-heading-md) * 2)" }}
              >
                <div className="vw-card-icon-lg vw-chip vw-chip--neutral shrink-0">
                  <Icon className="size-6" strokeWidth={2.25} />
                </div>
                <h3 className="vw-card-title line-clamp-2">{card.title}</h3>
              </div>

              <p
                className="vw-card-description line-clamp-3"
                style={{
                  marginTop: "var(--vw-space-sm)",
                  minHeight: "calc(var(--vw-font-description) * var(--vw-line-description) * 3)",
                }}
              >
                {card.description.replace(/\*\*/g, "")}
              </p>

              <div
                className="vw-card-footer-divider vw-flex vw-items-center vw-justify-between"
                style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)", marginTop: "var(--vw-space-lg)" }}
              >
                <span className="vw-flex vw-items-center vw-gap-xs" style={{ minWidth: 0, flex: "1 1 auto" }}>
                  <User className="size-3.5 shrink-0" />
                  <span className="truncate">{authorFullName(card.author)}</span>
                </span>
                <span className="vw-flex vw-items-center vw-gap-xs shrink-0">
                  <Clock className="size-3.5" />
                  {timeAgo(card.minutesAgo)}
                </span>
              </div>
            </button>
            );
          })}
        </div>
      </main>

      {createMode === "git" ? (
        <GitImportDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      ) : (
        <CreateAppDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
