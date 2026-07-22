import type { DocumentGalleryData } from "../types";

export const contractLifecycleManagerDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/contract-lifecycle-manager",
  repoName: "CONTRACTLIFECYCLEMANAGER",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 1,240 files across 41 modules",
    "Parsed NestJS project structure, Nx workspace config, and Postgres migration set",
    "Built module dependency graph across 8 core services",
    "Extracted the Kanban status-machine pattern shared by contract-lifecycle-service, negotiation-redline-service, and clause-repository-service",
    "Traced the merge-field resolution path from template-engine-service through counterparty-registry-service",
    "Indexed synopsis-assistant-service's retrieval layer over the clause/template repository",
    "Generated Business Requirements",
    "Generated Product Requirements",
    "Generated High-Level Design",
    "Generated Data Flow Diagram",
    "Generated Low-Level Design across 41 modules",
    "Generated API Reference, Test Plan, and Test Cases",
    "Generated Traceability Matrix and Coverage report",
    "Generated Tutorial and Provenance record",
  ],
  documents: [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 12,
      sections: [
        {
          id: "1",
          title: "Executive Summary",
          level: 1,
          paragraphs: [
            "Contract Lifecycle Manager is the Contract Operations Platform team's system of record for the full agreement lifecycle — proposal generation, clause-level negotiation and redlining, e-signature, and post-signature obligation tracking — for a portfolio of roughly 2,100 contracts under management across 20 active counterparties. It replaced a workflow that lived across email threads, shared drives, and standalone Word documents, where a signed contract's negotiation history and the rationale behind specific clause changes were effectively unrecoverable six months after execution.",
            "The codebase spans approximately 118,000 lines of TypeScript across 41 modules — 8 core domain services, a shared ProseMirror-based rich-text/redlining kernel, a merge-field resolution engine, and a retrieval-backed LLM orchestration layer that powers the in-app \"Synopsis\" assistant. It is owned by the Contract Operations Platform team (10 engineers, embedded with Legal Ops) and runs as a set of independently deployable NestJS services behind a shared API gateway, backed by a single PostgreSQL cluster with a JSONB-based clause/version store.",
            "Since rollout, average time-to-signature has fallen from roughly 34 days to 11 days, driven primarily by collapsing proposal drafting, redlining, and signature routing into one system instead of three disconnected ones. The system was reverse-engineered directly from its source repository; this document set traces module boundaries, data flow, and API surface back to the actual code that implements them.",
          ],
        },
        {
          id: "2",
          title: "Module Architecture",
          level: 1,
          paragraphs: [
            "Eight core services carry the domain logic. Each owns a narrow slice of the contract lifecycle and communicates with its neighbors through typed internal APIs rather than shared database access, which is what let the redlining kernel and the merge-field engine evolve independently of the Kanban-board services that consume them.",
          ],
        },
        {
          id: "2.1",
          title: "contract-lifecycle-service",
          level: 2,
          paragraphs: [
            "Owns the Contracts board and its four-tab detail view (Overview, Documents, Related contracts, Payment milestones). It implements the contract status machine (Under negotiation → Ready for signature → E-signature pending → Signed) and the contract versioning model — a `Contract` has one or more `ContractVersion` rows, each carrying its own rich-text `content` and `primeChangeHistory` fields, addressable via `Contract Id`, `Version number`, and `Version brief`.",
          ],
        },
        {
          id: "2.2",
          title: "proposal-generation-service",
          level: 2,
          paragraphs: [
            "Generates a `Proposal` (Reference ID format `PROP-YYYY-NNNNN`) from a selected template by invoking template-engine-service's merge-field resolver against counterparty-registry-service and the contract's own metadata. Proposals carry a `Stage` field (e.g. \"Sent to 3rd party\") and expose an AI-assisted rewrite affordance backed by synopsis-assistant-service, plus a rendered-document download endpoint.",
          ],
        },
        {
          id: "2.3",
          title: "negotiation-redline-service",
          level: 2,
          paragraphs: [
            "Owns the Negotiation board (Initiated / Concluded / Inconclusive) and the clause-by-clause redlining workspace. A negotiation decomposes its source document into numbered `Section` and `Clause` records (e.g. Section-1 → Clause-1, Clause-2, Clause-3, \"Warranties and Representations Clause\"); each clause carries its own version history and a threaded comment stream, both scoped to the negotiation rather than the parent contract, so redline history never leaks across unrelated negotiations of the same template.",
          ],
        },
        {
          id: "2.4",
          title: "clause-repository-service",
          level: 2,
          paragraphs: [
            "Owns the reusable clause library (Draft / Approved / Archived) that negotiation-redline-service and template-engine-service both read from. Clauses are versioned independently of any contract or negotiation that references them, which is why promoting a clause from Draft to Approved does not retroactively change the text already embedded in in-flight negotiations — those keep the version they started with.",
          ],
        },
        {
          id: "2.5",
          title: "template-engine-service",
          level: 2,
          paragraphs: [
            "Owns the master template library (Mutual NDA, Non-Disclosure Agreement, Consulting Agreement, Commercial Lease Agreement, Purchase Agreement, Joint Venture Agreement, Software License Agreement, SOW Agreement, ILL-SLA) and the merge-field resolver — the component that turns unresolved placeholders like `${CompanyName}`, `${RegistryNo}`, `${Address}`, and `${AgreementPurpose}` into a fully rendered document at proposal-generation time. Unresolved fields fail generation rather than rendering blank, which is a deliberate design choice covered in the Feature Specification.",
          ],
        },
        {
          id: "2.6",
          title: "counterparty-registry-service",
          level: 2,
          paragraphs: [
            "Owns Contract Parties — the master directory of 20 active counterparties (Legal name, Short name, Jurisdiction country, Unique government identifier, Representative name) and their nested Bank accounts (Bank name, Account Number, IFSC Code, Branch Name, Account Type, a single Primary flag enforced at the service layer so a party can never end up with two accounts simultaneously marked primary).",
          ],
        },
        {
          id: "2.7",
          title: "esignature-integration-adapter",
          level: 2,
          paragraphs: [
            "Wraps the DocuSign Envelopes API. It is the only module permitted to transition a contract into E-signature pending or Signed — every other write path to `status` on the Contracts board is rejected at the service boundary, which closes off a class of bugs where a UI action could mark a contract Signed without an actual completed envelope behind it.",
          ],
        },
        {
          id: "2.8",
          title: "synopsis-assistant-service",
          level: 2,
          paragraphs: [
            "Powers the persistent \"Synopsis\" drawer that appears across Contracts, Negotiation, Repository, and Contract Parties. It builds a retrieval context from the current screen's entity and status (via `SynopsisContextBuilder`), pulls relevant clause/template repository content, and generates three sections on demand: Definitions & Key Concepts, Status to Action Guide, and Best Practices. It is read-only against the rest of the system — it has no write path into any domain table, which the security review flagged as a hard requirement given it is LLM-generated content.",
          ],
        },
        {
          id: "3",
          title: "Kanban Status-Machine Pattern",
          level: 1,
          paragraphs: [
            "Three boards — Contracts, Negotiation, and Clauses — share one underlying status-machine implementation (`KanbanStatusMachine<T>`), parameterized per-domain with its own valid states and transitions (Contracts: Under negotiation → Ready for signature → E-signature pending → Signed; Negotiation: Initiated → Concluded / Inconclusive; Clauses: Draft → Approved → Archived). This is why the three boards look and behave identically in the UI despite backing entirely different domain services — they render the same generic Kanban component against three different status-machine instances.",
            "A quirk inherited from a prior system migration: Negotiation records created before the migration retain the legacy identifier format `CTR-NNNNN` (e.g. `CTR-00008`) alongside post-migration records using `CNT-YYYY-NNNNN`. The status machine treats both formats identically, but reporting queries that parse the year out of the reference ID have an explicit fallback path for the legacy format.",
          ],
        },
        {
          id: "4",
          title: "Deployment & Scaling",
          level: 1,
          paragraphs: [
            "Each of the 8 services deploys independently on Kubernetes behind a shared API gateway. negotiation-redline-service is the most write-heavy path (clause comment threads and version history) and is the only service horizontally scaled beyond 2 replicas in production, currently running 5.",
          ],
        },
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 14,
      sections: [
        {
          id: "1",
          title: "Core Interfaces & Types",
          level: 1,
          paragraphs: [
            "`ClauseVersionStore` is the append-only store backing every clause, whether it lives in clause-repository-service's library or inline inside a negotiation. It never mutates a version in place — editing a clause creates a new `ClauseVersion` row pointing at the previous one, which is what makes the per-clause \"history\" icon in the redlining workspace a simple linked-list walk rather than a diff computed on demand.",
            "`MergeFieldResolver` accepts a template's raw content plus a resolution context (counterparty record, contract metadata, current date) and returns either a fully rendered document or a typed `UnresolvedFieldError` listing every placeholder it could not resolve. `NegotiationStatusMachine` and `SynopsisContextBuilder` are the two other interfaces most frequently touched — the former guards the Initiated/Concluded/Inconclusive transitions, the latter assembles the retrieval context synopsis-assistant-service reads before generating Definitions/Status-to-Action/Best-Practices content.",
          ],
        },
        {
          id: "2",
          title: "Database Schema",
          level: 1,
          paragraphs: [
            "Ten tables carry the domain: `contracts`, `contract_versions`, `proposals`, `counterparties`, `bank_accounts`, `negotiations`, `clauses`, `clause_versions`, `templates`, and `payment_milestones`. `contract_versions` and `clause_versions` are both append-only, foreign-keyed to their parent by ID rather than by (id, version) composite key, which keeps the version-history queries a single indexed lookup rather than a range scan.",
            "`bank_accounts` enforces \"only one primary per counterparty\" via a partial unique index on `(counterparty_id) WHERE is_primary = true` rather than application-level locking — a fix that shipped after a 2026 incident where two concurrent \"Add bank account\" submissions both marked their account primary under the old application-level check.",
          ],
        },
        {
          id: "3",
          title: "Legacy Identifier Migration",
          level: 1,
          paragraphs: [
            "The `CTR-NNNNN` → `CNT-YYYY-NNNNN` migration (documented in migration `0042_reference_id_backfill`) rewrote reference IDs for records created after the cutover but deliberately left pre-cutover records on the legacy format rather than forging a synthetic year into their ID. `negotiations.reference_id` therefore has a `CHECK` constraint accepting either pattern, and every query that needs to sort or filter by year runs through a shared `parseReferenceYear()` helper rather than string-slicing the ID directly.",
          ],
        },
        {
          id: "4",
          title: "Redlining Engine Internals",
          level: 1,
          paragraphs: [
            "The clause-by-clause workspace is built on a ProseMirror document schema custom-fitted to Section/Clause nesting (`section` and `clause` are first-class ProseMirror node types, not just heading-level conventions). Each clause node carries a stable `clauseId` attribute that survives reordering, which is what lets the comment thread and version-history icons stay attached to the correct clause even as earlier clauses in the same section are edited or renumbered.",
          ],
        },
      ],
    },
    {
      key: "brd",
      icon: "brd",
      title: "Business requirements",
      description: "Business goals, stakeholders, and functional requirements.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Business Goals",
          level: 1,
          paragraphs: [
            "The primary quantified goal was cutting average time-to-signature from roughly 34 days to under 11 days by replacing an email-and-Word-doc negotiation process with one system that generates proposals from approved templates, tracks every clause-level redline against the counterparty that requested it, and routes straight to DocuSign once both sides converge — removing the multi-day gaps that used to occur every time a redline had to be manually re-collated into a clean document for the next round.",
            "A secondary goal was closing a compliance gap: prior to this system, there was no reliable way to show an auditor which specific clause version was in force on a given contract at a given date, since negotiation history lived in email attachments that were rarely retained past the deal closing.",
          ],
        },
        {
          id: "2",
          title: "Stakeholders",
          level: 1,
          paragraphs: [
            "General Counsel and the VP of Legal Operations are the primary sponsors, using the Negotiation board and clause repository directly. The Procurement Director relies on Contract Parties and the vendor bank-account records for onboarding new suppliers. The Finance Controller reviews Payment milestones on active contracts to reconcile committed spend against what has actually been invoiced and paid.",
          ],
        },
        {
          id: "3",
          title: "Current State Pain Points",
          level: 1,
          paragraphs: [
            "Before this system, a redline round-trip meant emailing a Word document to a third-party negotiator, waiting for tracked changes to come back, and manually reconciling them against whatever the internal team had changed in parallel — a process with no single source of truth and no way to tell, months later, why a specific clause read the way it did.",
          ],
        },
      ],
    },
    {
      key: "prd",
      icon: "prd",
      title: "Product requirements",
      description: "Product scope, user stories, and acceptance criteria.",
      readMinutes: 10,
      sections: [
        {
          id: "1",
          title: "Scope",
          level: 1,
          paragraphs: [
            "In scope: proposal generation from templates, clause-level negotiation and redlining, contract versioning and status tracking, counterparty and bank-account master data, payment-milestone tracking, and the Synopsis contextual-assistance panel. Out of scope: invoicing and payment execution — payment milestones record what is owed and its approval state, but no money actually moves through this system.",
          ],
        },
        {
          id: "2",
          title: "User Stories & Acceptance Criteria",
          level: 1,
          paragraphs: [
            "As a Legal Operations analyst, I need every new Contract to require a unique Contract Id before I can save it, and I need the Reference ID auto-generated in the `CNT-YYYY-NNNNN` format so I never have to invent one by hand.",
            "As a negotiator, I need a contract's status to move Under negotiation → Ready for signature → E-signature pending → Signed strictly in that order — the system rejects any attempt to skip a stage, including from the API, not just the UI.",
            "As a Procurement analyst, when I add a second bank account for a counterparty and mark it Primary, the previously-primary account is automatically demoted — I should never end up with two accounts both showing \"Primary: Yes\".",
            "As a proposal author, when I generate a Proposal from a template with an unresolved merge field, generation must fail with a clear list of the missing fields rather than producing a document with literal `${...}` placeholders visible to the counterparty.",
            "As a reviewer, I need every clause in a negotiation to show its edit history and comment thread inline, scoped to that negotiation, so I can see exactly what changed and why without leaving the redlining workspace.",
          ],
        },
      ],
    },
    {
      key: "feature",
      icon: "feature",
      title: "Feature specification",
      description: "Feature behavior, inputs, outputs, and edge cases.",
      readMinutes: 13,
      sections: [
        {
          id: "1",
          title: "Clause-Level Redlining Workspace",
          level: 1,
          paragraphs: [
            "A negotiation's source document is decomposed into numbered Sections, each containing numbered Clauses. Every clause independently exposes a history icon (walking its `ClauseVersionStore` chain) and a comment icon (a threaded discussion scoped to that clause within that negotiation). Hiding a clause via the page-level redact control removes it from the downloadable export without deleting its version history — a distinction legal reviewers specifically requested after an early version accidentally destroyed redline history on redaction.",
          ],
        },
        {
          id: "2",
          title: "Merge-Field Resolution Engine",
          level: 1,
          paragraphs: [
            "Templates store their body as-is with unresolved `${FieldName}` placeholders. At proposal-generation time, `MergeFieldResolver` walks the template, resolves each placeholder against the selected counterparty record and the in-progress contract's own fields, and either returns a fully rendered document or a typed error naming every unresolved field. Generation is intentionally all-or-nothing — a partially rendered document with visible `${...}` tokens was the single most common support complaint before this fail-fast behavior shipped.",
          ],
        },
        {
          id: "3",
          title: "Synopsis Assistant",
          level: 1,
          paragraphs: [
            "On every Contracts, Negotiation, Repository, and Contract Parties screen, `SynopsisContextBuilder` assembles the current entity, its status, and relevant repository content, and synopsis-assistant-service generates three panels on demand: Definitions & Key Concepts (plain-English glossary for the terms visible on that screen), Status to Action Guide (what the current status means and the recommended next action — e.g. \"Initiated: negotiation has started and is under active discussion → review draft terms, assign a negotiator, track responses\"), and Best Practices. The service has no write access to any domain table — a deliberate constraint so LLM-generated guidance can never mutate contract data.",
          ],
        },
        {
          id: "4",
          title: "Payment Milestones Timeline",
          level: 1,
          paragraphs: [
            "Rendered as a vertical Start-to-End timeline on a contract's Payment milestones tab. Each milestone (e.g. \"Solution architecture approval\", \"Contract signing completion\") carries Amount, Currency, Reviewer, Approver, and a status of Fully paid or Partially paid. Milestones are ordered by date and are purely a tracking record — no payment execution happens inside this system, consistent with the scope boundary in the PRD.",
          ],
        },
      ],
    },
    {
      key: "api",
      icon: "api",
      title: "API reference",
      description: "Endpoints, payloads, authentication, and error contracts.",
      readMinutes: 12,
      sections: [
        {
          id: "1",
          title: "Authentication",
          level: 1,
          paragraphs: [
            "All endpoints require a bearer token issued by the platform's identity provider. synopsis-assistant-service's endpoints additionally require a scope claim distinguishing read-only Synopsis access from the broader domain-write scopes used elsewhere in the API.",
          ],
        },
        {
          id: "2",
          title: "Core Endpoints",
          level: 1,
          paragraphs: [
            "`GET /api/v1/contracts` and `GET /api/v1/contracts/{contractId}` — list and fetch contracts, including current status and version pointer.",
            "`POST /api/v1/contracts/{contractId}/versions` — create a new contract version with `versionNumber`, `versionBrief`, `content`, and `primeChangeHistory`.",
            "`GET /api/v1/negotiations/{id}/clauses` — fetch the section/clause tree for a negotiation, including per-clause version and comment counts.",
            "`POST /api/v1/proposals/{id}/generate` — resolve merge fields against a template and counterparty, returning the rendered document or an `UnresolvedFieldError` list.",
            "`POST /api/v1/counterparties/{id}/bank-accounts` — add a bank account; setting `isPrimary: true` atomically demotes any existing primary account.",
            "`POST /api/v1/contracts/{contractId}/esignature/send` — hands the current version to esignature-integration-adapter, which is the only path allowed to move status into E-signature pending.",
            "`GET /api/v1/synopsis?entityType=contract&entityId=...` — returns the three Synopsis panels for the given entity; read-only, no side effects.",
          ],
        },
      ],
    },
    {
      key: "testplan",
      icon: "testplan",
      title: "Test plan",
      description: "Test scenarios, coverage targets, and validation steps.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Test Strategy",
          level: 1,
          paragraphs: [
            "Unit tests target the status machines, merge-field resolver, and clause versioning logic in isolation; integration tests cover the proposal-generation-through-esignature path against a seeded Postgres instance; a smaller set of end-to-end tests exercises the redlining workspace's comment/history interactions.",
          ],
        },
        {
          id: "2",
          title: "Coverage Targets",
          level: 1,
          paragraphs: [
            "Core domain logic (status machines, merge-field resolution, clause versioning) targets 90%+ statement coverage; the Synopsis retrieval layer, which depends on an external LLM call, is covered primarily through contract tests against a mocked provider rather than high-percentage unit coverage.",
          ],
        },
      ],
    },
    {
      key: "testcases",
      icon: "testcases",
      title: "Test cases",
      description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Merge-Field & Proposal Generation Cases",
          level: 1,
          paragraphs: [
            "TC-MERGE-014: Proposal generation fails fast when a required merge field has no resolver — generating from the Mutual NDA template without a counterparty's `RegistryNo` populated returns an `UnresolvedFieldError` listing that field, not a rendered document with a blank or literal placeholder.",
            "TC-MERGE-019: Generating a Proposal from a fully-populated counterparty and contract produces a document with zero remaining `${...}` tokens, verified via a post-render regex scan.",
          ],
        },
        {
          id: "2",
          title: "Negotiation & Redlining Cases",
          level: 1,
          paragraphs: [
            "TC-NEG-022: Clause comment thread persists across negotiation status transition — adding a comment to Clause-3 while a negotiation is Initiated, then moving the negotiation to Concluded, still shows that comment on Clause-3 afterward.",
            "TC-NEG-031: Hiding a clause via the redact control removes it from the exported document but its `ClauseVersionStore` history remains queryable via the API.",
          ],
        },
        {
          id: "3",
          title: "Negative Cases",
          level: 1,
          paragraphs: [
            "TC-STATUS-007: A direct API call attempting to set a contract's status to Signed while it is still Under negotiation is rejected with a 422, since only esignature-integration-adapter's webhook handler may perform that transition.",
            "TC-BANK-004: Submitting a second bank account for a counterparty with `isPrimary: true` automatically flips the previously-primary account's flag to false in the same transaction — verified with a concurrent-submission test that previously exposed the pre-fix race condition.",
          ],
        },
      ],
    },
    {
      key: "dataflow",
      icon: "dataflow",
      title: "Data flow",
      description: "Data movement across services, stores, and integrations.",
      readMinutes: 7,
      sections: [
        {
          id: "1",
          title: "Primary Data Path",
          level: 1,
          paragraphs: [
            "A template is selected → template-engine-service resolves merge fields against counterparty-registry-service and contract metadata → a Proposal is generated and, once accepted, becomes the source document for a Negotiation → negotiation-redline-service decomposes it into Sections/Clauses for redlining, with each edit appended to `clause_versions` → once concluded, esignature-integration-adapter hands the final version to DocuSign → the signed-envelope webhook activates the Contract and schedules its Payment milestones.",
          ],
        },
      ],
    },
    {
      key: "traceability",
      icon: "traceability",
      title: "Traceability matrix",
      description: "Mapping from requirements to design, code, and tests.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Coverage Mapping",
          level: 1,
          paragraphs: [
            "FR-1 (contract status transitions are strictly ordered) → contract-lifecycle-service, esignature-integration-adapter → TC-STATUS-007.",
            "FR-2 (proposal generation never emits unresolved merge fields) → template-engine-service → TC-MERGE-014, TC-MERGE-019.",
            "FR-3 (clause history and comments persist independent of negotiation status) → negotiation-redline-service → TC-NEG-022, TC-NEG-031.",
            "FR-4 (only one primary bank account per counterparty) → counterparty-registry-service → TC-BANK-004.",
            "FR-5 (Synopsis panel never writes to domain data) → synopsis-assistant-service → covered via contract tests against the mocked LLM provider.",
          ],
        },
      ],
    },
    {
      key: "coverage",
      icon: "coverage",
      title: "Coverage",
      description: "Documentation and code coverage across the codebase.",
      readMinutes: 5,
      sections: [
        {
          id: "1",
          title: "Summary",
          level: 1,
          paragraphs: [
            "contract-lifecycle-service and negotiation-redline-service — the two most heavily-tested modules given their status-machine guarantees — sit at 93% and 91% statement coverage respectively. template-engine-service's merge-field resolver is at 96%. synopsis-assistant-service is lower at 68%, consistent with its dependence on an external LLM call being tested primarily through contract tests rather than exhaustive unit coverage.",
          ],
        },
      ],
    },
    {
      key: "summary",
      icon: "summary",
      title: "Generation summary",
      description: "Summarizes what is covered across all related documents in a single consolidated view.",
      readMinutes: 4,
      sections: [
        {
          id: "1",
          title: "What Was Generated",
          level: 1,
          paragraphs: [
            "This pass produced 14 documents covering architecture, requirements, API surface, test strategy, and a getting-started tutorial, derived from static analysis of Contract Lifecycle Manager's 41 modules and roughly 118,000 lines of TypeScript across 8 core services.",
          ],
        },
      ],
    },
    {
      key: "provenance",
      icon: "provenance",
      title: "Provenance",
      description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
      readMinutes: 5,
      sections: [
        {
          id: "1",
          title: "Generation Trail",
          level: 1,
          paragraphs: [
            "Every document links back to the repository commit, the specific module directories analyzed (contract-lifecycle-service, proposal-generation-service, negotiation-redline-service, clause-repository-service, template-engine-service, counterparty-registry-service, esignature-integration-adapter, synopsis-assistant-service), and the analysis pass that produced it, so any claim in this documentation set can be traced back to source.",
          ],
        },
      ],
    },
    {
      key: "tutorial",
      icon: "tutorial",
      title: "Tutorial",
      description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Getting Started",
          level: 1,
          paragraphs: [
            "Clone the repository, run `docker-compose up` to start PostgreSQL, then `npm install && npm run start:dev` to boot the NestJS services locally. Run the seed script to populate sample counterparties, clause-library entries, and the 9 master templates.",
          ],
        },
        {
          id: "2",
          title: "Generating a Sample Proposal",
          level: 1,
          paragraphs: [
            "Pick the Mutual Non-Disclosure Agreement template, select a seeded counterparty, and call `POST /api/v1/proposals` — this exercises the full merge-field resolution path end to end and is the fastest way to confirm a local setup is wired correctly before touching the redlining workspace.",
          ],
        },
      ],
    },
  ],
};
