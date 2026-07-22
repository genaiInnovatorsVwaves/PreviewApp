import { useState } from "react";
import { Database } from "lucide-react";
import type { AppData } from "../../data/types";
import { Accordion } from "../ui/Accordion";
import { cn } from "../../lib/utils";

const typeColor: Record<string, string> = {
  Integer: "var(--vw-color-blue-600)",
  String: "var(--vw-color-emerald-600)",
  Journal: "var(--vw-color-purple-600)",
  Reference: "var(--vw-color-amber-600)",
  DateTime: "var(--vw-color-pink-600)",
  Boolean: "var(--vw-color-cyan-600)",
  Decimal: "var(--vw-color-blue-600)",
};

export function DataDictionary({ data }: { data: AppData }) {
  const [q, setQ] = useState("");
  // More fields = a richer, more central entity (core business tables) rather than a thin lookup or junction table — surface those first.
  const tables = [...data.createData.dataModel.tables].sort((a, b) => b.fields.length - a.fields.length);
  const filtered = tables.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
          Showing <span style={{ fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{filtered.length}</span> of{" "}
          <span style={{ fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{tables.length}</span>
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tables..."
          className="nst-input"
          style={{ maxWidth: "20rem" }}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <Accordion
            key={t.name}
            icon={
              <span className="vw-card-icon-md vw-chip vw-chip--info">
                <Database className="size-4" />
              </span>
            }
            title={t.name}
            subtitle={t.description}
            right={<span className="vw-chip vw-chip--neutral is-strong">{t.fields.length} Fields</span>}
          >
            <div className="overflow-x-auto">
              <table className="nst-table">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th>Type</th>
                    <th>Validation</th>
                    <th>Analytics</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {t.fields.map((f, i) => (
                    <tr key={i}>
                      <td className="nst-table-td--primary whitespace-nowrap font-mono">
                        {f.modifier && (
                          <span
                            className={cn("vw-chip is-strong mr-1.5", f.modifier === "PK" ? "vw-chip--warning" : f.modifier === "FK" ? "vw-chip--info" : "vw-chip--purple")}
                            style={{ fontSize: "10px", padding: "1px 5px" }}
                          >
                            {f.modifier}
                          </span>
                        )}
                        {f.name}
                      </td>
                      <td className="whitespace-nowrap" style={{ fontWeight: 500, color: typeColor[f.type] ?? "var(--vw-color-gray-500)" }}>{f.type}</td>
                      <td style={{ color: "var(--vw-color-gray-500)" }}>{f.validation}</td>
                      <td className="whitespace-nowrap" style={{ fontWeight: 500, color: "var(--vw-color-pink-500)" }}>{f.analytics}</td>
                      <td style={{ color: "var(--vw-color-gray-500)" }}>{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
