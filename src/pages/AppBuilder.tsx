import { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { getAppData } from "../data";
import { ChatPanel, type Stage } from "../components/builder/ChatPanel";
import { StageStepper } from "../components/builder/StageStepper";
import { Tabs } from "../components/ui/Tabs";
import { OverviewTab, ArchitectureTab, UseCasesTab, EntitiesTab, PersonaTab } from "../components/builder/ThinkStage";
import { CreateStage } from "../components/builder/CreateStage";
import { OperateStage } from "../components/builder/OperateStage";
import { DocumentGallery } from "../components/builder/DocumentGallery";

const THINK_TABS = [
  { key: "overview", label: "Overview" },
  { key: "architecture", label: "Architecture" },
  { key: "use-cases", label: "Use Cases" },
  { key: "entities", label: "Entities" },
  { key: "persona", label: "Persona" },
];

// Product Lifecycle Management is shared across nsi/osi/esi, but each platform's real deployment
// lives at a different URL — resolve which one to open based on which catalog route linked here.
const PLC_PREVIEW_URLS: Record<string, string> = {
  nsi: "https://apps.visionwaves.com/netsingularity/pb-router/router/product-life-cycle?data=eyJkYXRhIjoiOTg3NjU0dXktMyJ9",
  osi: "https://apps.visionwaves.com/opssingularity/pb-router/router/product-life-cycle?data=eyJkYXRhIjoiOTg3NjU0dXktMyJ9",
  esi: "https://apps.visionwaves.com/enterprisesingularitysingularity/pb-router/router/product-life-cycle?data=eyJkYXRhIjoiOTg3NjU0dXktMyJ9",
};

export default function AppBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from ?? "/";
  const rawData = useMemo(() => (id ? getAppData(id) : undefined), [id]);
  const data = useMemo(() => {
    if (!rawData || rawData.id !== "product-lifecycle-management") return rawData;
    const platform = backTo.toLowerCase().replace(/\//g, "");
    const url = PLC_PREVIEW_URLS[platform];
    return url ? { ...rawData, externalPreviewUrl: url } : rawData;
  }, [rawData, backTo]);
  const [stage, setStage] = useState<Stage>("think");
  const [tab, setTab] = useState("overview");

  if (!data) {
    return (
      <div data-theme="black" className="builder-theme flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p style={{ fontSize: "var(--vw-font-description)", color: "var(--vw-color-gray-500)" }}>Application not found.</p>
        <button onClick={() => navigate(backTo)} className="nst-btn nst-btn--filled">
          Back to catalog
        </button>
      </div>
    );
  }

  return (
    <div data-theme="black" className="builder-theme flex h-screen flex-col bg-background text-foreground">
      <header
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-8 py-4"
        style={{ borderBottom: "1px solid var(--vw-color-slate-200)", background: "var(--vw-color-white)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-4 justify-self-start">
          <button
            onClick={() => navigate(backTo)}
            title="Back to catalog"
            className="flex size-10 items-center justify-center transition-transform hover:scale-105"
            style={{
              borderRadius: "var(--vw-radius-md)",
              background: "var(--color-primary, var(--vw-color-accent-500))",
              boxShadow: "0 4px 12px -2px rgba(0,0,0,0.2)",
            }}
          >
            <ArrowLeft className="size-5" style={{ color: "#fff" }} />
          </button>
          <div>
            <div className="vw-card-title-lg">{data.title}</div>
            <div style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>Powered by CodeSingularity</div>
          </div>
        </div>

        <div className="justify-self-center">
          <StageStepper stage={stage} onStageChange={setStage} />
        </div>

        <div className="justify-self-end">
          <button
            type="button"
            onClick={() => window.open(data.externalPreviewUrl ?? `/preview/${data.id}`, "_blank", "noopener,noreferrer")}
            title="Open the live application preview"
            className="nst-btn nst-btn--filled flex items-center gap-2"
          >
            <Play className="size-4" />
            Preview
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <ChatPanel chat={data.chat} />

        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          {stage === "think" && data.documentGallery && (
            <div className="flex-1 overflow-y-auto p-8">
              <DocumentGallery data={data} />
            </div>
          )}

          {stage === "think" && !data.documentGallery && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <Tabs tabs={THINK_TABS} active={tab} onChange={setTab} />
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-6">
                  {tab === "overview" && <OverviewTab data={data} />}
                  {tab === "architecture" && <ArchitectureTab data={data} />}
                  {tab === "use-cases" && <UseCasesTab data={data} />}
                  {tab === "entities" && <EntitiesTab data={data} />}
                  {tab === "persona" && <PersonaTab data={data} />}
                </div>
              </div>
            </div>
          )}

          {stage === "create" && <CreateStage data={data} />}
          {stage === "operate" && <OperateStage data={data} />}
        </div>
      </div>
    </div>
  );
}
