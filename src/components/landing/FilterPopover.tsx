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
      <div
        className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] overflow-hidden"
        style={{
          borderRadius: "var(--vw-radius-lg)",
          border: "1px solid var(--vw-color-slate-200)",
          background: "var(--vw-color-white)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="vw-flex vw-items-center vw-justify-between"
          style={{ padding: "14px 20px", borderBottom: "1px solid var(--vw-color-slate-200)" }}
        >
          <h2 className="vw-card-title">Filters</h2>
          <button type="button" onClick={onClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
            Name
          </label>
          <input
            autoFocus
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ name: e.target.value })}
            placeholder="Enter application name"
            maxLength={50}
            className="nst-input"
          />
          <div
            className="vw-flex vw-justify-end"
            style={{ marginTop: "4px", fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}
          >
            {draft.name.length} / 50
          </div>
        </div>

        <div
          className="vw-flex vw-items-center vw-justify-end vw-gap-sm"
          style={{ padding: "14px 20px", borderTop: "1px solid var(--vw-color-slate-200)" }}
        >
          <button type="button" onClick={() => setDraft(EMPTY_FILTERS)} className="nst-btn">
            Reset to default
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="nst-btn nst-btn--filled"
          >
            Apply filters
          </button>
        </div>
      </div>
    </>
  );
}
