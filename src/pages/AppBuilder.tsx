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

export default function AppBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from ?? "/";
  const data = useMemo(() => (id ? getAppData(id) : undefined), [id]);
  const [stage, setStage] = useState<Stage>("think");
  const [tab, setTab] = useState("overview");

  if (!data) {
    return (
      <div className="builder-theme flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Application not found.</p>
        <button onClick={() => navigate(backTo)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Back to catalog
        </button>
      </div>
    );
  }

  return (
    <div className="builder-theme flex h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4 justify-self-start">
          <button
            onClick={() => navigate(backTo)}
            title="Back to catalog"
            className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105"
          >
            <ArrowLeft className="size-5 text-primary-foreground" />
          </button>
          <div>
            <div className="text-xl font-bold text-foreground">{data.title}</div>
            <div className="text-xs text-muted-foreground">Powered by CodeSingularity</div>
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
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
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
