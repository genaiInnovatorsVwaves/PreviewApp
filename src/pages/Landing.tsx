import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Filter, Grid2x2, User, Clock } from "lucide-react";
import { catalog, PLATFORM_ORDER } from "../data/catalog";
import type { PlatformKey } from "../data/types";
import { timeAgo, authorFullName, cn } from "../lib/utils";
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
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              title="Filters"
              onClick={() => setFilterOpen((o) => !o)}
              className={cn(
                "relative flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                activeFilterCount > 0
                  ? "border-primary/40 bg-secondary text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Filter className="size-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <FilterPopover open={filterOpen} onClose={() => setFilterOpen(false)} value={filters} onApply={setFilters} />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(`/app/${card.id}`, { state: { from: location.pathname } })}
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-2px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),0_12px_28px_-4px_rgba(15,23,42,0.14)]"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-foreground/90">
                <Grid2x2 className="size-4 text-background" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {card.description.replace(/\*\*/g, "")}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {authorFullName(card.author)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {timeAgo(card.minutesAgo)}
                </span>
              </div>
            </button>
          ))}
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
