import { useRef, useState } from "react";
import { Grid2x2Plus, X, Sparkles, CircleHelp, FileArchive } from "lucide-react";
import { cn } from "../../lib/utils";

const NAME_MAX = 35;
const DISPLAY_NAME_MAX = 35;
const DESCRIPTION_MAX = 500;

export function CreateAppDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const canCreate = name.trim() !== "" && displayName.trim() !== "" && description.trim() !== "" && fileName !== "";

  function reset() {
    setName("");
    setDisplayName("");
    setDescription("");
    setFileName("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && file.name.toLowerCase().endsWith(".zip")) {
      setFileName(file.name);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={handleClose}>
      <div
        className="no-scrollbar max-h-[90vh] w-full max-w-xl overflow-y-auto"
        style={{ borderRadius: "var(--vw-radius-xl)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vw-flex vw-items-center vw-justify-between" style={{ padding: "24px 24px 0" }}>
          <div className="vw-flex vw-items-center vw-gap-sm">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--vw-color-gray-900)" }}
            >
              <Grid2x2Plus className="size-5" style={{ color: "var(--vw-color-white)" }} />
            </div>
            <h2 className="vw-card-title-lg">Application Builder Agent</h2>
          </div>
          <button type="button" onClick={handleClose} className="nst-btn nst-btn--ghost nst-btn--icon nst-btn--sm">
            <X className="size-4" />
          </button>
        </div>

        <div style={{ padding: "20px 24px 0" }}>
          <div
            className="vw-card-section vw-card--info vw-flex vw-items-center vw-gap-sm"
            style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-sky-700)" }}
          >
            <Sparkles className="size-4 shrink-0" />
            Describe your application &amp; we&apos;ll help you build it with AI
          </div>
        </div>

        <div className="vw-flex vw-flex-col vw-gap-xl" style={{ padding: "20px 24px 24px" }}>
          <div>
            <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
              Name <span style={{ color: "var(--vw-color-red-500)" }}>*</span>
            </label>
            <div className="nst-input-shell">
              <input
                type="text"
                value={name}
                maxLength={NAME_MAX}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name of application"
              />
              <i className="nst-input-icon">
                <CircleHelp className="size-4" />
              </i>
            </div>
            <div
              className="vw-flex vw-justify-end"
              style={{ marginTop: "4px", fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}
            >
              {name.length} / {NAME_MAX}
            </div>
          </div>

          <div>
            <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
              Display name <span style={{ color: "var(--vw-color-red-500)" }}>*</span>
            </label>
            <input
              type="text"
              value={displayName}
              maxLength={DISPLAY_NAME_MAX}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name of the application"
              className="nst-input"
            />
            <div
              className="vw-flex vw-justify-end"
              style={{ marginTop: "4px", fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}
            >
              {displayName.length} / {DISPLAY_NAME_MAX}
            </div>
          </div>

          <div>
            <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
              Description <span style={{ color: "var(--vw-color-red-500)" }}>*</span>
            </label>
            <div className="nst-textarea-wrap">
              <textarea
                value={description}
                maxLength={DESCRIPTION_MAX}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the description of application"
                rows={4}
                className="nst-textarea"
                style={{ resize: "none" }}
              />
              <div className="nst-textarea-footer">
                <span className="nst-textarea-counter">
                  {description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="nst-input-label" style={{ display: "block", marginBottom: "6px" }}>
              Upload documents <span style={{ color: "var(--vw-color-red-500)" }}>*</span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              className="vw-flex vw-flex-col vw-items-center vw-justify-center vw-gap-sm text-center"
              style={{
                width: "100%",
                padding: "20px 32px",
                borderRadius: "var(--vw-radius-sm)",
                border: `1px solid ${dragOver ? "var(--vw-color-accent-500)" : "var(--vw-color-gray-200)"}`,
                background: dragOver ? "var(--vw-color-accent-50)" : "var(--vw-color-white)",
                transition: "border-color 150ms ease, background 150ms ease",
              }}
            >
              <span
                className="vw-flex vw-items-center vw-justify-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--vw-radius-md)",
                  border: "1px solid var(--vw-color-gray-200)",
                  color: dragOver ? "var(--vw-color-accent-500)" : "var(--vw-color-gray-400)",
                }}
              >
                <FileArchive className="size-5" />
              </span>
              {fileName ? (
                <span style={{ fontSize: "var(--vw-font-label-md)", fontWeight: 500, color: "var(--vw-color-gray-700)" }}>{fileName}</span>
              ) : (
                <span style={{ fontSize: "var(--vw-font-label-md)", color: "var(--vw-color-gray-500)" }}>
                  drag and drop or{" "}
                  <span style={{ fontWeight: 500, color: "var(--vw-color-gray-800)" }}>Browse file</span>
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div style={{ marginTop: "4px", fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-400)" }}>.zip</div>
          </div>
        </div>

        <div
          className="vw-flex vw-items-center vw-justify-between"
          style={{ padding: "16px 24px", borderTop: "1px solid var(--vw-color-gray-100)" }}
        >
          <button type="button" onClick={handleClose} className="nst-btn">
            Back
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={handleClose}
            className={cn("nst-btn", canCreate ? "nst-btn--filled" : "is-disabled")}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
