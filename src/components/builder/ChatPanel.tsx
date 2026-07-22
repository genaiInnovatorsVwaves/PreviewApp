import { useState } from "react";
import { Sparkles, FileText, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChatMessage } from "../../data/types";

export type Stage = "think" | "create" | "operate";

export function ChatPanel({ chat }: { chat: ChatMessage[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const messages = chat;

  if (collapsed) {
    return (
      <div className="relative flex w-10 flex-col items-center py-4" style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)" }}>
        <button onClick={() => setCollapsed(false)} title="Expand chat" className="nst-btn nst-btn--icon nst-btn--sm">
          <ChevronRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex w-[400px] shrink-0 flex-col" style={{ borderRight: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-50)" }}>
      <button
        onClick={() => setCollapsed(true)}
        title="Collapse chat"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-full"
        style={{
          borderRadius: "0 var(--vw-radius-sm) var(--vw-radius-sm) 0",
          border: "1px solid var(--vw-color-slate-200)",
          borderLeft: "none",
          background: "var(--vw-color-white)",
          padding: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <ChevronLeft className="size-4" style={{ color: "var(--vw-color-gray-500)" }} />
      </button>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end gap-3">
              <div
                className="max-w-[280px] leading-relaxed"
                style={{
                  borderRadius: "var(--vw-radius-md)",
                  padding: "10px 16px",
                  fontSize: "var(--vw-font-description)",
                  background: "var(--color-primary, var(--vw-color-accent-500))",
                  color: "#fff",
                }}
              >
                {m.text}
              </div>
              <div
                className="flex size-8 shrink-0 items-center justify-center"
                style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--vw-color-accent-100)" }}
              >
                <FileText className="size-4" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start gap-3">
              <div
                className="flex size-8 shrink-0 items-center justify-center"
                style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--vw-color-accent-100)" }}
              >
                <Sparkles className="size-4" style={{ color: "var(--color-primary, var(--vw-color-accent-500))" }} />
              </div>
              <div
                className="max-w-[280px] leading-relaxed"
                style={{
                  borderRadius: "var(--vw-radius-md)",
                  padding: "10px 16px",
                  fontSize: "var(--vw-font-description)",
                  background: "var(--vw-color-gray-100)",
                  color: "var(--vw-color-gray-800)",
                }}
              >
                {m.text}
              </div>
            </div>
          )
        )}
      </div>

      <div className="p-4" style={{ borderTop: "1px solid var(--vw-color-slate-200)" }}>
        <div
          className="flex items-center gap-2.5"
          style={{ borderRadius: "var(--vw-radius-sm)", border: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-gray-100)", padding: "10px 12px" }}
        >
          <Lock className="size-4 shrink-0" style={{ color: "var(--vw-color-gray-500)" }} />
          <span className="flex-1 truncate" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
            Chat is locked
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
          <Lock className="size-3 shrink-0" />
          This application has already been built — requirements gathering is complete.
        </div>
      </div>
    </div>
  );
}
