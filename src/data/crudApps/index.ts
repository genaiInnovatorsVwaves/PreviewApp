import type { CrudAppConfig } from "../crudTypes";
import { billingRatingEngine } from "./billingRatingEngine";
import { ossInventoryService } from "./ossInventoryService";
import { terraformModuleLibrary } from "./terraformModuleLibrary";
import { internalCliToolkit } from "./internalCliToolkit";
import { facilitiesScheduler } from "./facilitiesScheduler";
import { vendorContractTracker } from "./vendorContractTracker";

const registry: Record<string, CrudAppConfig> = {
  "billing-rating-engine": billingRatingEngine,
  "oss-inventory-service": ossInventoryService,
  "terraform-module-library": terraformModuleLibrary,
  "internal-cli-toolkit": internalCliToolkit,
  "facilities-scheduler": facilitiesScheduler,
  "vendor-contract-tracker": vendorContractTracker,
};

export function getCrudApp(id: string): CrudAppConfig | undefined {
  return registry[id];
}
