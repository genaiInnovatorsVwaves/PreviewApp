import type { CatalogCard, PlatformKey } from "./types";
import { nsiFillers } from "./catalogFillers/nsi";
import { osiFillers } from "./catalogFillers/osi";
import { esiFillers } from "./catalogFillers/esi";
import { nsmFillers } from "./catalogFillers/nsm";
import { osmFillers } from "./catalogFillers/osm";
import { esmFillers } from "./catalogFillers/esm";

const baseCatalog: CatalogCard[] = [
  {
    id: "ran",
    title: "RAN",
    category: "Application development",
    description:
      "Telecom site delivery platform spanning program and project management from construction through maintenance — surveys, permits, work orders, and equipment on one auditable site record.",
    author: "Mohak",
    minutesAgo: 12,
    featured: "structured",
    platforms: ["nsi"],
  },
  {
    id: "product-lifecycle-management",
    title: "Product Lifecycle Management",
    category: "Application development",
    description:
      "A requirements-to-release traceability platform — products, modules, requirements, test coverage, and defects on one auditable data model, with full requirement-to-test-to-defect lineage for every release.",
    author: "Mohak",
    minutesAgo: 15,
    featured: "structured",
    platforms: ["nsi", "osi", "esi"],
  },
  {
    id: "talent-assistant",
    title: "Talent Operations Assistant",
    category: "Application development",
    description:
      "Conversational HR Core assistant that resolves leave, payroll, and onboarding questions instantly and routes only genuine exceptions to your People team.",
    author: "Sudarshan",
    minutesAgo: 19,
    featured: "chat",
    platforms: ["nsi"],
  },
  {
    id: "revenue-intelligence",
    title: "Revenue Intelligence Cockpit",
    category: "Application development",
    description:
      "Gives the CRO and CFO a single, always-current view of pipeline health — deal-risk scoring, forecast-to-close accuracy, and revenue-leakage detection rolled up to board-ready numbers.",
    author: "Aditi",
    minutesAgo: 22,
    platforms: ["nsi"],
  },
  {
    id: "risk-command-center",
    title: "Enterprise Risk & Compliance Command Center",
    category: "Application development",
    description:
      "Real-time risk heatmap across every business unit for the CRO and General Counsel, with automated control testing and regulatory-change tracking that used to take a quarter to compile.",
    author: "Mohak",
    minutesAgo: 24,
    platforms: ["nsi"],
  },
  {
    id: "fpa-copilot",
    title: "FP&A Copilot",
    category: "Application development",
    description:
      "Driver-based forecasting and scenario modeling for the CFO's office — turns a two-week close cycle into same-day what-if analysis and auto-generates the board deck.",
    author: "Hemant",
    minutesAgo: 26,
    platforms: ["nsi"],
  },
  {
    id: "cyber-posture",
    title: "Cyber Risk Posture Dashboard",
    category: "Application development",
    description:
      "Attack-surface mapping and vulnerability prioritization ranked by business impact and dollar exposure, so the CISO can brief the board in the language it actually understands.",
    author: "Bhavesh",
    minutesAgo: 29,
    platforms: ["nsi"],
  },
  {
    id: "esg-suite",
    title: "ESG & Sustainability Reporting Suite",
    category: "Application development",
    description:
      "Automates carbon accounting and CSRD / SEC climate disclosures for the CSO and CFO, with supplier-level ESG scoring built on the same audit-ready data model.",
    author: "Chetan",
    minutesAgo: 33,
    platforms: ["nsi"],
  },
  {
    id: "ma-due-diligence",
    title: "M&A Due Diligence Room",
    category: "Application development",
    description:
      "Secure deal room for the CEO and Corp Dev team — AI-assisted synergy modeling, red-flag detection across target financials, and integration-readiness tracking from LOI to Day 1.",
    author: "Prem",
    minutesAgo: 37,
    platforms: ["nsi"],
  },
  {
    id: "supply-chain-tower",
    title: "Supply Chain Control Tower",
    category: "Application development",
    description:
      "End-to-end shipment visibility and supplier-risk scoring for the COO, with disruption early-warning that turns a three-day fire drill into a same-hour reroute decision.",
    author: "Rohan",
    minutesAgo: 41,
    platforms: ["nsi"],
  },
  {
    id: "customer-360",
    title: "Customer 360 & Churn Intelligence",
    category: "Application development",
    description:
      "Unified customer data platform for the CMO and CRO — churn prediction, expansion-revenue signals, and account health scores that replace six disconnected dashboards with one.",
    author: "aayush",
    minutesAgo: 45,
    platforms: ["nsi"],
  },
  {
    id: "workforce-planning",
    title: "Workforce Planning & Skills Intelligence",
    category: "Application development",
    description:
      "Headcount scenario planning and skills-gap heatmaps for the CHRO, with internal-mobility matching that fills critical roles from inside the company before recruiting outside it.",
    author: "Sudarshan",
    minutesAgo: 49,
    platforms: ["nsi"],
  },
  {
    id: "strategic-portfolio",
    title: "Strategic Portfolio & OKR Management",
    category: "Application development",
    description:
      "Traces every initiative back to strategy for the CEO's staff meeting — OKR rollups, investment prioritization, and a single source of truth for what the company is actually funding.",
    author: "Mohak",
    minutesAgo: 53,
    platforms: ["nsi"],
  },

  // ---- OpsSingularity (OSI) ----
  {
    id: "devsecops",
    title: "DevSecOps",
    category: "Platform engineering",
    description:
      "Delivery pipeline, supply-chain security, and release-quality signals on one Kubernetes-native dashboard — DORA metrics, reachable-vulnerability findings, and AI-recommended fixes at the production gate.",
    author: "Yashraj",
    minutesAgo: 8,
    featured: "structured",
    platforms: ["osi"],
  },
  {
    id: "managed-service-ops",
    title: "ManagedServiceOps",
    category: "Platform engineering",
    description:
      "Live service topology, blast-radius simulation, and revenue-at-risk modeling for every customer estate you manage — standing risk recomputed continuously from replicas, zone spread, traffic, and SLO burn.",
    author: "Yashraj",
    minutesAgo: 10,
    featured: "structured",
    platforms: ["osi"],
  },
  {
    id: "finops",
    title: "FinOps",
    category: "Platform engineering",
    description:
      "Cloud and Kubernetes cost governance with AI-powered savings insights — anomaly detection, idle-resource identification, and budget forecasting that beats peer optimization rates by double digits.",
    author: "Yashraj",
    minutesAgo: 13,
    featured: "structured",
    platforms: ["osi"],
  },
  {
    id: "incident-command",
    title: "Incident Command Center",
    category: "Platform engineering",
    description:
      "Unified on-call and incident response — automated paging, live status pages, and blameless postmortems that turn a 2am page into a documented, actionable timeline.",
    author: "Bhavesh",
    minutesAgo: 17,
    platforms: ["osi"],
  },
  {
    id: "observability-hub",
    title: "Observability Hub",
    category: "Platform engineering",
    description:
      "Metrics, logs, and traces correlated into one query surface — root-cause analysis that used to take four dashboards now takes one trace.",
    author: "Rohan",
    minutesAgo: 20,
    platforms: ["osi"],
  },
  {
    id: "secrets-vault",
    title: "Secrets & Access Vault",
    category: "Platform engineering",
    description:
      "Centralized secrets management and just-in-time access — every credential rotated, every grant time-boxed, every access reviewed automatically.",
    author: "Naman",
    minutesAgo: 23,
    platforms: ["osi"],
  },
  {
    id: "chaos-lab",
    title: "Chaos Engineering Lab",
    category: "Platform engineering",
    description: "Controlled fault-injection experiments against production-like environments — find the failure before your customers do.",
    author: "Hemant",
    minutesAgo: 27,
    platforms: ["osi"],
  },
  {
    id: "registry-guard",
    title: "Container Registry Guard",
    category: "Platform engineering",
    description:
      "Image scanning, provenance verification, and registry governance — nothing ships to production without a signed, scanned, policy-compliant image.",
    author: "Chetan",
    minutesAgo: 30,
    platforms: ["osi"],
  },

  // ---- EnterpriseSingularity (ESI) ----
  {
    id: "construct-os",
    title: "Construct OS",
    category: "Project & program management",
    description:
      "Capital construction program and project management — sites, permits, HSE, and asset integrity on one platform, from groundbreaking through commissioning and ongoing maintenance.",
    author: "Prem",
    minutesAgo: 9,
    featured: "structured",
    platforms: ["esi"],
  },
  {
    id: "oil-gas",
    title: "Oil & Gas",
    category: "Project & program management",
    description:
      "Capital projects and asset lifecycle management for upstream, midstream, and downstream operations — turnarounds, commissioning, installations, and capital builds across rigs, refineries, and pipelines.",
    author: "Aditi",
    minutesAgo: 11,
    featured: "structured",
    platforms: ["esi"],
  },
  {
    id: "telecom-rollout",
    title: "Telecom Rollout",
    category: "Project & program management",
    description:
      "Telecom site delivery platform spanning program and project management from construction through maintenance — surveys, permits, work orders, and equipment on one auditable site record.",
    author: "Mohak",
    minutesAgo: 13,
    featured: "structured",
    platforms: ["esi"],
  },
  {
    id: "portfolio-governance",
    title: "Portfolio Governance Suite",
    category: "Project & program management",
    description:
      "PMO-grade portfolio prioritization and investment governance — stage-gate reviews, capacity planning, and a single source of truth for what's funded and why.",
    author: "Mohak",
    minutesAgo: 17,
    platforms: ["esi"],
  },
  {
    id: "vendor-contract-hub",
    title: "Vendor & Contract Hub",
    category: "Project & program management",
    description:
      "Centralized vendor onboarding, contract lifecycle, and spend tracking — renewal deadlines and compliance obligations that never slip through email again.",
    author: "Prem",
    minutesAgo: 20,
    platforms: ["esi"],
  },
  {
    id: "facilities-ops",
    title: "Facilities Ops Manager",
    category: "Project & program management",
    description: "Workplace and facilities operations — space planning, maintenance requests, and vendor dispatch across every site in the portfolio.",
    author: "Bhavesh",
    minutesAgo: 23,
    platforms: ["esi"],
  },
  {
    id: "grants-tracker",
    title: "Grants & Funding Tracker",
    category: "Project & program management",
    description:
      "End-to-end grant lifecycle management — applications, milestones, compliance reporting, and disbursement tracking for every funded program.",
    author: "Chetan",
    minutesAgo: 26,
    platforms: ["esi"],
  },
  {
    id: "change-enablement",
    title: "Change Enablement Platform",
    category: "Project & program management",
    description:
      "Organizational change management for large transformation programs — stakeholder readiness, training rollout, and adoption tracking in one place.",
    author: "Aditi",
    minutesAgo: 29,
    platforms: ["esi"],
  },

  // ---- Git-import → generated-documentation demo (NSM / OSM / ESM) ----
  {
    // Not tagged with any platform — intentionally hidden from all /*sm listing pages, but still reachable
    // directly via the Git-import dialog's "View Documentation Gallery" demo link (see GitImportDialog.tsx).
    id: "ecommerce-backend-app",
    title: "Ecommerce Backend App",
    category: "Reverse-engineered documentation",
    description:
      "Spring Boot e-commerce backend, reverse-engineered from its Git repository into a full documentation set — HLD, LLD, BRD, PRD, API reference, test plans, and a tutorial, generated automatically.",
    author: "Yashraj",
    minutesAgo: 6,
    featured: "structured",
  },

  // ---- NSM: telecom codebases reverse-engineered into documentation ----
  {
    id: "billing-rating-engine",
    title: "Billing Rating Engine",
    category: "Reverse-engineered documentation",
    description:
      "Legacy telecom billing and rating engine, reverse-engineered from its repository into a full documentation set covering rating rules, invoicing, and settlement logic.",
    author: "Naman",
    minutesAgo: 9,
    platforms: ["nsm"],
  },
  {
    id: "oss-inventory-service",
    title: "OSS Inventory Service",
    category: "Reverse-engineered documentation",
    description:
      "Network inventory and OSS service, documented end-to-end from source — asset topology, provisioning APIs, and reconciliation jobs.",
    author: "Prem",
    minutesAgo: 12,
    platforms: ["nsm"],
  },
  {
    id: "subscriber-provisioning-api",
    title: "Subscriber Provisioning API",
    category: "Reverse-engineered documentation",
    description:
      "Subscriber activation and provisioning API, reverse-engineered into HLD, LLD, and API reference documentation covering SIM lifecycle and plan changes.",
    author: "Sudarshan",
    minutesAgo: 15,
    platforms: ["nsm"],
  },
  {
    id: "network-alarm-correlator",
    title: "Network Alarm Correlator",
    category: "Reverse-engineered documentation",
    description:
      "Real-time network alarm correlation engine, documented from its codebase — event deduplication rules, topology-aware suppression, and escalation logic.",
    author: "Bhavesh",
    minutesAgo: 18,
    platforms: ["nsm"],
  },
  {
    id: "sim-lifecycle-manager",
    title: "SIM Lifecycle Manager",
    category: "Reverse-engineered documentation",
    description:
      "SIM and eSIM lifecycle management service, reverse-engineered into full documentation — activation, swap, and deactivation workflows across carriers.",
    author: "Rohan",
    minutesAgo: 21,
    platforms: ["nsm"],
  },

  // ---- OSM: internal platform-engineering tools reverse-engineered into documentation ----
  {
    id: "terraform-module-library",
    title: "Terraform Module Library",
    category: "Reverse-engineered documentation",
    description:
      "Internal Terraform module library, reverse-engineered into full documentation — module contracts, variable interfaces, and provider compatibility matrices.",
    author: "Yashraj",
    minutesAgo: 9,
    platforms: ["osm"],
  },
  {
    id: "internal-cli-toolkit",
    title: "Internal CLI Toolkit",
    category: "Reverse-engineered documentation",
    description:
      "Internal developer CLI, documented end-to-end from source — command reference, plugin architecture, and configuration precedence rules.",
    author: "Chetan",
    minutesAgo: 12,
    platforms: ["osm"],
  },
  {
    id: "alerting-rules-engine",
    title: "Alerting Rules Engine",
    category: "Reverse-engineered documentation",
    description:
      "Metrics-based alerting rules engine, reverse-engineered into HLD, LLD, and test documentation covering rule evaluation and notification routing.",
    author: "Hemant",
    minutesAgo: 15,
    platforms: ["osm"],
  },
  {
    id: "build-cache-proxy",
    title: "Build Cache Proxy",
    category: "Reverse-engineered documentation",
    description:
      "Distributed build-cache proxy service, documented from its codebase — cache key derivation, eviction policy, and CI integration surface.",
    author: "aayush",
    minutesAgo: 18,
    platforms: ["osm"],
  },
  {
    id: "feature-flag-service",
    title: "Feature Flag Service",
    category: "Reverse-engineered documentation",
    description:
      "Internal feature-flag and experimentation service, reverse-engineered into full documentation — targeting rules, rollout strategy, and SDK contracts.",
    author: "Mohak",
    minutesAgo: 21,
    platforms: ["osm"],
  },

  // ---- ESM: internal enterprise/PM tools reverse-engineered into documentation ----
  {
    id: "facilities-scheduler",
    title: "Facilities Scheduler",
    category: "Reverse-engineered documentation",
    description:
      "Internal room and resource booking service, reverse-engineered into full documentation — scheduling rules, conflict resolution, and calendar integration.",
    author: "Aditi",
    minutesAgo: 9,
    platforms: ["esm"],
  },
  {
    id: "vendor-contract-tracker",
    title: "Vendor Contract Tracker",
    category: "Reverse-engineered documentation",
    description:
      "Legacy vendor contract tracking application, documented end-to-end from source — renewal logic, obligation tracking, and notification rules.",
    author: "Prem",
    minutesAgo: 12,
    platforms: ["esm"],
  },
  {
    id: "change-management-portal",
    title: "Change Management Portal",
    category: "Reverse-engineered documentation",
    description:
      "Internal change-request and approval portal, reverse-engineered into HLD, LLD, and process documentation covering approval routing and audit trails.",
    author: "Bhavesh",
    minutesAgo: 15,
    platforms: ["esm"],
  },
  {
    id: "timesheet-billing-service",
    title: "Timesheet & Billing Service",
    category: "Reverse-engineered documentation",
    description:
      "Project timesheet and client billing service, documented from its codebase — time-entry rules, approval workflows, and invoice generation logic.",
    author: "Rohan",
    minutesAgo: 18,
    platforms: ["esm"],
  },
  {
    id: "doc-approval-workflow-engine",
    title: "Document Approval Workflow Engine",
    category: "Reverse-engineered documentation",
    description:
      "Configurable document approval and e-signature workflow engine, reverse-engineered into full documentation covering routing rules and audit logging.",
    author: "Chetan",
    minutesAgo: 21,
    platforms: ["esm"],
  },
];

export const catalog: CatalogCard[] = [
  ...baseCatalog,
  ...nsiFillers,
  ...osiFillers,
  ...esiFillers,
  ...nsmFillers,
  ...osmFillers,
  ...esmFillers,
];

export const TOTAL_APPS = 1151;

export const PLATFORM_META: Record<PlatformKey, { name: string; tagline: string }> = {
  nsi: { name: "NetSingularity", tagline: "Telecom" },
  osi: { name: "OpsSingularity", tagline: "DevOps" },
  esi: { name: "EnterpriseSingularity", tagline: "Project Management" },
  nsm: { name: "NetSingularity", tagline: "Telecom · Docs from Git" },
  osm: { name: "OpsSingularity", tagline: "DevOps · Docs from Git" },
  esm: { name: "EnterpriseSingularity", tagline: "Project Management · Docs from Git" },
};

/** Displayed catalog total per platform — the marketplace framing (like `TOTAL_APPS`), not the literal count of built entries. */
export const PLATFORM_TOTAL: Record<PlatformKey, number> = {
  nsi: 1151,
  osi: 340,
  esi: 265,
  nsm: 512,
  osm: 298,
  esm: 187,
};

const OSI_TOP = ["devsecops", "managed-service-ops", "finops", "product-lifecycle-management"];
const ESI_TOP = ["telecom-rollout", "construct-os", "oil-gas", "product-lifecycle-management"];

/**
 * Per-platform display order: a curated/finalized prefix, followed by every other catalog entry
 * tagged for that platform (in catalog order). New filler entries just need the right `platforms`
 * tag — they don't require any manual list maintenance here.
 */
function orderFor(platform: PlatformKey, top: string[] = []): string[] {
  const topSet = new Set(top);
  const rest = catalog.filter((c) => c.platforms?.includes(platform) && !topSet.has(c.id)).map((c) => c.id);
  return [...top, ...rest];
}

export const PLATFORM_ORDER: Record<PlatformKey, string[]> = {
  nsi: orderFor("nsi"),
  osi: orderFor("osi", OSI_TOP),
  esi: orderFor("esi", ESI_TOP),
  // /*m routes are Git-import → generated-documentation catalogs: every listed app must have a documentGallery,
  // so these intentionally do NOT reuse the chat-driven /*i flagships (product-lifecycle-management, ran, etc.).
  nsm: orderFor("nsm"),
  osm: orderFor("osm"),
  esm: orderFor("esm"),
};
