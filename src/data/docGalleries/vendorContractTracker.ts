import type { DocumentGalleryData, DocSection, GeneratedDocument } from "../types";

function sec(id: string, title: string, level: 1 | 2, paragraphs: string[]): DocSection {
  return { id, title, level, paragraphs };
}

const documents: GeneratedDocument[] = [
  {
    key: "hld",
    icon: "hld",
    title: "High level design",
    description: "Architecture overview, major modules, and system boundaries.",
    readMinutes: 9,
    sections: [
      sec("1", "Executive Summary", 1, [
        "Vendor Contract Tracker is the Procurement Systems team's system of record for vendor relationships and contract lifecycle — from RFP through legal review, signature, renewal, and expiration. Before it existed, contracts lived across shared drives, inboxes, and a spreadsheet the Procurement Operations org affectionately called \"the master list,\" which routinely fell out of sync with reality. The reverse-engineering pass identified a Spring MVC application (roughly 73 KLOC across 6 primary modules) that has been migrated incrementally off an older JSP monolith, backed by Oracle, with DocuSign handling e-signature and Quartz driving scheduled renewal-deadline sweeps.",
        "The system currently tracks approximately 640 active vendor contracts spanning 212 approved vendors, representing roughly $47M in tracked annual contract value across six spend categories: IT Services, Facilities, Professional Services, Software Licensing, Logistics, and Marketing. Since the automated 90/60/30-day renewal alerting shipped, missed-renewal incidents — several of which previously resulted in unplanned auto-renewal at unfavorable terms — have gone from roughly 12/year to effectively zero.",
      ]),
      sec("2", "Module Map", 1, [
        "Five modules carry the current (migrated) architecture: `contract-lifecycle-service` owns the contract state machine and CRUD surface over the CONTRACTS table; `vendor-registry-service` owns vendor master data and the aggregate rating calculation; `esignature-integration-adapter` wraps the DocuSign Envelopes API and consumes DocuSign's webhook callbacks; `renewal-notification-scheduler` runs the nightly Quartz sweep that raises 90/60/30-day alerts against `endDate`; and `spend-reporting-service` serves the category/vendor spend rollups used by Finance.",
        "A sixth surface, referred to internally as the \"legacy JSP layer,\" still serves two screens directly against Oracle without going through the service layer: a legacy contract search page and a legacy vendor portal page, both slated for retirement once the Spring MVC replacement (`contract-search-service`) clears UAT. The migration is tracked at roughly 80% complete by module count.",
      ]),
      sec("3", "Architecture Overview", 1, [
        "The system follows a fairly conventional layered Spring MVC structure — controllers, service-layer business logic, Spring Data repositories, Oracle persistence — with the DocuSign integration isolated behind an adapter interface (`ESignatureGateway`) specifically so the underlying e-signature provider could be swapped without touching `contract-lifecycle-service`. Cross-cutting concerns (auth via the corporate SSO filter, structured logging, and Oracle connection pooling via HikariCP) are centralized in a shared `platform-commons` module rather than duplicated per service.",
        "Because the legacy JSP screens bypass the service layer, they were flagged during analysis as the primary source of data-integrity risk in the codebase — direct SQL writes from JSP controllers don't pass through `ContractStateMachine` validation, which is the root cause behind a handful of historical incidents where a contract's `status` and its underlying dates drifted out of sync.",
      ]),
      sec("4", "Key Design Decisions", 1, [
        "The DocuSign integration was deliberately kept behind `esignature-integration-adapter` rather than called directly from `contract-lifecycle-service`, both to isolate a third-party dependency and because Legal has, twice, requested an evaluation of alternative e-signature vendors — the adapter boundary means that evaluation wouldn't require a contract-lifecycle rewrite.",
        "Renewal alerting is deliberately a scheduled batch sweep (Quartz, nightly at 02:00 UTC) rather than event-driven off `endDate` changes, because the alert thresholds (90/60/30 days) are inherently calendar-relative rather than event-relative — a nightly sweep comparing `CURRENT_DATE` against `endDate` is simpler and more auditable than trying to schedule a future event at contract-creation time.",
      ]),
    ],
  },
  {
    key: "lld",
    icon: "lld",
    title: "Low level design",
    description: "Detailed components, interfaces, and implementation structure.",
    readMinutes: 11,
    sections: [
      sec("1", "Core Interfaces", 1, [
        "`ContractStateMachine` enforces the valid transitions for a contract's `status` field: Draft → Active (requires a completed DocuSign envelope), Active → Expiring Soon (system-set by the renewal sweep at the 90-day threshold), Active/Expiring Soon → Expired (system-set at `endDate`), and Draft → Draft (edits permitted pre-signature). Any attempt to set `status` outside these transitions — for instance, moving a Draft contract directly to Expired — is rejected at the service layer with a `422 INVALID_STATE_TRANSITION`.",
        "`RenewalAlertJob` is the Quartz job invoked nightly by `renewal-notification-scheduler`. It queries CONTRACTS for rows where `status IN ('Active','Expiring Soon')` and `endDate` falls within 90, 60, or 30 days of the run date, writes one row per threshold crossed into RENEWAL_ALERTS (deduplicated so the same contract/threshold pair never fires twice), and publishes a notification event consumed by the email and Slack notifiers.",
        "`VendorRatingCalculator` recomputes a vendor's aggregate `rating` field on `vendors` whenever a linked contract closes out or a manual performance review is logged, blending the prior rating with the new data point on a weighted rolling basis rather than a simple average, so a single bad engagement doesn't swing a long-tenured vendor's rating disproportionately.",
      ]),
      sec("2", "Data Model (Oracle)", 1, [
        "CONTRACTS is the primary table: CONTRACT_NUMBER (PK, format `CTR-YYYY-NNNN`), VENDOR_NAME (FK-like reference to VENDORS.VENDOR_NAME — not a hard FK, see below), CONTRACT_VALUE (NUMBER, USD), START_DATE, END_DATE, CATEGORY (constrained to the six enum values: IT Services, Facilities, Professional Services, Software Licensing, Logistics, Marketing), and STATUS (Draft, Active, Expiring Soon, Expired).",
        "VENDORS holds VENDOR_NAME (PK), CATEGORY, CONTACT_NAME, CONTACT_EMAIL, RATING (NUMBER(2,1), 0.0–5.0), and STATUS (Approved, Under Review, Blacklisted). CONTRACT_AMENDMENTS captures value/date changes to an existing contract post-signature (a change order pattern) and RENEWAL_ALERTS is the dedupe/audit table written by `RenewalAlertJob`.",
      ]),
      sec("3", "Known Debt", 2, [
        "VENDOR_NAME on CONTRACTS is a denormalized string match against VENDORS.VENDOR_NAME rather than a proper foreign key — a legacy decision from before `vendor-registry-service` existed as a distinct module. This is the single most-flagged item in the last three architecture reviews; a migration to a surrogate VENDOR_ID key is scoped but not yet started, tracked as a blocker for a cleaner multi-vendor-alias feature that Procurement has requested twice.",
        "The two remaining legacy JSP screens write directly to CONTRACTS and VENDORS via raw JDBC, bypassing `ContractStateMachine` and `VendorRatingCalculator` entirely — this is the origin of essentially every state-integrity bug found in the codebase's issue history.",
      ]),
      sec("4", "Error Handling", 1, [
        "Service-layer exceptions are normalized to a small typed hierarchy (`InvalidStateTransitionException`, `DuplicateContractNumberException`, `VendorNotApprovedException`) and translated to a consistent JSON error envelope by a shared `@ControllerAdvice` handler, so every REST client gets the same shape of error regardless of which controller raised it.",
      ]),
    ],
  },
  {
    key: "brd",
    icon: "brd",
    title: "Business requirements",
    description: "Business goals, stakeholders, and functional requirements.",
    readMinutes: 8,
    sections: [
      sec("1", "Business Goals", 1, [
        "The primary driver was eliminating missed contract renewals — historically running around 12 per year, several of which resulted in a contract auto-renewing at unfavorable legacy terms because nobody caught the deadline in time. The automated 90/60/30-day alert cascade addresses this directly and has driven that number to effectively zero since rollout.",
        "A secondary goal was giving Finance and Procurement leadership a single, trustworthy view of total contract exposure ($47M tracked annually) and spend concentration by category, replacing a manually-reconciled spreadsheet that was frequently a month or more out of date by the time it reached the CFO's desk.",
        "A third, less quantified but consistently cited goal from Legal was audit defensibility — being able to show, for any contract, exactly when it was signed, by whom it was approved, and what the DocuSign envelope trail looks like, without having to reconstruct it from email threads during an audit.",
      ]),
      sec("2", "Stakeholders", 1, [
        "The VP of Procurement is the primary business owner and the system's most frequent user, relying on it for renewal planning and vendor performance conversations. The CFO's office consumes the spend-by-category reporting for quarterly forecasting. General Counsel and the Legal team rely on the e-signature audit trail and are the ones who originally escalated the missed-renewal problem. A dedicated Vendor Risk Manager role uses the vendor `rating` and `status` fields (Approved / Under Review / Blacklisted) as an input to vendor risk reviews.",
      ]),
      sec("3", "Functional Requirements", 1, [
        "The system must prevent a contract from reaching Active status without a completed DocuSign envelope; must raise renewal alerts at 90, 60, and 30 days before a contract's `endDate` without duplicate firing; must support amendments (value or date changes) against a signed contract without losing the original signed terms as a historical record; and must roll vendor performance up into a single `rating` value usable in vendor selection decisions.",
      ]),
    ],
  },
  {
    key: "prd",
    icon: "prd",
    title: "Product requirements",
    description: "Product scope, user stories, and acceptance criteria.",
    readMinutes: 10,
    sections: [
      sec("1", "Scope", 1, [
        "In scope: contract lifecycle management (Draft → Active → Expiring Soon → Expired) for the CONTRACTS entity, vendor master data and rating for the VENDORS entity, DocuSign-driven e-signature, the 90/60/30-day renewal alert cascade, and spend/renewal reporting. Explicitly out of scope: purchase-order and invoicing workflows (owned by a separate AP system) and RFP/sourcing evaluation (currently spreadsheet-based, no plans to absorb it into this system in the current roadmap).",
      ]),
      sec("2", "User Stories", 1, [
        "**US-01**: As a Procurement Analyst, I need to create a Draft contract with contractNumber, vendorName, contractValue, startDate, endDate, and category, so that a new vendor engagement is tracked from the moment negotiation starts, before signature. Acceptance: a Draft contract can be freely edited; contractNumber must be unique and match the `CTR-YYYY-NNNN` format or the API returns a 400.",
        "**US-02**: As Legal, I need to send a Draft contract for e-signature and have the system automatically transition it to Active only once DocuSign confirms all parties have signed, so that Active always means \"fully executed.\" Acceptance: `POST /api/v1/contracts/{contractNumber}/send-for-signature` dispatches to DocuSign; the DocuSign completion webhook is the only path that can set status to Active — there is no manual override.",
        "**US-03**: As the VP of Procurement, I need to see every contract whose status is Expiring Soon in one view, so that renewal decisions happen with enough runway to renegotiate rather than emergency-renew. Acceptance: a contract enters Expiring Soon automatically once inside the 90-day window, driven by the nightly `RenewalAlertJob`, not a manual status change.",
        "**US-04**: As a Vendor Risk Manager, I need a vendor's rating to reflect actual contract performance rather than a single subjective score, so that vendor risk reviews are grounded in evidence. Acceptance: `rating` updates via `VendorRatingCalculator` on contract closeout; a vendor whose rating falls below a configured floor is flagged for review but not automatically transitioned to Under Review (that remains a human decision).",
        "**US-05**: As a Finance analyst, I need spend broken down by category across all Active contracts, so that budget forecasting doesn't require manually summing a spreadsheet. Acceptance: `GET /api/v1/reports/spend-by-category` reflects only Active and Expiring Soon contracts (Draft and Expired are excluded from committed spend).",
      ]),
    ],
  },
  {
    key: "feature",
    icon: "feature",
    title: "Feature specification",
    description: "Feature behavior, inputs, outputs, and edge cases.",
    readMinutes: 12,
    sections: [
      sec("1", "Renewal Alert Cascade", 1, [
        "The nightly `RenewalAlertJob` (Quartz, 02:00 UTC) evaluates every contract with status Active or Expiring Soon and compares `endDate` against the run date. Crossing the 90-day threshold both raises an alert (email to the assigned Procurement Analyst plus a Slack post to #procurement-renewals) and flips `status` to Expiring Soon. The 60-day and 30-day crossings raise escalating-urgency alerts but do not change status again — Expiring Soon is a single state covering the full 90-day runway.",
        "Each threshold fires exactly once per contract, enforced by a uniqueness constraint on (CONTRACT_NUMBER, THRESHOLD_DAYS) in RENEWAL_ALERTS — if the job reruns after a partial failure, already-recorded alerts are skipped rather than re-sent.",
      ]),
      sec("2", "Vendor Rating Aggregation", 1, [
        "`VendorRatingCalculator` runs on two triggers: a contract transitioning to Expired (closeout) and a manual performance-review submission from a Procurement Analyst. Rather than a flat average, new data points are weighted more heavily than older ones on a rolling basis, so a vendor with a long track record isn't disproportionately penalized or rewarded by a single recent engagement — this was a deliberate response to a 2025 incident where a single bad small-value contract dropped a long-tenured, otherwise-strong vendor's rating enough to trigger an unwarranted review.",
      ]),
      sec("3", "Cross-Entity Integrity Rules", 1, [
        "A contract cannot be created against a vendor whose status is Blacklisted — `VendorNotApprovedException` is raised at the service layer. A contract against a vendor whose status is Under Review is permitted but flagged with a warning banner in the UI, since Under Review is not a hard block, only a caution state.",
        "Because VENDOR_NAME is a denormalized string match rather than a foreign key (see Low Level Design, Known Debt), a vendor rename does not currently cascade to existing contracts — this is a known edge case that Support has had to manually patch twice.",
      ]),
    ],
  },
  {
    key: "api",
    icon: "api",
    title: "API reference",
    description: "Endpoints, payloads, authentication, and error contracts.",
    readMinutes: 13,
    sections: [
      sec("1", "Authentication", 1, [
        "All endpoints require a bearer token issued via corporate SSO; the DocuSign webhook endpoint is the one exception, authenticated instead via DocuSign's HMAC connect-key signature rather than a bearer token, since it's an inbound callback from a third party rather than an authenticated internal client.",
      ]),
      sec("2", "Contract Endpoints", 1, [
        "`GET /api/v1/contracts` — list contracts, filterable by `status` and `category`, paginated. `GET /api/v1/contracts/{contractNumber}` — fetch a single contract. `POST /api/v1/contracts` — create a Draft contract. `PATCH /api/v1/contracts/{contractNumber}` — update a Draft contract's fields (rejected with 409 if status is not Draft). `POST /api/v1/contracts/{contractNumber}/send-for-signature` — dispatches the contract to `esignature-integration-adapter`, which creates a DocuSign envelope and returns the envelope ID.",
        "`POST /api/v1/contracts/{contractNumber}/webhook/docusign` — inbound DocuSign completion callback; on a fully-executed envelope, transitions the contract to Active. `POST /api/v1/contracts/{contractNumber}/amendments` — records a value/date change against a signed contract without overwriting the original signed terms.",
      ]),
      sec("3", "Vendor & Reporting Endpoints", 1, [
        "`GET /api/v1/vendors` — list vendors, filterable by `category` and `status`. `GET /api/v1/vendors/{vendorName}/contracts` — all contracts for a given vendor (string-matched, see LLD known debt). `PATCH /api/v1/vendors/{vendorName}/rating` — manual performance-review submission, feeds `VendorRatingCalculator`.",
        "`GET /api/v1/reports/spend-by-category` — Active/Expiring Soon contract value summed by category. `GET /api/v1/reports/renewals-upcoming` — contracts inside the 90-day window, the same data source as the Expiring Soon dashboard view.",
      ]),
      sec("4", "Error Contract", 1, [
        "All errors return a consistent envelope: `{ \"error\": { \"code\": \"INVALID_STATE_TRANSITION\", \"message\": \"...\", \"contractNumber\": \"CTR-2026-0104\" } }`. Common codes: `INVALID_STATE_TRANSITION` (422), `DUPLICATE_CONTRACT_NUMBER` (409), `VENDOR_NOT_APPROVED` (403), `CONTRACT_NOT_DRAFT` (409, on PATCH against a non-Draft contract).",
      ]),
    ],
  },
  {
    key: "testplan",
    icon: "testplan",
    title: "Test plan",
    description: "Test scenarios, coverage targets, and validation steps.",
    readMinutes: 9,
    sections: [
      sec("1", "Test Strategy", 1, [
        "Testing is layered: unit tests around `ContractStateMachine`, `RenewalAlertJob`, and `VendorRatingCalculator` business logic; integration tests around the Oracle repository layer and the DocuSign webhook handler using a recorded-response sandbox; and a smaller set of end-to-end tests covering the full draft-to-signature-to-active journey and the renewal alert cascade against a time-shifted test clock.",
      ]),
      sec("2", "Coverage Targets", 1, [
        "The five migrated Spring MVC modules target 85%+ statement coverage on business logic; the legacy JSP layer, being scheduled for retirement rather than active investment, is held to a lower ~40% bar covering only its highest-risk direct-write paths.",
      ]),
      sec("3", "Renewal Alert Scenarios", 2, [
        "Coverage includes: a contract crossing exactly 90/60/30 days out (alert fires, status change only at 90-day crossing); a contract whose job run is skipped one night and catches up correctly the next run without double-firing; and a contract manually moved to Expired before its natural end date (no further alerts fire).",
      ]),
    ],
  },
  {
    key: "testcases",
    icon: "testcases",
    title: "Test cases",
    description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
    readMinutes: 11,
    sections: [
      sec("1", "Renewal & Signature Cases", 1, [
        "**TC-REN-012**: 90-day renewal alert fires exactly once per contract. Set up an Active contract with `endDate` 90 days from the test clock; run `RenewalAlertJob` twice in succession. Expected: exactly one RENEWAL_ALERTS row for the 90-day threshold, status transitions to Expiring Soon, and the second job run produces no duplicate.",
        "**TC-REN-013**: 60-day and 30-day alerts fire without a repeat status change. Advance the test clock to 60 days out on an already-Expiring-Soon contract. Expected: a new 60-day RENEWAL_ALERTS row, status remains Expiring Soon (not re-set).",
        "**TC-SIG-005**: Contract cannot transition to Active without a completed DocuSign envelope. Call `send-for-signature`, then attempt a manual status PATCH to Active before the webhook fires. Expected: 422 `INVALID_STATE_TRANSITION` — Active is only reachable via the DocuSign webhook handler.",
        "**TC-SIG-006**: DocuSign webhook with an invalid HMAC signature is rejected. Send the completion payload with a tampered signature header. Expected: 401, and the contract's status is unchanged.",
      ]),
      sec("2", "Vendor Integrity Cases", 1, [
        "**TC-VEN-004**: Contract creation against a Blacklisted vendor is rejected. Attempt `POST /api/v1/contracts` with `vendorName` set to a vendor whose status is Blacklisted. Expected: 403 `VENDOR_NOT_APPROVED`.",
        "**TC-VEN-007**: Vendor rating reflects weighted rolling calculation, not a flat average. Submit three sequential performance reviews of decreasing score on a long-tenured vendor. Expected: the resulting `rating` decays gradually rather than dropping to the most recent single score.",
      ]),
      sec("3", "Known Gap", 2, [
        "There is currently no automated test covering a vendor rename cascading (or failing to cascade) to existing CONTRACTS.VENDOR_NAME rows — this gap is a direct consequence of the denormalized string-match relationship flagged in the Low Level Design.",
      ]),
    ],
  },
  {
    key: "dataflow",
    icon: "dataflow",
    title: "Data flow",
    description: "Data movement across services, stores, and integrations.",
    readMinutes: 7,
    sections: [
      sec("1", "Contract Lifecycle Path", 1, [
        "A contract is created as Draft by `contract-lifecycle-service` and written to CONTRACTS. On `send-for-signature`, `esignature-integration-adapter` creates a DocuSign envelope and stores the envelope ID against the contract. DocuSign's completion webhook lands on `esignature-integration-adapter`, which invokes `ContractStateMachine` to transition the contract to Active and updates CONTRACTS accordingly.",
      ]),
      sec("2", "Renewal Sweep Path", 1, [
        "Nightly, `renewal-notification-scheduler` triggers `RenewalAlertJob`, which reads CONTRACTS for Active/Expiring Soon rows, compares `endDate` against the run date, writes to RENEWAL_ALERTS, and publishes an internal notification event consumed by the email notifier and the Slack notifier, which post to the assigned analyst and #procurement-renewals respectively.",
      ]),
      sec("3", "Reporting Path", 1, [
        "`spend-reporting-service` reads CONTRACTS directly (read replica) to compute the category and vendor spend rollups served by the reporting endpoints — it does not write back, keeping reporting strictly downstream of the transactional path.",
      ]),
    ],
  },
  {
    key: "traceability",
    icon: "traceability",
    title: "Traceability matrix",
    description: "Mapping from requirements to design, code, and tests.",
    readMinutes: 8,
    sections: [
      sec("1", "Coverage Mapping", 1, [
        "US-02 (e-signature-gated Active transition) → `ContractStateMachine` + `esignature-integration-adapter` (HLD/LLD) → TC-SIG-005, TC-SIG-006. US-03 (Expiring Soon visibility) → `RenewalAlertJob` (LLD) → TC-REN-012, TC-REN-013. US-04 (evidence-based vendor rating) → `VendorRatingCalculator` (LLD) → TC-VEN-007. US-05 (spend-by-category reporting) → `spend-reporting-service` (Data Flow) → covered by the reporting integration suite (not itemized above, tracked under TC-RPT-001 through TC-RPT-006).",
        "The one requirement without a corresponding automated test is vendor-rename cascade behavior (Feature Specification, Cross-Entity Integrity Rules) — carried on the team's backlog as `PROC-1184`.",
      ]),
    ],
  },
  {
    key: "coverage",
    icon: "coverage",
    title: "Coverage",
    description: "Documentation and code coverage across the codebase.",
    readMinutes: 6,
    sections: [
      sec("1", "Summary", 1, [
        "`contract-lifecycle-service`: 91% statement coverage. `vendor-registry-service`: 88%. `esignature-integration-adapter`: 84% (webhook signature-failure paths are the main gap). `renewal-notification-scheduler`: 93%. `spend-reporting-service`: 79%. The legacy JSP layer (contract search, vendor portal): 41%, consistent with its retire-don't-invest status.",
      ]),
    ],
  },
  {
    key: "summary",
    icon: "summary",
    title: "Generation summary",
    description: "Summarizes what is covered across all related documents in a single consolidated view.",
    readMinutes: 5,
    sections: [
      sec("1", "What Was Generated", 1, [
        "This pass produced 14 documents from static analysis of the `vendor-contract-tracker` repository (73 KLOC, 6 primary modules, Spring MVC + Oracle + DocuSign + Quartz), covering architecture, requirements, the full REST surface, test strategy and concrete test cases, data flow, requirement traceability, and a local-dev tutorial. The JSP-to-Spring-MVC migration, tracked at roughly 80% complete, is called out explicitly wherever it affects design, coverage, or known debt, rather than glossed over.",
      ]),
    ],
  },
  {
    key: "provenance",
    icon: "provenance",
    title: "Provenance",
    description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
    readMinutes: 5,
    sections: [
      sec("1", "Generation Trail", 1, [
        "Every document links back to the repository commit (`main@` at analysis time), the specific module paths under `/services/*` and the legacy `/legacy-jsp/*` directory, and the analysis pass that produced it — the module map, the Oracle schema extraction, the REST controller scan, and the Quartz job-definition scan are each independently re-runnable and were cross-checked against each other (e.g. the API reference's endpoint list was validated against the controller scan, not hand-written).",
      ]),
    ],
  },
  {
    key: "tutorial",
    icon: "tutorial",
    title: "Tutorial",
    description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
    readMinutes: 8,
    sections: [
      sec("1", "Getting Started", 1, [
        "Clone the repository, then bring up Oracle XE locally via `docker compose up oracle-xe` (the compose file seeds the CONTRACTS, VENDORS, CONTRACT_AMENDMENTS, and RENEWAL_ALERTS schema on first boot). Copy `application-local.yml.example` to `application-local.yml` and set a DocuSign sandbox API key — the app runs fine without one, but `send-for-signature` calls will fail until it's set.",
        "Start the app with `mvn spring-boot:run -Dspring-boot.run.profiles=local`. The seed data script (`scripts/seed-sample-data.sql`) loads a representative slice of sample vendors and contracts across all six categories and every status value, so the Expiring Soon and Draft views aren't empty on first run.",
      ]),
      sec("2", "Making a Change", 1, [
        "Locate the relevant module using the High-Level Design's module map — most business-logic changes belong in `contract-lifecycle-service` or `vendor-registry-service`, not the legacy JSP layer, which should be treated as frozen except for critical fixes. Add or update tests alongside the change (see Test Plan for the coverage bar per module) and verify the affected suite passes locally with `mvn test -pl <module>` before opening a pull request.",
      ]),
      sec("3", "Triggering a Renewal Alert Manually", 2, [
        "To test the renewal cascade without waiting for the nightly schedule, run `RenewalAlertJob` on demand via the local admin endpoint `POST /internal/jobs/renewal-alert/run` (local profile only, disabled in production) — this is the fastest way to verify a contract's `endDate` crosses a threshold correctly without manipulating the system clock.",
      ]),
    ],
  },
];

export const vendorContractTrackerDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/vendor-contract-tracker",
  repoName: "VENDORCONTRACTTRACKER",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 73 KLOC across 6 primary modules plus a legacy JSP directory",
    "Parsed Spring MVC project structure and Maven build configuration",
    "Detected partial legacy migration — JSP-to-Spring MVC tracked at ~80% complete",
    "Built module dependency graph across contract-lifecycle-service, vendor-registry-service, esignature-integration-adapter, renewal-notification-scheduler, spend-reporting-service",
    "Extracted Oracle schema — CONTRACTS, VENDORS, CONTRACT_AMENDMENTS, RENEWAL_ALERTS",
    "Identified DocuSign integration adapter and inbound webhook handler",
    "Identified Quartz-scheduled RenewalAlertJob and 90/60/30-day alert cascade logic",
    "Generated Business Requirements and Product Requirements",
    "Generated High-Level Design and Low-Level Design",
    "Generated Data Flow Diagram and Traceability Matrix",
    "Generated API Reference, Test Plan, and 6 concrete Test Cases",
    "Generated Coverage report, Tutorial, and Provenance record",
  ],
  documents,
};
