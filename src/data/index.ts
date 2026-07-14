import type { AppData, DocumentGalleryData } from "./types";
import { catalog, TOTAL_APPS } from "./catalog";
import { productLifecycle } from "./productLifecycle";
import { ran } from "./ran";
import { telecomRollout } from "./telecomRollout";
import { talentAssistant } from "./talentAssistant";
import { devSecOps } from "./devsecops";
import { managedServiceOps } from "./managedServiceOps";
import { finOps } from "./finops";
import { constructOs } from "./constructOs";
import { oilGas } from "./oilGas";
import { ecommerceBackendApp } from "./ecommerceBackendApp";
import { generateGenericAppData } from "./generic";
import { generateDocGalleryAppData } from "./genericDocGallery";
import { billingRatingEngineDocs } from "./docGalleries/billingRatingEngine";
import { ossInventoryServiceDocs } from "./docGalleries/ossInventoryService";
import { terraformModuleLibraryDocs } from "./docGalleries/terraformModuleLibrary";
import { internalCliToolkitDocs } from "./docGalleries/internalCliToolkit";
import { facilitiesSchedulerDocs } from "./docGalleries/facilitiesScheduler";
import { vendorContractTrackerDocs } from "./docGalleries/vendorContractTracker";

export { catalog, TOTAL_APPS };
export type { AppData };

const flagship: Record<string, AppData> = {
  "product-lifecycle-management": productLifecycle,
  ran,
  "telecom-rollout": telecomRollout,
  "talent-assistant": talentAssistant,
  devsecops: devSecOps,
  "managed-service-ops": managedServiceOps,
  finops: finOps,
  "construct-os": constructOs,
  "oil-gas": oilGas,
  "ecommerce-backend-app": ecommerceBackendApp,
};

// Top-2-per-platform /*sm apps get bespoke, enterprise-grade documentation instead of the generic
// templated version — grounded in each app's real CRUD entity model for internal consistency.
const bespokeDocGalleries: Record<string, DocumentGalleryData> = {
  "billing-rating-engine": billingRatingEngineDocs,
  "oss-inventory-service": ossInventoryServiceDocs,
  "terraform-module-library": terraformModuleLibraryDocs,
  "internal-cli-toolkit": internalCliToolkitDocs,
  "facilities-scheduler": facilitiesSchedulerDocs,
  "vendor-contract-tracker": vendorContractTrackerDocs,
};

export function getAppData(id: string): AppData | undefined {
  if (flagship[id]) return flagship[id];
  const card = catalog.find((c) => c.id === id);
  if (!card) return undefined;
  // Apps that only ever appear on a /*m (Git-import) platform must show the document-gallery Think stage.
  const isDocGalleryOnly = !!card.platforms?.length && card.platforms.every((p) => p.endsWith("m"));
  if (!isDocGalleryOnly) return generateGenericAppData(card);

  const data = generateDocGalleryAppData(card);
  const bespoke = bespokeDocGalleries[id];
  if (!bespoke) return data;

  return {
    ...data,
    documentGallery: bespoke,
    chat: [
      { role: "user", text: `Import ${bespoke.repoUrl} and generate full documentation.` },
      {
        role: "ai",
        text: `Cloning the repository now — I'll parse the codebase, build the module dependency graph, and extract the architecture before generating docs.`,
      },
      { role: "ai", text: card.description.replace(/\*\*/g, "") },
      {
        role: "ai",
        text: `Generated 14 documents — High-Level Design, Low-Level Design, Business Requirements, Product Requirements, Feature Specification, API Reference, Test Plan, Test Cases, Data Flow, Traceability Matrix, Coverage, Generation Summary, Provenance, and a Tutorial.`,
      },
    ],
  };
}

export function getCard(id: string) {
  return catalog.find((c) => c.id === id);
}
