import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AppData, ApiEndpoint } from "../../data/types";
import { MethodBadge } from "../ui/Config";
import { cn } from "../../lib/utils";

function statusTone(status: number) {
  if (status < 300) return "bg-emerald-50 text-emerald-600";
  if (status < 400) return "bg-blue-50 text-blue-600";
  if (status < 500) return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
}

function EndpointRow({ endpoint }: { endpoint: ApiEndpoint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <MethodBadge method={endpoint.method} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-xs font-medium text-foreground">{endpoint.path}</span>
          <span className="block truncate text-xs text-muted-foreground">{endpoint.summary}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-border bg-muted/20 px-4 py-4">
          <p className="text-sm text-foreground">{endpoint.description}</p>

          {endpoint.parameters.length > 0 && (
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Parameters</div>
              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">In</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Required</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.parameters.map((p, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium text-foreground">{p.name}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{p.location}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{p.type}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs">
                          {p.required ? <span className="font-medium text-red-500">required</span> : <span className="text-muted-foreground">optional</span>}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Responses</div>
            <div className="space-y-1.5">
              {endpoint.responses.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2">
                  <span className={cn("shrink-0 rounded px-2 py-0.5 font-mono text-xs font-bold", statusTone(r.status))}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ApiExplorer({ data }: { data: AppData }) {
  const { apiBaseUrl, apiVersion, endpoints } = data.createData;
  const tags = Array.from(new Set(endpoints.map((e) => e.tag)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <div>
          <div className="font-mono text-xs text-muted-foreground">Base URL: {apiBaseUrl}</div>
          <div className="mt-1 text-xs text-muted-foreground">OpenAPI 3.0 · REST · JSON</div>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">v{apiVersion}</span>
      </div>

      {tags.map((tag) => (
        <div key={tag}>
          <h3 className="mb-2 text-sm font-bold text-foreground">{tag}</h3>
          <div className="space-y-2">
            {endpoints.filter((e) => e.tag === tag).map((e, i) => (
              <EndpointRow key={i} endpoint={e} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
