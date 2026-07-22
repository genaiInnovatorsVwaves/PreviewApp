import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-4xl overflow-y-auto"
        style={{
          borderRadius: "var(--vw-radius-lg)",
          background: "var(--vw-color-white)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="vw-card-title-lg">{title}</h2>}
            {subtitle && (
              <p className="mt-0.5" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button onClick={onClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
