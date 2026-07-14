import type { CatalogCard } from "../types";

const AUTHORS = ["Prem", "Aditi", "Mohak", "Bhavesh", "Chetan", "Rohan", "Sudarshan", "Hemant", "aayush", "Naman", "Yashraj"];

function author(i: number): string {
  return AUTHORS[i % AUTHORS.length];
}

export const esiFillers: CatalogCard[] = [
  {
    id: "esi-resource-capacity-planner",
    title: "Resource Capacity Planner",
    category: "Project & program management",
    description:
      "Cross-program resource allocation and capacity heatmaps for the PMO — surfaces over-committed staff and skill shortfalls three sprints out instead of after the milestone slips.",
    author: author(0),
    minutesAgo: 33,
    platforms: ["esi"],
  },
  {
    id: "esi-risk-register-manager",
    title: "Risk Register Manager",
    category: "Project & program management",
    description:
      "Structured risk identification, scoring, and mitigation tracking across every active program — probability/impact heatmaps and owner accountability replace a shared spreadsheet nobody trusts.",
    author: author(1),
    minutesAgo: 37,
    platforms: ["esi"],
  },
  {
    id: "esi-rfp-procurement-workflow",
    title: "RFP & Procurement Workflow",
    category: "Project & program management",
    description:
      "End-to-end RFP issuance, vendor bid comparison, and award workflow — scoring rubrics and audit trails that hold up to procurement compliance review.",
    author: author(2),
    minutesAgo: 41,
    platforms: ["esi"],
  },
  {
    id: "esi-stage-gate-review-board",
    title: "Stage-Gate Review Board",
    category: "Project & program management",
    description:
      "Formal gate-review scheduling and decision capture for capital programs — go/no-go criteria, sponsor sign-off, and a permanent record of why each gate passed or stalled.",
    author: author(3),
    minutesAgo: 45,
    platforms: ["esi"],
  },
  {
    id: "esi-scaled-agile-program-tracker",
    title: "Scaled Agile Program Tracker",
    category: "Project & program management",
    description:
      "SAFe-style program increment planning and cross-team dependency tracking — PI objectives, velocity trends, and a dependency board that catches blocking work before the PI starts.",
    author: author(4),
    minutesAgo: 49,
    platforms: ["esi"],
  },
  {
    id: "esi-client-engagement-hub",
    title: "Client Engagement Hub",
    category: "Project & program management",
    description:
      "Engagement-level workspace for professional services firms — scope, staffing, and status in one place so account leads stop reconstructing project health from email threads.",
    author: author(5),
    minutesAgo: 53,
    platforms: ["esi"],
  },
  {
    id: "esi-budget-vs-actual-tracker",
    title: "Budget vs. Actual Tracker",
    category: "Project & program management",
    description:
      "Program-level budget tracking against committed and actual spend, with variance alerts that flag cost overruns while there's still time to course-correct.",
    author: author(6),
    minutesAgo: 57,
    platforms: ["esi"],
  },
  {
    id: "esi-stakeholder-status-reporter",
    title: "Stakeholder Status Reporter",
    category: "Project & program management",
    description:
      "Auto-generated executive status reports pulled from live project data — RAG status, key risks, and next milestones, without a PM spending Friday afternoon formatting slides.",
    author: author(7),
    minutesAgo: 61,
    platforms: ["esi"],
  },
  {
    id: "esi-subcontractor-management-suite",
    title: "Subcontractor Management Suite",
    category: "Project & program management",
    description:
      "Subcontractor prequalification, insurance/compliance tracking, and performance scorecards for capital programs — no crew shows up on site without current certifications on file.",
    author: author(8),
    minutesAgo: 65,
    platforms: ["esi"],
  },
  {
    id: "esi-site-safety-audit-manager",
    title: "Site Safety Audit Manager",
    category: "Project & program management",
    description:
      "Digital safety walk checklists, incident logging, and corrective-action tracking across job sites — closes the loop between an inspection finding and its verified fix.",
    author: author(9),
    minutesAgo: 69,
    platforms: ["esi"],
  },
  {
    id: "esi-equipment-fleet-manager",
    title: "Equipment & Fleet Manager",
    category: "Project & program management",
    description:
      "Heavy-equipment and fleet utilization tracking across program sites — maintenance schedules, idle-asset flags, and inter-site transfer requests that cut rental spend.",
    author: author(10),
    minutesAgo: 73,
    platforms: ["esi"],
  },
  {
    id: "esi-warranty-defect-tracker",
    title: "Warranty & Defect Tracker",
    category: "Project & program management",
    description:
      "Post-handover warranty claim and defect-resolution tracking — every punch item traced from report through contractor remediation to close-out sign-off.",
    author: author(11),
    minutesAgo: 77,
    platforms: ["esi"],
  },
  {
    id: "esi-document-control-system",
    title: "Document Control System",
    category: "Project & program management",
    description:
      "Version-controlled drawing and specification management for capital projects — transmittal logs and superseded-revision flags that keep the field crew off an obsolete drawing.",
    author: author(12),
    minutesAgo: 81,
    platforms: ["esi"],
  },
  {
    id: "esi-field-inspection-app",
    title: "Field Inspection App",
    category: "Project & program management",
    description:
      "Offline-capable field inspection checklists with photo capture and geotagging — inspectors file findings from the site, not from memory back at the trailer.",
    author: author(13),
    minutesAgo: 85,
    platforms: ["esi"],
  },
  {
    id: "esi-real-estate-development-pipeline",
    title: "Real Estate Development Pipeline",
    category: "Project & program management",
    description:
      "Deal-to-delivery pipeline for development projects — site acquisition, entitlement status, and construction milestones tracked against pro forma assumptions.",
    author: author(14),
    minutesAgo: 89,
    platforms: ["esi"],
  },
  {
    id: "esi-innovation-portfolio-tracker",
    title: "Innovation Portfolio Tracker",
    category: "Project & program management",
    description:
      "R&D and innovation-initiative portfolio management — stage-of-maturity tracking, funding-vs-return scoring, and a kill/scale decision log for every experiment in flight.",
    author: author(15),
    minutesAgo: 93,
    platforms: ["esi"],
  },
  {
    id: "esi-event-program-logistics-manager",
    title: "Event & Program Logistics Manager",
    category: "Project & program management",
    description:
      "Multi-vendor logistics coordination for large program events and rollouts — venue, catering, travel, and staffing tasks tracked against a single go-live date.",
    author: author(16),
    minutesAgo: 97,
    platforms: ["esi"],
  },
  {
    id: "esi-training-certification-tracker",
    title: "Training & Certification Tracker",
    category: "Project & program management",
    description:
      "Workforce certification and training-compliance tracking for regulated programs — expiring credentials surfaced weeks ahead so nobody gets pulled off site mid-shift.",
    author: author(17),
    minutesAgo: 101,
    platforms: ["esi"],
  },
  {
    id: "esi-quality-management-system",
    title: "Quality Management System",
    category: "Project & program management",
    description:
      "QMS for capital and delivery programs — nonconformance reporting, root-cause analysis, and corrective/preventive action tracking aligned to ISO 9001-style audit requirements.",
    author: author(18),
    minutesAgo: 105,
    platforms: ["esi"],
  },
  {
    id: "esi-lessons-learned-repository",
    title: "Lessons Learned Repository",
    category: "Project & program management",
    description:
      "Searchable post-project retrospective archive tagged by risk type and root cause — so the next program doesn't repeat a mistake three teams already made.",
    author: author(19),
    minutesAgo: 109,
    platforms: ["esi"],
  },
  {
    id: "esi-project-charter-builder",
    title: "Project Charter Builder",
    category: "Project & program management",
    description:
      "Guided project charter and business-case authoring with built-in sponsor approval routing — standardizes intake so every new project starts with the same rigor.",
    author: author(20),
    minutesAgo: 113,
    platforms: ["esi"],
  },
  {
    id: "esi-earned-value-management-console",
    title: "Earned Value Management Console",
    category: "Project & program management",
    description:
      "EVM reporting for capital programs — CPI, SPI, and cost/schedule variance calculated automatically from actuals, replacing a monthly manual EVM spreadsheet exercise.",
    author: author(21),
    minutesAgo: 117,
    platforms: ["esi"],
  },
  {
    id: "esi-change-order-tracker",
    title: "Change Order Tracker",
    category: "Project & program management",
    description:
      "Contract change-order request, costing, and approval workflow for construction and capital programs — full audit trail from field RFI to signed change order.",
    author: author(22),
    minutesAgo: 121,
    platforms: ["esi"],
  },
  {
    id: "esi-punch-list-manager",
    title: "Punch List Manager",
    category: "Project & program management",
    description:
      "Collaborative punch-list tracking for project close-out — items assigned by trade, photo-verified on completion, with a live percent-complete view for the owner.",
    author: author(23),
    minutesAgo: 125,
    platforms: ["esi"],
  },
  {
    id: "esi-bid-comparison-tool",
    title: "Bid Comparison Tool",
    category: "Project & program management",
    description:
      "Side-by-side vendor bid leveling with normalized scope and pricing breakdowns — cuts bid evaluation time and produces a defensible award recommendation.",
    author: author(24),
    minutesAgo: 129,
    platforms: ["esi"],
  },
  {
    id: "esi-program-dependency-mapper",
    title: "Program Dependency Mapper",
    category: "Project & program management",
    description:
      "Visual cross-project dependency graph for large programs — flags a slipping upstream milestone that's about to cascade into three downstream workstreams.",
    author: author(25),
    minutesAgo: 133,
    platforms: ["esi"],
  },
  {
    id: "esi-contractor-onboarding-portal",
    title: "Contractor Onboarding Portal",
    category: "Project & program management",
    description:
      "Self-service contractor onboarding — insurance docs, safety training acknowledgment, and access provisioning handled before day one instead of scrambled on it.",
    author: author(26),
    minutesAgo: 137,
    platforms: ["esi"],
  },
  {
    id: "esi-milestone-payment-tracker",
    title: "Milestone Payment Tracker",
    category: "Project & program management",
    description:
      "Milestone-based vendor and contractor payment tracking tied to verified deliverable completion — no invoice gets paid against work that hasn't actually been signed off.",
    author: author(27),
    minutesAgo: 141,
    platforms: ["esi"],
  },
  {
    id: "esi-site-access-badging-manager",
    title: "Site Access & Badging Manager",
    category: "Project & program management",
    description:
      "Program-wide site access and badge issuance tracking across multiple job sites — instant revocation when a contractor's certification lapses or the contract ends.",
    author: author(28),
    minutesAgo: 145,
    platforms: ["esi"],
  },
  {
    id: "esi-environmental-compliance-tracker",
    title: "Environmental Compliance Tracker",
    category: "Project & program management",
    description:
      "Environmental permit condition and monitoring-obligation tracking for capital projects — sampling schedules and reporting deadlines that don't get missed between site visits.",
    author: author(29),
    minutesAgo: 149,
    platforms: ["esi"],
  },
  {
    id: "esi-permit-tracking-system",
    title: "Permit Tracking System",
    category: "Project & program management",
    description:
      "Building, zoning, and utility permit application tracking across jurisdictions — status, expiration dates, and resubmission history in one place instead of scattered agency portals.",
    author: author(30),
    minutesAgo: 153,
    platforms: ["esi"],
  },
  {
    id: "esi-design-review-coordinator",
    title: "Design Review Coordinator",
    category: "Project & program management",
    description:
      "Design-review comment consolidation across architects, engineers, and owners — clash markups and RFIs tracked to resolution instead of buried in email chains.",
    author: author(31),
    minutesAgo: 157,
    platforms: ["esi"],
  },
  {
    id: "esi-commissioning-checklist-manager",
    title: "Commissioning Checklist Manager",
    category: "Project & program management",
    description:
      "System-by-system commissioning checklist management for capital assets — functional test results and deficiency lists tied directly to substantial-completion sign-off.",
    author: author(32),
    minutesAgo: 161,
    platforms: ["esi"],
  },
  {
    id: "esi-asset-handover-tracker",
    title: "Asset Handover Tracker",
    category: "Project & program management",
    description:
      "Structured handover-to-operations tracking — O&M manuals, as-builts, and warranty documentation confirmed complete before a project is declared closed.",
    author: author(33),
    minutesAgo: 165,
    platforms: ["esi"],
  },
  {
    id: "esi-utilization-tracker",
    title: "Professional Services Utilization Tracker",
    category: "Project & program management",
    description:
      "Billable-utilization and bench tracking across consulting engagements — resourcing managers see who's over-allocated and who's about to roll off before it becomes a revenue problem.",
    author: author(34),
    minutesAgo: 169,
    platforms: ["esi"],
  },
  {
    id: "esi-statement-of-work-generator",
    title: "Statement of Work Generator",
    category: "Project & program management",
    description:
      "Templated SOW authoring with clause libraries and approval routing — cuts SOW turnaround from days of legal back-and-forth to a same-day review cycle.",
    author: author(35),
    minutesAgo: 173,
    platforms: ["esi"],
  },
  {
    id: "esi-time-expense-approval-hub",
    title: "Time & Expense Approval Hub",
    category: "Project & program management",
    description:
      "Project-coded time and expense submission with manager approval routing — feeds billing and budget-actuals without a month-end reconciliation scramble.",
    author: author(36),
    minutesAgo: 177,
    platforms: ["esi"],
  },
  {
    id: "esi-project-health-scorecard",
    title: "Project Health Scorecard",
    category: "Project & program management",
    description:
      "Composite red/amber/green scoring across schedule, budget, scope, and risk for every active project — one glance tells a PMO director which five projects need attention today.",
    author: author(37),
    minutesAgo: 181,
    platforms: ["esi"],
  },
  {
    id: "esi-governance-committee-portal",
    title: "Governance Committee Portal",
    category: "Project & program management",
    description:
      "Steering-committee agenda, decision-log, and action-item tracking for program governance boards — decisions are recorded once and never re-litigated from memory.",
    author: author(38),
    minutesAgo: 185,
    platforms: ["esi"],
  },
  {
    id: "esi-portfolio-roadmap-visualizer",
    title: "Portfolio Roadmap Visualizer",
    category: "Project & program management",
    description:
      "Interactive multi-year portfolio roadmap combining timeline, dependencies, and resourcing constraints — replaces a roadmap slide that's stale the week after it ships.",
    author: author(39),
    minutesAgo: 189,
    platforms: ["esi"],
  },
  {
    id: "esi-vendor-performance-scorecard",
    title: "Vendor Performance Scorecard",
    category: "Project & program management",
    description:
      "Ongoing vendor performance scoring across cost, schedule, and quality metrics — turns renewal decisions into a data review instead of a gut call.",
    author: author(40),
    minutesAgo: 193,
    platforms: ["esi"],
  },
  {
    id: "esi-safety-incident-reporting",
    title: "Safety Incident Reporting",
    category: "Project & program management",
    description:
      "Near-miss and incident reporting with root-cause classification and OSHA-style recordability tracking — trend analysis that shows which sites need intervention before the next injury.",
    author: author(41),
    minutesAgo: 197,
    platforms: ["esi"],
  },
  {
    id: "esi-site-logistics-coordinator",
    title: "Site Logistics Coordinator",
    category: "Project & program management",
    description:
      "Material delivery scheduling and laydown-yard coordination across active job sites — prevents the delivery-truck pileup that stalls a crew for half a shift.",
    author: author(42),
    minutesAgo: 201,
    platforms: ["esi"],
  },
  {
    id: "esi-knowledge-transfer-tracker",
    title: "Knowledge Transfer Tracker",
    category: "Project & program management",
    description:
      "Structured knowledge-transfer checklists for program transitions and staff rotations — documented handoffs so critical context doesn't leave with the person who has it.",
    author: author(43),
    minutesAgo: 205,
    platforms: ["esi"],
  },
  {
    id: "esi-benefits-realization-tracker",
    title: "Program Benefits Realization Tracker",
    category: "Project & program management",
    description:
      "Post-launch tracking of promised business benefits against actuals — closes the loop on whether a funded initiative delivered the ROI it was approved on.",
    author: author(44),
    minutesAgo: 209,
    platforms: ["esi"],
  },
  {
    id: "esi-multi-site-rollout-planner",
    title: "Multi-Site Rollout Planner",
    category: "Project & program management",
    description:
      "Wave-based rollout planning for programs deploying across dozens of sites — sequencing, readiness checklists, and go-live tracking per wave instead of one big-bang risk.",
    author: author(45),
    minutesAgo: 213,
    platforms: ["esi"],
  },
  {
    id: "esi-retainage-holdback-tracker",
    title: "Retainage & Holdback Tracker",
    category: "Project & program management",
    description:
      "Contract retainage and holdback tracking across capital program vendors — release schedules tied to lien-waiver and close-out documentation, not manual reminders.",
    author: author(46),
    minutesAgo: 217,
    platforms: ["esi"],
  },
];
