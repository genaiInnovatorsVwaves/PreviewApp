import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, Grid2x2, User, Clock } from "lucide-react";
import { catalog, TOTAL_APPS, PLATFORM_ORDER, PLATFORM_TOTAL } from "../data/catalog";
import type { PlatformKey } from "../data/types";
import { timeAgo } from "../lib/utils";
import { CreateAppDialog } from "../components/landing/CreateAppDialog";
import { GitImportDialog } from "../components/landing/GitImportDialog";

export default function Landing({ platform, createMode = "agent" }: { platform?: PlatformKey; createMode?: "agent" | "git" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const scoped = useMemo(() => {
    if (!platform) return catalog;
    const byId = new Map(catalog.map((c) => [c.id, c]));
    return PLATFORM_ORDER[platform].map((id) => byId.get(id)).filter((c): c is (typeof catalog)[number] => Boolean(c));
  }, [platform]);

  const total = platform ? PLATFORM_TOTAL[platform] : TOTAL_APPS;

  const filtered = useMemo(() => {
    if (!query.trim()) return scoped;
    const q = query.toLowerCase();
    return scoped.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
    );
  }, [scoped, query]);

  return (
    <div className="flex h-screen flex-col bg-background p-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border-t border-x-2 border-b-2 border-slate-200 bg-muted shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_30px_-6px_rgba(15,23,42,0.1)]">
        <div className="shrink-0 border-b border-border bg-card px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
              <span className="font-medium text-foreground">{total.toLocaleString()}</span>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                title="New application"
                onClick={() => setCreateOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-8 py-6">
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
                    {card.author}
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
      </div>

      {createMode === "git" ? (
        <GitImportDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      ) : (
        <CreateAppDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
