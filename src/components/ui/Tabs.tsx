import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

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
    <div className="max-w-full overflow-x-auto border-b border-border bg-card/30 px-6">
      <div className="inline-flex h-auto w-auto items-center justify-center gap-2 rounded-none border-0 bg-transparent p-0 py-3">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "whitespace-nowrap rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-primary/50 bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
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
