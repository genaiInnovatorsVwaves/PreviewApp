import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AppData, ApiEndpoint } from "../../data/types";
import { MethodBadge } from "../ui/Config";
import { cn } from "../../lib/utils";

function statusTone(status: number) {
  if (status < 300) return "vw-chip--success";
  if (status < 400) return "vw-chip--info";
  if (status < 500) return "vw-chip--warning";
  return "vw-chip--error";
}

function EndpointRow({ endpoint }: { endpoint: ApiEndpoint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden" style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <MethodBadge method={endpoint.method} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono" style={{ fontSize: "var(--vw-font-label-sm)", fontWeight: 500, color: "var(--vw-color-gray-800)" }}>{endpoint.path}</span>
          <span className="block truncate" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{endpoint.summary}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} style={{ color: "var(--vw-color-gray-500)" }} />
      </button>
      {open && (
        <div className="space-y-4 px-4 py-4" style={{ borderTop: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)" }}>
          <p style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-800)" }}>{endpoint.description}</p>

          {endpoint.parameters.length > 0 && (
            <div>
              <div className="mb-1.5 uppercase tracking-wide" style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--vw-color-gray-500)" }}>Parameters</div>
              <div className="overflow-x-auto">
                <table className="nst-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>In</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.parameters.map((p, i) => (
                      <tr key={i}>
                        <td className="whitespace-nowrap nst-table-td--primary font-mono">{p.name}</td>
                        <td className="whitespace-nowrap" style={{ color: "var(--vw-color-gray-500)" }}>{p.location}</td>
                        <td className="whitespace-nowrap" style={{ color: "var(--vw-color-gray-500)" }}>{p.type}</td>
                        <td className="whitespace-nowrap">
                          {p.required ? (
                            <span style={{ fontWeight: 500, color: "var(--vw-color-red-500)" }}>required</span>
                          ) : (
                            <span style={{ color: "var(--vw-color-gray-500)" }}>optional</span>
                          )}
                        </td>
                        <td style={{ color: "var(--vw-color-gray-500)" }}>{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="mb-1.5 uppercase tracking-wide" style={{ fontSize: "var(--vw-font-label-xs)", fontWeight: 500, color: "var(--vw-color-gray-500)" }}>Responses</div>
            <div className="space-y-1.5">
              {endpoint.responses.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5"
                  style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)", padding: "8px 12px" }}
                >
                  <span className={cn("vw-chip is-strong shrink-0 font-mono", statusTone(r.status))} style={{ fontSize: "var(--vw-font-label-xs)", padding: "2px 8px" }}>
                    {r.status}
                  </span>
                  <span style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>{r.description}</span>
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
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)", padding: "12px 16px" }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>Base URL: {apiBaseUrl}</div>
          <div className="mt-1" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>OpenAPI 3.0 · REST · JSON</div>
        </div>
        <span className="vw-chip vw-chip--neutral is-strong">v{apiVersion}</span>
      </div>

      {tags.map((tag) => (
        <div key={tag}>
          <h3 className="vw-card-title-sm mb-2">{tag}</h3>
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
