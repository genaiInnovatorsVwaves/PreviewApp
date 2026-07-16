import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface CatalogFilters {
  name: string;
}

export const EMPTY_FILTERS: CatalogFilters = { name: "" };

export function FilterPopover({
  open,
  onClose,
  value,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: CatalogFilters;
  onApply: (next: CatalogFilters) => void;
}) {
  const [draft, setDraft] = useState<CatalogFilters>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-base font-bold text-foreground">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
          <input
            autoFocus
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ name: e.target.value })}
            placeholder="Enter application name"
            maxLength={50}
            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">{draft.name.length} / 50</div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3.5">
          <button
            type="button"
            onClick={() => setDraft(EMPTY_FILTERS)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Reset to default
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Apply filters
          </button>
        </div>
      </div>
    </>
  );
}
