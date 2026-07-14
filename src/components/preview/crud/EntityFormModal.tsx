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
        className="no-scrollbar max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? `Edit ${entity.label}` : `New ${entity.label}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          {entity.fields.map((f) => {
            const hasError = errors[f.key];
            const wide = f.type === "textarea";
            return (
              <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={values[f.key] as string}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={3}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      hasError ? "border-red-300 focus:border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                    }`}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={values[f.key] as string}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 ${
                      hasError ? "border-red-300 focus:border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                    }`}
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
                      className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                        f.suffix ? "pr-10" : ""
                      } ${hasError ? "border-red-300 focus:border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"}`}
                    />
                    {f.suffix && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{f.suffix}</span>
                    )}
                  </div>
                )}
                {hasError && <p className="mt-1 text-xs text-red-500">{f.label} is required.</p>}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {isEdit ? "Save Changes" : `Create ${entity.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
