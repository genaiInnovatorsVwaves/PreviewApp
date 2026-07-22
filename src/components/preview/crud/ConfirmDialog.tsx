import { TriangleAlert } from "lucide-react";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6" onClick={onCancel}>
      <div
        className="w-full max-w-sm"
        style={{ borderRadius: "var(--vw-radius-lg)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex size-11 items-center justify-center rounded-full"
          style={{ background: "var(--vw-color-red-50)", color: "var(--vw-color-red-500)" }}
        >
          <TriangleAlert className="size-5" />
        </div>
        <h2 className="vw-card-title mt-4">{title}</h2>
        <p className="mt-1.5 leading-relaxed" style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>
          {message}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="nst-btn">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="nst-btn nst-btn--danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
