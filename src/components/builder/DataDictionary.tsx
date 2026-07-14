import { useState } from "react";
import { Database } from "lucide-react";
import type { AppData } from "../../data/types";
import { Accordion } from "../ui/Accordion";
import { cn } from "../../lib/utils";

const typeColor: Record<string, string> = {
  Integer: "text-blue-600",
  String: "text-emerald-600",
  Journal: "text-violet-600",
  Reference: "text-amber-600",
  DateTime: "text-pink-600",
  Boolean: "text-cyan-600",
  Decimal: "text-blue-600",
};

export function DataDictionary({ data }: { data: AppData }) {
  const [q, setQ] = useState("");
  // More fields = a richer, more central entity (core business tables) rather than a thin lookup or junction table — surface those first.
  const tables = [...data.createData.dataModel.tables].sort((a, b) => b.fields.length - a.fields.length);
  const filtered = tables.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
          <span className="font-medium text-foreground">{tables.length}</span>
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tables..."
          className="w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <Accordion
            key={t.name}
            icon={
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Database className="size-4" />
              </span>
            }
            title={t.name}
            subtitle={t.description}
            right={<span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{t.fields.length} Fields</span>}
          >
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Field Name</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Validation</th>
                    <th className="px-4 py-2.5 font-medium">Analytics</th>
                    <th className="px-4 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {t.fields.map((f, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-medium text-foreground">
                        {f.modifier && (
                          <span className={cn("mr-1.5 rounded px-1 py-0.5 text-[10px] font-bold", f.modifier === "PK" ? "bg-amber-50 text-amber-600" : f.modifier === "FK" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600")}>
                            {f.modifier}
                          </span>
                        )}
                        {f.name}
                      </td>
                      <td className={cn("whitespace-nowrap px-4 py-2.5 text-xs font-medium", typeColor[f.type] ?? "text-muted-foreground")}>{f.type}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{f.validation}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs font-medium text-rose-500">{f.analytics}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{f.description}</td>
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
