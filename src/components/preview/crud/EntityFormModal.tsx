import { useState } from "react";
import { X } from "lucide-react";
import type { CrudEntityConfig, CrudRow } from "../../../data/crudTypes";

function isEmpty(v: string | number | undefined) {
  return v === undefined || v === "" || (typeof v === "number" && Number.isNaN(v));
}

export function EntityFormModal({
  entity,
  initial,
  onCancel,
  onSave,
}: {
  entity: CrudEntityConfig;
  initial: CrudRow | null;
  onCancel: () => void;
  onSave: (values: Record<string, string | number>) => void;
}) {
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const base: Record<string, string | number> = {};
    for (const f of entity.fields) {
      const existing = initial?.[f.key];
      if (existing !== undefined) {
        base[f.key] = existing;
      } else if (f.type === "select" && f.options?.length) {
        base[f.key] = "";
      } else if (f.type === "number" || f.type === "currency") {
        base[f.key] = "";
      } else {
        base[f.key] = "";
      }
    }
    return base;
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const isEdit = Boolean(initial);

  function setField(key: string, v: string | number) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  }

  function handleSave() {
    const nextErrors: Record<string, boolean> = {};
    for (const f of entity.fields) {
      if (f.required && isEmpty(values[f.key])) {
        nextErrors[f.key] = true;
      }
    }
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    const normalized: Record<string, string | number> = { ...values };
    for (const f of entity.fields) {
      if ((f.type === "number" || f.type === "currency") && normalized[f.key] !== "") {
        normalized[f.key] = Number(normalized[f.key]);
      }
    }
    onSave(normalized);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onCancel}>
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-xl overflow-y-auto"
        style={{ borderRadius: "var(--vw-radius-lg)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--vw-color-slate-200)" }}>
          <h2 className="vw-card-title-lg">{isEdit ? `Edit ${entity.label}` : `New ${entity.label}`}</h2>
          <button type="button" onClick={onCancel} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          {entity.fields.map((f) => {
            const hasError = errors[f.key];
            const wide = f.type === "textarea";
            return (
              <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
                <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
                  {f.label}
                  {f.required && <span style={{ color: "var(--vw-color-red-500)" }}> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <div className={`nst-textarea-wrap${hasError ? " nst-textarea--error" : ""}`}>
                    <textarea
                      value={values[f.key] as string}
                      onChange={(e) => setField(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                      className="nst-textarea"
                    />
                  </div>
                ) : f.type === "select" ? (
                  <select
                    value={values[f.key] as string}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className={`nst-input${hasError ? " nst-input--error" : ""}`}
                  >
                    <option value="" disabled>
                      Select {f.label.toLowerCase()}
                    </option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={f.type === "number" || f.type === "currency" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : "text"}
                      value={values[f.key] as string | number}
                      onChange={(e) => setField(f.key, f.type === "number" || f.type === "currency" ? e.target.valueAsNumber || (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
                      placeholder={f.placeholder}
                      step={f.type === "currency" ? "0.01" : undefined}
                      className={`nst-input${f.suffix ? " pr-10" : ""}${hasError ? " nst-input--error" : ""}`}
                    />
                    {f.suffix && (
                      <span
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}
                      >
                        {f.suffix}
                      </span>
                    )}
                  </div>
                )}
                {hasError && <p className="nst-input-hint nst-input-hint--error mt-1">{f.label} is required.</p>}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--vw-color-slate-200)" }}>
          <button type="button" onClick={onCancel} className="nst-btn">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="nst-btn nst-btn--filled">
            {isEdit ? "Save Changes" : `Create ${entity.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
