import type { DocumentGalleryData } from "../types";

export const billingRatingEngineDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/billing-rating-engine",
  repoName: "BILLINGRATINGENGINE",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 142,318 LOC across 37 modules, Java 17 / Spring Boot 3 (Gradle multi-module)",
    "Parsed build configuration — 9 deployable services, 4 shared libraries, Kafka + PostgreSQL dependencies detected",
    "Built module dependency graph — rating-engine-core referenced by 6 downstream modules",
    "Extracted event-driven architecture — usage-ingestion-consumer to invoice-generation-service via 3 Kafka topics",
    "Generated Business Requirements — 4 stakeholder groups, 6 quantified goals identified",
    "Generated Product Requirements — 5 user stories with acceptance criteria extracted from controller/validator logic",
    "Generated High-Level Design — 8 core modules, deployment topology across 6 Kubernetes nodes",
    "Generated Data Flow Diagram — usage.events.raw through invoice.line_items to nightly aggregation job",
    "Generated Low-Level Design — RatingRuleEvaluator, PlanRateResolver, InvoiceAggregationJob classes documented",
    "Generated API Reference — 9 REST endpoints across rate-plan, invoice, and usage-ingestion controllers",
    "Generated Test Plan and 22 Test Cases — 96% coverage on rating-engine-core, 88% on invoice-generation-service",
    "Generated Traceability Matrix and Coverage report — 5 requirements mapped to module and test case",
    "Generated Tutorial and Provenance record — local dev environment and generation trail",
  ],
  documents: [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Executive Summary",
          level: 1,
          paragraphs: [
            "Billing Rating Engine is the system of record for rating and invoicing telecom subscriber usage across the operator's postpaid, prepaid, enterprise, IoT, roaming, and family plan portfolios. It rates approximately 2.1 million usage events per day — voice minutes, SMS, data, and roaming — against 18 configured rate plans (11 currently Active, 4 in Draft pending commercial sign-off, 3 Retired but retained for historical invoice reproduction), and produces roughly 94,000 invoices per month across a subscriber base of around 340,000 accounts.",
            "The codebase spans 142,318 lines of Java 17 across 37 Gradle modules — 9 independently deployable Spring Boot 3 services and 4 shared libraries (domain model, currency/money utilities, Kafka schema registry client, and audit logging). It is owned by the Billing Platform Engineering team (9 engineers, one on-call rotation) and runs on a dedicated Kubernetes namespace, auto-scaled across 6 nodes during nightly billing-cycle close.",
            "The system was reverse-engineered directly from its source repository. Static analysis traced the full request lifecycle — from raw usage-event ingestion through rating, invoice line-item aggregation, and dunning notification — to produce this documentation set without relying on out-of-date wiki pages or tribal knowledge.",
          ],
        },
        {
          id: "2",
          title: "Architecture Overview",
          level: 1,
          paragraphs: [
            "The system follows an event-driven microservices architecture built around Kafka as the backbone between usage ingestion and rating, with PostgreSQL as the system of record for rate plans, invoices, and line items. Eight core modules were identified as carrying the majority of business logic; the remaining 29 modules are supporting libraries, database migration modules (Flyway), integration adapters, and test-fixture packages.",
          ],
        },
        {
          id: "2.1",
          title: "rating-engine-core",
          level: 2,
          paragraphs: [
            "Package com.telco.billing.rating.core. Owns the rating algorithm: resolves the applicable rate plan for a subscriber at the moment of usage, applies time-of-day banding and per-unit rates (perMinuteRate, dataRate), and emits a rated usage-charge record. This module has no outbound HTTP dependencies and is designed to be horizontally scaled as a stateless Kafka consumer group.",
          ],
        },
        {
          id: "2.2",
          title: "plan-configuration-service",
          level: 2,
          paragraphs: [
            "Package com.telco.billing.plan. Owns the Rate Plan lifecycle — planName, planCode, baseRate, perMinuteRate, dataRate, currency, effectiveDate, and status (Active / Draft / Retired). Exposes the /api/v1/rate-plans REST surface and publishes plan-change events consumed by rating-engine-core to refresh its in-memory rate cache within 30 seconds of a change.",
          ],
        },
        {
          id: "2.3",
          title: "invoice-generation-service",
          level: 2,
          paragraphs: [
            "Package com.telco.billing.invoice. Aggregates rated usage-charge records by subscriberId and billingPeriod into invoice line items, applies plan base rates and proration, and produces the invoiceNumber, amount, dueDate, and status (Paid / Pending / Overdue / Disputed) that drive the Invoices table exposed in the operational dashboard.",
          ],
        },
        {
          id: "2.4",
          title: "usage-ingestion-consumer, payment-gateway-adapter, dunning-notification-service",
          level: 2,
          paragraphs: [
            "usage-ingestion-consumer normalizes inbound CDRs (call detail records) from the switching fabric into the internal UsageEvent schema and publishes to the usage.events.raw topic. payment-gateway-adapter integrates with the operator's PCI-scoped payment processor to reconcile Paid status transitions. dunning-notification-service watches for invoices crossing the 30-day-overdue threshold and triggers subscriber-care notification workflows.",
          ],
        },
        {
          id: "3",
          title: "Event-Driven Processing Flow",
          level: 1,
          paragraphs: [
            "A usage event enters through usage-ingestion-consumer, is published to usage.events.raw, and is picked up by rating-engine-core, which resolves the subscriber's active rate plan via plan-configuration-service's cached rate table and emits a rated charge to usage.events.rated. invoice-generation-service consumes rated charges continuously and aggregates them into open invoice_line_items rows for the current billing period; a nightly InvoiceAggregationJob closes the billing cycle, finalizes invoice totals, and transitions each invoice to Pending.",
            "This pipeline processes the full daily volume (approximately 2.1M events) with a p99 end-to-end rating latency of 840ms from ingestion to rated-charge persistence, based on the load-test fixtures found in the repository's performance test suite.",
          ],
        },
        {
          id: "4",
          title: "Deployment & Scaling",
          level: 1,
          paragraphs: [
            "All 9 services deploy as independent containers on a dedicated Kubernetes namespace (billing-platform), auto-scaled from a baseline of 6 nodes up to 14 during the nightly billing-cycle close window (typically 01:00–03:30 local time) when InvoiceAggregationJob and dunning-notification-service run their heaviest batch workloads. rating-engine-core and usage-ingestion-consumer scale independently via Kafka consumer-group partition count (24 partitions on usage.events.raw).",
          ],
        },
        {
          id: "5",
          title: "Key Design Decisions",
          level: 1,
          paragraphs: [
            "Rate plan changes are versioned rather than mutated in place — retiring a plan (Retired status) never deletes its row, since historical invoices must remain reproducible from the exact rate configuration in effect on their billing date. This is why the Rate Plans table retains 3 Retired entries alongside 11 Active and 4 Draft plans rather than purging them.",
            "Currency is handled per-plan (USD, EUR, GBP, and INR are all represented in the current plan set) rather than normalized to a single base currency at rating time, avoiding FX-rate drift between when a plan was priced and when a subscriber is billed.",
          ],
        },
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 12,
      sections: [
        {
          id: "1",
          title: "Module Breakdown",
          level: 1,
          paragraphs: [
            "Each of the 8 core modules exposes a narrow public interface backed by an internal implementation package, so callers depend on contracts (RatingService, PlanRepository, InvoiceAggregator) rather than concrete classes. This was enforced consistently enough across the codebase that dependency inversion was inferred with high confidence during static analysis.",
          ],
        },
        {
          id: "1.1",
          title: "RatingRuleEvaluator",
          level: 2,
          paragraphs: [
            "com.telco.billing.rating.core.RatingRuleEvaluator is the entry point for rating a single UsageEvent. It delegates rate resolution to PlanRateResolver, applies time-of-day banding (peak / off-peak multipliers configured per plan), and returns a RatedCharge value object with the resolved unit rate, quantity, and computed amount. It is a pure function with no side effects, which the repository's test suite exploits heavily — 41 of the 63 unit tests in rating-engine-core target this single class.",
          ],
        },
        {
          id: "1.2",
          title: "PlanRateResolver",
          level: 2,
          paragraphs: [
            "com.telco.billing.plan.PlanRateResolver looks up the applicable Rate Plan by subscriber's assigned planCode and usage type (voice / data / sms), filtered to status = Active as of the usage event's timestamp. It is backed by an in-memory cache (Caffeine, 30-second TTL) refreshed by plan-change events from plan-configuration-service, avoiding a database round-trip on the hot rating path.",
          ],
        },
        {
          id: "1.3",
          title: "InvoiceAggregationJob",
          level: 2,
          paragraphs: [
            "com.telco.billing.invoice.batch.InvoiceAggregationJob is a Spring Batch job scheduled nightly at 01:00. It groups all invoice_line_items rows for subscribers whose billing cycle closes that day, sums them into a final invoice amount, generates the invoiceNumber (format INV-{year}-{sequence}), sets dueDate to 15 days out, and transitions the invoice to Pending. It processes the full monthly volume (≈94,000 invoices) in a rolling nightly batch of roughly 3,100 invoices/night across a 30-day billing cycle spread.",
          ],
        },
        {
          id: "2",
          title: "Rating Algorithm",
          level: 1,
          paragraphs: [
            "Rate resolution proceeds in three steps: (1) resolve the subscriber's active plan via PlanRateResolver, (2) select the applicable per-unit rate field on that plan (perMinuteRate for voice, dataRate for data, a fixed SMS rate configured separately) based on the UsageEvent's type, and (3) apply the plan's baseRate as a recurring monthly charge independent of usage, added once per billing cycle rather than per event.",
            "Enterprise plans (Enterprise Fleet 100, Enterprise Fleet 500) use volume-tiered perMinuteRate values that are deliberately near-zero (0.01) since the baseRate is structured to cover expected usage — the rating engine still evaluates and records these near-zero charges per event for audit completeness, even though they contribute negligibly to the final invoice total.",
        ],
        },
        {
          id: "3",
          title: "Data Access Layer & Schema",
          level: 1,
          paragraphs: [
            "Persistence is centralized behind a repository layer (Spring Data JPA) over four primary PostgreSQL tables: rate_plans (planName, planCode, baseRate, perMinuteRate, dataRate, currency, effectiveDate, status), invoices (invoiceNumber, subscriberId, planName, amount, billingPeriod, dueDate, status), invoice_line_items (foreign key to invoices, usage type, quantity, unit rate, computed amount), and usage_records (raw ingested events, retained 90 days for dispute investigation before archival to cold storage).",
            "Query logic is isolated from business logic — RatingRuleEvaluator and InvoiceAggregationJob never issue SQL directly, only through repository interfaces — which the codebase's test suite validates by mocking repositories in unit tests and only hitting real PostgreSQL (via Testcontainers) in the integration test tier.",
          ],
        },
        {
          id: "4",
          title: "Error Handling",
          level: 1,
          paragraphs: [
            "Errors are normalized to a small set of typed exceptions (RatePlanNotFoundException, InvalidUsageEventException, InvoiceAggregationException) at the module boundary, translated to the appropriate HTTP response by a shared @ControllerAdvice handler. A rate plan lookup that finds no Active plan for a subscriber does not silently drop the usage event — it is routed to a dead-letter topic (usage.events.unrated) for manual review, currently averaging under 0.02% of daily volume.",
          ],
        },
      ],
    },
    {
      key: "brd",
      icon: "brd",
      title: "Business requirements",
      description: "Business goals, stakeholders, and functional requirements.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Business Goals",
          level: 1,
          paragraphs: [
            "Reduce invoice dispute resolution time from an estimated 3.2 days to under 4 hours by giving Billing Ops full rating-rule traceability per invoice line item — the current 1 Disputed invoice in the active set (INV-2026-04819) can be traced back to its exact rate plan, effective date, and per-unit rate without a manual database query.",
            "Cut Overdue invoice volume, currently running at roughly 3 of every 20 active invoices in a given billing period, through automated dunning-notification-service escalation at the 30-day threshold rather than the previous manual weekly review process.",
            "Support multi-currency plan pricing (USD, EUR, GBP, INR are all live in production today) as the operator expands roaming partnerships, without requiring a separate billing stack per region.",
          ],
        },
        {
          id: "2",
          title: "Stakeholders",
          level: 1,
          paragraphs: [
            "VP Revenue Operations — owns the P&L impact of billing accuracy and overdue collections; the primary consumer of the Monthly Recurring Revenue and Overdue Invoices dashboard metrics.",
            "Billing Ops Manager — day-to-day owner of the Rate Plans and Invoices tables; approves new plan launches and resolves Disputed invoices.",
            "Finance Controller — relies on the system as the source of truth for revenue recognition; requires the Retired-plan retention behavior described in the High-Level Design to reproduce historical invoices during audits.",
            "Subscriber Care Director — consumes dunning-notification-service events to staff the collections and retention teams ahead of invoice due dates.",
          ],
        },
        {
          id: "3",
          title: "Current State Problems",
          level: 1,
          paragraphs: [
            "Prior to this system's current architecture, rate plan changes required a deployment to take effect, meaning commercial teams could not launch a new plan (like the 4 currently in Draft status) without engineering involvement. plan-configuration-service's cache-refresh-on-event design directly addresses this by making plan activation a data change, not a code change.",
          ],
        },
        {
          id: "4",
          title: "Success Metrics",
          level: 1,
          paragraphs: [
            "Rating accuracy: less than 0.02% of usage events routed to the unrated dead-letter topic. Invoice dispute rate: under 5% of monthly invoice volume. Dunning effectiveness: percentage of Overdue invoices resolved within 10 days of the first dunning notification, currently tracked but not yet targeted in this release.",
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
            "In scope: Rate Plan CRUD and lifecycle management (Active / Draft / Retired), usage-event rating, invoice generation and lifecycle management (Paid / Pending / Overdue / Disputed), and the operational dashboard surfaced through the Billing Rating Engine preview application (Rate Plans and Invoices record views, plus the Monthly Recurring Revenue, Active Rate Plans, Overdue Invoices, and Avg. Invoice Value dashboard tiles).",
          ],
        },
        {
          id: "2",
          title: "User Stories & Acceptance Criteria",
          level: 1,
          paragraphs: [
            "Extracted from controller and validator logic across plan-configuration-service and invoice-generation-service.",
          ],
        },
        {
          id: "2.1",
          title: "Story: Launch a new Rate Plan",
          level: 2,
          paragraphs: [
            "As a Billing Ops Manager, I need to create a Rate Plan with planName, planCode, baseRate, perMinuteRate, currency, and effectiveDate so it can be assigned to subscribers. Given a plan submitted with a negative perMinuteRate, when the create request is validated, then the API rejects it with a 400 and field-level error (see TC-RTP-014) rather than persisting an invalid rate.",
          ],
        },
        {
          id: "2.2",
          title: "Story: Retire a Rate Plan without breaking history",
          level: 2,
          paragraphs: [
            "As a Finance Controller, I need retiring a plan to preserve its historical rate data so prior invoices remain reproducible. Given a plan transitioned to Retired status, when an auditor requests the invoice history for a subscriber previously on that plan, then the original baseRate and perMinuteRate at the time of billing are still resolvable (see TC-RTP-019).",
          ],
        },
        {
          id: "2.3",
          title: "Story: Dispute an invoice",
          level: 2,
          paragraphs: [
            "As a Subscriber Care agent, I need to mark an invoice Disputed and see the rate plan and per-unit rates that produced its amount. Given invoice INV-2026-04819 is marked Disputed, when Billing Ops reviews it, then the system surfaces the exact planName and effective rates used at aggregation time (see TC-INV-031).",
          ],
        },
        {
          id: "2.4",
          title: "Story: Escalate an overdue invoice",
          level: 2,
          paragraphs: [
            "As dunning-notification-service, when an invoice's dueDate passes 30 days without a Paid transition, I need to automatically transition it to Overdue and trigger a subscriber-care notification (see TC-INV-027).",
          ],
        },
        {
          id: "3",
          title: "Out of Scope",
          level: 1,
          paragraphs: [
            "Payment capture itself (owned by the external PCI-scoped payment processor, integrated read-only via payment-gateway-adapter), tax calculation (handled by a separate tax-engine service not covered by this repository), and subscriber self-service billing UI (owned by a separate customer-portal repository).",
          ],
        },
      ],
    },
    {
      key: "feature",
      icon: "feature",
      title: "Feature specification",
      description: "Feature behavior, inputs, outputs, and edge cases.",
      readMinutes: 10,
      sections: [
        {
          id: "1",
          title: "Rating Computation",
          level: 1,
          paragraphs: [
            "For every UsageEvent, RatingRuleEvaluator resolves the subscriber's Active plan, selects the matching per-unit rate (perMinuteRate, dataRate, or a fixed SMS rate), applies any time-of-day banding, and persists a RatedCharge. The plan's baseRate is applied once per billing cycle by invoice-generation-service, not per usage event — a Postpaid Unlimited Plus subscriber with a $45.00 baseRate and $0.00 perMinuteRate/dataRate is charged the flat $45.00 regardless of usage volume, while a Prepaid Daily Saver subscriber ($2.00 base, $0.10/min, $5.00/GB) accrues usage-based charges on top of the base.",
          ],
        },
        {
          id: "2",
          title: "Mid-Cycle Plan Changes & Proration",
          level: 1,
          paragraphs: [
            "When a subscriber changes plans mid-billing-cycle, invoice-generation-service prorates the baseRate of both the old and new plan by the number of days each was active within the cycle, using the plan's effectiveDate as the proration boundary. Usage-based charges (perMinuteRate, dataRate) are never prorated — each individual usage event is rated against whichever plan was Active at the moment it occurred.",
          ],
        },
        {
          id: "3",
          title: "Multi-Currency Handling",
          level: 1,
          paragraphs: [
            "Each Rate Plan carries its own currency (USD, EUR, GBP, or INR observed in current plan data — e.g. Roaming EU Pass in EUR, Senior Connect Basic in GBP, Legacy Prepaid Classic in INR). Invoices inherit the currency of the plan they were rated against; the system does not perform cross-currency conversion at invoice time, avoiding FX-rate drift between pricing and billing.",
          ],
        },
        {
          id: "4",
          title: "Dispute & Adjustment Workflow",
          level: 1,
          paragraphs: [
            "Marking an invoice Disputed freezes it from further automated dunning escalation while preserving its line-item detail for Billing Ops review. Resolution requires an explicit status transition back to Pending, Paid, or (for confirmed billing errors) a credit adjustment recorded against the original invoice rather than a silent amount edit, preserving the audit trail referenced in the Provenance document.",
          ],
        },
      ],
    },
    {
      key: "api",
      icon: "api",
      title: "API reference",
      description: "Endpoints, payloads, authentication, and error contracts.",
      readMinutes: 13,
      sections: [
        {
          id: "1",
          title: "Authentication",
          level: 1,
          paragraphs: [
            "All endpoints require a bearer token issued by the platform's identity provider (OAuth2 client-credentials for service-to-service calls, OIDC for interactive Billing Ops sessions). Unauthenticated requests receive a 401 with a standard error envelope; requests missing the billing:write scope on mutating endpoints receive a 403.",
          ],
        },
        {
          id: "2",
          title: "Rate Plan Endpoints",
          level: 1,
          paragraphs: [
            "GET /api/v1/rate-plans — lists rate plans, filterable by status (Active/Draft/Retired) and currency; supports pagination. Returns planName, planCode, baseRate, perMinuteRate, dataRate, currency, effectiveDate, and status per row.",
            "POST /api/v1/rate-plans — creates a plan. Requires planName, planCode, baseRate, perMinuteRate, currency, effectiveDate; validates perMinuteRate and baseRate are non-negative and planCode is unique. New plans default to Draft status.",
            "PATCH /api/v1/rate-plans/{planCode} — updates a plan or transitions its status (e.g. Draft → Active). Transitioning to Retired is one-way and triggers the historical-rate-preservation path described in the Low-Level Design.",
            "GET /api/v1/rate-plans/{planCode}/history — returns the full versioned rate history for a plan code, including retired predecessor entries, used by Finance during audit reconciliation.",
          ],
        },
        {
          id: "3",
          title: "Invoice Endpoints",
          level: 1,
          paragraphs: [
            "GET /api/v1/invoices — lists invoices, filterable by status, subscriberId, or billingPeriod. Returns invoiceNumber, subscriberId, planName, amount, billingPeriod, dueDate, and status.",
            "GET /api/v1/invoices/{invoiceNumber} — returns full invoice detail including the constituent invoice_line_items with per-line usage type, quantity, and applied rate.",
            "POST /api/v1/invoices/{invoiceNumber}/dispute — transitions an invoice to Disputed and freezes it from dunning escalation; requires a reason code in the request body.",
            "POST /api/v1/invoices/{invoiceNumber}/payment — records a payment event from payment-gateway-adapter, transitioning the invoice to Paid on full settlement.",
          ],
        },
        {
          id: "4",
          title: "Usage Ingestion Endpoint",
          level: 1,
          paragraphs: [
            "POST /api/v1/usage-events — accepts a batch of raw usage events (voice/data/sms) from usage-ingestion-consumer's upstream CDR feed; this is the highest-throughput endpoint in the system, sustaining the full 2.1M events/day volume in production. Malformed events are rejected per-item within the batch rather than failing the whole batch, with rejected items routed to usage.events.unrated.",
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
            "Testing is layered: unit tests around RatingRuleEvaluator and PlanRateResolver business logic (no I/O), integration tests around the repository layer using Testcontainers PostgreSQL and an embedded Kafka broker, and a smaller set of end-to-end tests that run the full ingest-to-invoice pipeline against seeded rate plan and subscriber fixtures.",
          ],
        },
        {
          id: "2",
          title: "Coverage Targets",
          level: 1,
          paragraphs: [
            "rating-engine-core targets and currently achieves 96% line coverage, reflecting its role as the highest-risk module (a rating bug directly misstates revenue). invoice-generation-service sits at 88%, with the InvoiceAggregationJob batch orchestration logic being the primary coverage gap, currently tracked as tech debt. Peripheral reporting-export-service and audit-trail-service sit at 61% and 54% respectively, consistent with their lower change frequency.",
          ],
        },
        {
          id: "3",
          title: "Environments",
          level: 1,
          paragraphs: [
            "CI runs unit and integration tiers on every pull request against ephemeral Testcontainers instances. A nightly job re-runs the full end-to-end tier against a staging environment seeded with a 5% sample of anonymized production-shaped rate plan and invoice data.",
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
          title: "Rate Plan Test Cases",
          level: 1,
          paragraphs: [
            "TC-RTP-014: Reject rate plan creation with negative perMinuteRate — POST /api/v1/rate-plans with perMinuteRate: -0.05 returns 400 with field error on perMinuteRate; no row persisted.",
            "TC-RTP-016: Reject duplicate planCode — creating a second plan with planCode PPU-PLUS-24 returns 409 Conflict.",
            "TC-RTP-019: Retired plan preserves historical rate for invoice reproduction — retiring Legacy 3G Talk Only (LEG-3G-19) and then requesting GET /api/v1/rate-plans/LEG-3G-19/history still returns its original baseRate ($9.99) and perMinuteRate ($0.03).",
            "TC-RTP-022: Draft plan is excluded from PlanRateResolver lookup — a usage event for a subscriber whose only assigned plan is Draft status routes to the usage.events.unrated dead-letter topic rather than rating against an unapproved plan.",
          ],
        },
        {
          id: "2",
          title: "Invoice Test Cases",
          level: 1,
          paragraphs: [
            "TC-INV-027: Overdue invoice triggers dunning notification after 30 days — an invoice with dueDate 30 days in the past and status Pending is transitioned to Overdue by the nightly job and a notification event is published to dunning.notifications.",
            "TC-INV-031: Disputed invoice retains original line-item rate detail — marking INV-2026-04819 Disputed does not mutate its invoice_line_items rows; GET /api/v1/invoices/INV-2026-04819 still returns the original Family Share 4-Line rate breakdown.",
            "TC-INV-034: Mid-cycle plan change prorates base rate correctly — a subscriber switching from Postpaid Essential ($25.00 base) to Postpaid Unlimited Plus ($45.00 base) exactly 10 days into a 30-day cycle produces a prorated base charge of $25.00 × 10/30 + $45.00 × 20/30, verified to the cent.",
            "TC-INV-038: Enterprise Fleet invoice aggregates near-zero per-minute charges without rounding loss — 1,200 rated events at $0.01/min on Enterprise Fleet 100 sum to exactly $12.00 in the final invoice, verified against floating-point rounding drift.",
          ],
        },
        {
          id: "3",
          title: "Negative & Edge Cases",
          level: 1,
          paragraphs: [
            "TC-EDGE-004: Usage event for a subscriber with no assigned plan is routed to usage.events.unrated rather than dropped or rated at a default rate.",
            "TC-EDGE-009: Currency mismatch between a subscriber's payment method and their plan's currency (e.g. a USD-denominated payment against a Roaming EU Pass invoice in EUR) is rejected by payment-gateway-adapter rather than silently converted.",
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
            "usage-ingestion-consumer receives raw CDRs, normalizes them into the internal UsageEvent schema, and publishes to Kafka topic usage.events.raw (24 partitions). rating-engine-core consumes this topic, resolves the rate via PlanRateResolver's cached lookup against plan_configuration_service's rate table, and publishes a RatedCharge to usage.events.rated. invoice-generation-service consumes rated charges continuously, writing rows into the invoice_line_items table keyed by subscriberId and the current open billingPeriod.",
          ],
        },
        {
          id: "2",
          title: "Billing Cycle Close",
          level: 1,
          paragraphs: [
            "Nightly at 01:00, InvoiceAggregationJob reads all open invoice_line_items for subscribers whose cycle closes that day, sums them into a finalized invoices row (amount, dueDate = +15 days, status = Pending), and archives the constituent line items as immutable. payment-gateway-adapter later updates status to Paid on settlement; if dueDate passes without payment, dunning-notification-service transitions the row to Overdue and emits a notification event consumed by the Subscriber Care team's outreach tooling.",
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
            "REQ-001 (Reject invalid rate plan input) → plan-configuration-service / PlanValidator → TC-RTP-014, TC-RTP-016.",
            "REQ-002 (Preserve historical rates on plan retirement) → plan-configuration-service versioned-storage design (High-Level Design, section 5) → TC-RTP-019.",
            "REQ-003 (Rate usage against time-correct plan) → rating-engine-core / PlanRateResolver → TC-RTP-022, TC-INV-034.",
            "REQ-004 (Escalate overdue invoices automatically) → dunning-notification-service → TC-INV-027.",
            "REQ-005 (Preserve dispute audit trail) → invoice-generation-service line-item immutability → TC-INV-031.",
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
            "rating-engine-core: 96% line coverage, fully documented. invoice-generation-service: 88% line coverage, InvoiceAggregationJob batch orchestration flagged as a coverage gap. plan-configuration-service: 91%. usage-ingestion-consumer: 84%. payment-gateway-adapter and dunning-notification-service: 79% and 76% respectively, reflecting their dependency on external integration mocking. reporting-export-service and audit-trail-service: 61% and 54%, consistent with lower change frequency and lower business-logic density.",
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
            "This pass produced 14 documents covering architecture (8 core modules across 37 total), business and product requirements (6 quantified goals, 4 user stories), a 9-endpoint API reference, a test plan with 22 concrete test cases and per-module coverage figures, a traceability matrix mapping 5 requirements through design to tests, and a getting-started tutorial — all derived from static analysis of Billing Rating Engine's 142,318-line Java 17 / Spring Boot 3 codebase.",
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
            "Every document links back to the repository at github.com/codesingularity/billing-rating-engine, the specific module paths analyzed (com.telco.billing.rating.core, com.telco.billing.plan, com.telco.billing.invoice, and 34 others), and the Gradle build graph used to resolve inter-module dependencies. The rating algorithm description in the Low-Level Design was extracted directly from RatingRuleEvaluator and PlanRateResolver; the API reference was extracted from the @RestController and @RequestMapping annotations across the 9 deployable services; the test case IDs referenced throughout (TC-RTP-*, TC-INV-*, TC-EDGE-*) correspond one-to-one with test methods found in the repository's src/test tree.",
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
            "Clone the repository and run docker-compose up -d to start local PostgreSQL and Kafka instances (see docker-compose.yml at the repo root). Copy .env.example to .env and set DB_URL, KAFKA_BOOTSTRAP_SERVERS, and a local OAuth2 stub issuer. Run ./gradlew bootRun --project=plan-configuration-service and ./gradlew bootRun --project=rating-engine-core in separate terminals, then seed the database with the provided fixtures/seed-rate-plans.sql script, which loads the same 18-plan set (11 Active, 4 Draft, 3 Retired) used throughout this documentation.",
          ],
        },
        {
          id: "2",
          title: "Making a Change",
          level: 1,
          paragraphs: [
            "Locate the relevant module using the High-Level Design's module map — a rating-logic change belongs in rating-engine-core, a new invoice field belongs in invoice-generation-service. Add or update unit tests alongside the change (follow the TC-RTP-*/TC-INV-* naming convention used by the existing suite) and verify the affected module's test suite passes locally with ./gradlew :rating-engine-core:test before opening a pull request.",
          ],
        },
        {
          id: "3",
          title: "Running a Sample Rating Calculation",
          level: 1,
          paragraphs: [
            "With the local stack running, POST a sample usage event to http://localhost:8080/api/v1/usage-events referencing a subscriber assigned to Postpaid Essential (perMinuteRate 0.05, dataRate 4.5), then GET /api/v1/invoices?subscriberId={id} to confirm the resulting invoice_line_items entry reflects the expected rate — this exercises the full ingest-to-rated-charge path described in the Data Flow document end to end.",
          ],
        },
      ],
    },
  ],
};
