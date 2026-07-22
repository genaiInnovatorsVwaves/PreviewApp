import type { ReactNode } from "react";

export interface TabDef {
  key: string;
  label: string;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="max-w-full overflow-x-auto px-6" style={{ borderBottom: "1px solid var(--vw-color-slate-200)" }}>
      <div
        className="inline-flex items-center gap-1"
        style={{ margin: "12px 0", padding: "3px 4px", border: "1px solid var(--vw-color-gray-200)", borderRadius: "var(--vw-radius-sm)" }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className="whitespace-nowrap transition-all"
              style={{
                padding: "6px 12px",
                borderRadius: "var(--vw-radius-xs)",
                fontSize: "var(--vw-font-label-md)",
                fontWeight: 500,
                background: isActive ? "var(--color-primary, var(--vw-color-accent-500))" : "transparent",
                color: isActive ? "#fff" : "var(--vw-color-gray-600)",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-8"><div className="space-y-6">{children}</div></div>;
}
