import { useState } from "react";
import { Sparkles, FileText, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChatMessage } from "../../data/types";

export type Stage = "think" | "create" | "operate";

export function ChatPanel({ chat }: { chat: ChatMessage[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const messages = chat;

  if (collapsed) {
    return (
      <div className="relative flex w-10 flex-col items-center border-r border-border bg-card/30 py-4">
        <button
          onClick={() => setCollapsed(false)}
          title="Expand chat"
          className="rounded-lg border border-border bg-card p-2 shadow-md transition-colors hover:bg-secondary"
        >
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex w-[400px] shrink-0 flex-col border-r border-border bg-card/30">
      <button
        onClick={() => setCollapsed(true)}
        title="Collapse chat"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-full rounded-r-lg border border-l-0 border-border bg-card p-2 shadow-md transition-colors hover:bg-secondary"
      >
        <ChevronLeft className="size-4 text-muted-foreground" />
      </button>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end gap-3">
              <div className="max-w-[280px] rounded-xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                {m.text}
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="size-4 text-accent" />
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="max-w-[280px] rounded-xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
                {m.text}
              </div>
            </div>
          )
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/60 px-3 py-2.5">
          <Lock className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm text-muted-foreground">Chat is locked</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3 shrink-0" />
          This application has already been built — requirements gathering is complete.
        </div>
      </div>
    </div>
  );
}
