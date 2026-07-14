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
      <div className="no-scrollbar max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <Grid2x2Plus className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Application Builder Agent</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
            <Sparkles className="size-4 shrink-0" />
            Describe your application &amp; we&apos;ll help you build it with AI
          </div>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={NAME_MAX}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name of application"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-3.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <CircleHelp className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
            </div>
            <div className="mt-1 text-right text-xs text-slate-400">{name.length} / {NAME_MAX}</div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Display name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              maxLength={DISPLAY_NAME_MAX}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name of the application"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <div className="mt-1 text-right text-xs text-slate-400">{displayName.length} / {DISPLAY_NAME_MAX}</div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the description of application"
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <div className="mt-1 text-right text-xs text-slate-400">{description.length} / {DESCRIPTION_MAX}</div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Upload Business Documents (ZIP) <span className="text-red-500">*</span>
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
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
                dragOver ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <FileArchive className="mb-1 size-6 text-slate-300" />
              {fileName ? (
                <span className="text-sm font-medium text-slate-700">{fileName}</span>
              ) : (
                <span className="text-sm text-slate-500">
                  drag and drop or <span className="font-semibold text-slate-800">Browse file</span>
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
            <div className="mt-1 text-xs text-slate-400">.zip</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={handleClose}
            className={cn(
              "rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors",
              canCreate ? "bg-slate-900 text-white hover:bg-slate-800" : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
