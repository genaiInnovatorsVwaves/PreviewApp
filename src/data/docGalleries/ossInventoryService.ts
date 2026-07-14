import type { DocumentGalleryData } from "../types";

export const ossInventoryServiceDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/oss-inventory-service",
  repoName: "OSSINVENTORYSERVICE",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 118,412 LOC across 42 modules, 6 services",
    "Parsed Go module graph (go.mod: 31 direct dependencies)",
    "Identified gRPC service boundaries and REST gateway routes (grpc-gateway)",
    "Extracted PostgreSQL + PostGIS schema — 11 tables, 4 materialized views",
    "Mapped Kafka topic contracts — 6 topics, 3 consumer groups",
    "Generated Business Requirements from ticket-linked commit history (Jira: OSSINV-*)",
    "Generated Product Requirements — 5 user stories with acceptance criteria",
    "Generated High-Level Design — reconciliation-engine event flow",
    "Generated Data Flow Diagram — telemetry ingestion to drift alerting",
    "Generated Low-Level Design across 6 core services",
    "Generated API Reference (14 REST endpoints), Test Plan, and 22 Test Cases",
    "Generated Traceability Matrix and Coverage report (unit + integration)",
    "Generated Tutorial and Provenance record",
  ],
  documents: [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 8,
      sections: [
        {
          id: "1",
          title: "Executive Summary",
          level: 1,
          paragraphs: [
            "OSS Inventory Service is the network's single source of truth for physical and logical asset inventory — routers, switches, antennas, core nodes, base stations, and transport nodes — spanning 1,240 sites across 5 regions (Northeast, Southeast, Midwest, West, Southwest). It currently tracks approximately 48,000 assets from six primary vendors: Cisco, Ericsson, Nokia, Huawei, Juniper, and Ciena.",
            "The system was reverse-engineered directly from its source repository: a Go monorepo of 118 KLOC organized into 42 internal modules across 6 deployable services, owned by the Network Inventory & OSS Platform team (11 engineers). The codebase's defining architectural trait is its nightly reconciliation loop, which diffs the declared inventory (what the registry says exists) against live network telemetry (what actually responds), closing the gap between paperwork and reality.",
            "Since the reconciliation-engine service was hardened in its v3 rewrite (commit range tagged `recon-v3`), drift rate — the share of assets where registry state disagrees with telemetry — fell from 6.8% to 0.4%, and asset audit preparation time for field operations dropped from roughly 3 weeks to 2 days.",
          ],
        },
        {
          id: "2",
          title: "Architecture Overview",
          level: 1,
          paragraphs: [
            "The system is decomposed into six services: `asset-registry-service` (system of record for assets and their lifecycle), `site-topology-service` (site metadata, PostGIS-backed geo-coordinates, and capacity), `reconciliation-engine` (the nightly diff-and-remediate job), `telemetry-ingestion-adapter` (normalizes vendor-specific SNMP/NETCONF/gRPC telemetry into a common schema), `provisioning-sync-worker` (consumes provisioning events from upstream OSS systems and applies them to the registry), and a `rest-gateway` service generated from the internal gRPC contracts via grpc-gateway.",
            "Internal service-to-service calls use gRPC with protobuf contracts checked into `/proto`; the REST gateway exposes a subset of those RPCs to external consumers (field ops tooling, the CRUD console, and BI extracts) under `/api/v1`. All services are stateless and deployed as separate Kubernetes Deployments behind a shared internal service mesh, backed by a single PostgreSQL 15 instance with the PostGIS extension enabled for site geo-queries.",
          ],
        },
        {
          id: "3",
          title: "Reconciliation Event Flow",
          level: 1,
          paragraphs: [
            "`telemetry-ingestion-adapter` polls or receives push telemetry from vendor management systems (Cisco Prime, Ericsson ENM, Nokia NetAct, Huawei U2000, Juniper Junos Space, Ciena MCP), normalizes each payload into a common `AssetSnapshot` protobuf message, and publishes it to the Kafka topic `telemetry.raw`.",
            "`reconciliation-engine` consumes `telemetry.raw`, looks up the corresponding registry record by `assetTag`, and computes a diff across type, site, vendor, firmware, and reachability. A registry asset absent from telemetry for 3 consecutive nightly cycles is flagged as a 'ghost asset'; a live asset with no matching registry record is flagged as 'unregistered' (commonly an unlicensed vendor swap). Both cases emit a `DriftDetected` event to `topology.drift` and, depending on severity, either auto-remediate (firmware string updates) or open a ticket via the field-ops integration.",
          ],
        },
        {
          id: "4",
          title: "Key Design Decisions",
          level: 1,
          paragraphs: [
            "Reconciliation is deliberately batch, not real-time: real-time diffing across ~48,000 assets against noisy vendor telemetry produced an unacceptable false-positive rate in the v1 design. The nightly batch window (02:00–02:45 UTC) processes roughly 2.3 million telemetry records and trades latency for signal quality.",
            "The registry treats `status` as a first-class state machine (Provisioning → Active → Maintenance → Decommissioned) rather than a free-text field, enforced at the `asset-registry-service` boundary — this was a direct fix for a historical data-quality incident where inconsistent status strings made fleet-wide reporting unreliable.",
          ],
        },
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 10,
      sections: [
        {
          id: "1",
          title: "Core Interfaces",
          level: 1,
          paragraphs: [
            "`AssetReconciler` (package `internal/reconcile`) exposes `Diff(ctx, snapshot AssetSnapshot) (*DriftResult, error)` and `Remediate(ctx, drift *DriftResult) error`. Implementations are vendor-agnostic; vendor-specific quirks are isolated behind the `VendorAdapter` interface (`Normalize(raw []byte) (*AssetSnapshot, error)`), with concrete adapters `CiscoAdapter`, `EricssonAdapter`, `NokiaAdapter`, `HuaweiAdapter`, `JuniperAdapter`, and `CienaAdapter` registered in `internal/adapters/registry.go`.",
            "`SiteCapacityCalculator` (package `internal/topology`) computes `utilizationPct` for a site as `(sum of asset rack-units assigned) / capacityUnits * 100`, recalculated on every asset create/update/decommission and cached in the `site_capacity_cache` materialized view, refreshed on a 5-minute trigger to keep the sites dashboard responsive without hammering PostGIS on every read.",
          ],
        },
        {
          id: "2",
          title: "Module Breakdown",
          level: 1,
          paragraphs: [
            "`asset-registry-service` owns the `assets` table and exposes the CRUD gRPC service `AssetRegistry`, with fields matching the operational data model 1:1: `assetTag` (unique, e.g. `RTR-NYC-0042`), `assetType` (enum: Router, Switch, Antenna, Core Node, Base Station, Transport Node), `site`, `vendor`, `installDate`, `firmwareVersion`, and `status`.",
            "`site-topology-service` owns `sites`, keyed by `siteCode` (e.g. `NYC-CEN-01`), with `region`, `capacityUnits`, `utilizationPct`, and `status` (Operational, Degraded, Offline). Degraded is asserted automatically when `utilizationPct` exceeds 90% or when more than 10% of a site's assets are in Maintenance status simultaneously — both currently true for Newark Gateway Node (NWK-GTW-03, 91% utilization) and Detroit Central Office (DET-CO-09, 93% utilization).",
          ],
        },
        {
          id: "3",
          title: "Data Access Layer",
          level: 1,
          paragraphs: [
            "Persistence is centralized behind `internal/store`, a repository layer over `pgx` with all queries defined in versioned `.sql` files and generated into typed Go via `sqlc` — no ORM, no dynamically built queries. This was a deliberate choice after a v1 incident where a hand-built dynamic filter query on the assets table produced an unbounded sequential scan under a field-ops bulk export.",
            "Core tables: `assets`, `sites`, `asset_lifecycle_events` (append-only audit trail of every status transition), `reconciliation_runs` (one row per nightly batch, with counts of matched/drifted/remediated/ticketed assets), and `vendor_adapters_config`. `asset_lifecycle_events` is partitioned by month and retained for 7 years to satisfy the Network Operations audit policy.",
        ],
        },
        {
          id: "4",
          title: "Error Handling",
          level: 1,
          paragraphs: [
            "Errors are normalized to a small set of typed errors (`ErrNotFound`, `ErrDuplicateAssetTag`, `ErrInvalidTransition`, `ErrVendorAdapterTimeout`) at the service boundary and mapped to gRPC status codes, which grpc-gateway then translates to HTTP status codes (409 for `ErrDuplicateAssetTag`, 422 for `ErrInvalidTransition`). `ErrVendorAdapterTimeout` triggers exponential backoff with a 3-attempt retry before the asset is marked `telemetry_stale` for that cycle rather than incorrectly flagged as a ghost asset.",
          ],
        },
      ],
    },
    {
      key: "brd",
      icon: "brd",
      title: "Business requirements",
      description: "Business goals, stakeholders, and functional requirements.",
      readMinutes: 7,
      sections: [
        {
          id: "1",
          title: "Business Goals",
          level: 1,
          paragraphs: [
            "Network inventory and OSS service, reverse-engineered end-to-end from source — asset topology, provisioning APIs, and reconciliation jobs. Before this system, asset records lived across five vendor-specific EMS tools plus a shared spreadsheet used to reconcile discrepancies manually — a process that took a field engineer roughly 3 weeks per full regional audit and still missed ghost assets that had quietly gone dark or been swapped without a corresponding ticket.",
            "The primary business goal is a single reconciled inventory view that field operations, capacity planning, and finance (for depreciation and license-true-up) can all trust without cross-checking against vendor consoles. A secondary, quantified goal was cutting the fleet-wide reconciliation drift rate — currently 0.4%, down from a 6.8% baseline measured before the reconciliation-engine v3 rewrite.",
          ],
        },
        {
          id: "2",
          title: "Stakeholders",
          level: 1,
          paragraphs: [
            "Primary stakeholders: the VP of Network Operations (owns fleet-wide reliability and audit readiness), the OSS Platform Director (owns the service and its roadmap), and Field Services Managers across each of the 5 regions (own on-the-ground asset installs, swaps, and decommissions).",
            "Secondary stakeholders include Finance (asset depreciation schedules keyed to `installDate` and `status`) and Vendor Management (license true-ups depend on an accurate per-vendor asset count — currently Cisco and Juniper are the two largest deployed fleets by unit count).",
          ],
        },
        {
          id: "3",
          title: "Functional Requirements",
          level: 1,
          paragraphs: [
            "The system must maintain a canonical asset record addressable by `assetTag`, enforce the status lifecycle (Provisioning → Active → Maintenance → Decommissioned) at the write boundary, and reconcile that record nightly against live telemetry across all 6 supported vendors.",
            "It must expose site-level capacity and utilization roll-ups sufficient to flag a site as Degraded before it becomes a field-visible outage risk, and must retain a 7-year append-only audit trail of every asset status change for compliance.",
          ],
        },
      ],
    },
    {
      key: "prd",
      icon: "prd",
      title: "Product requirements",
      description: "Product scope, user stories, and acceptance criteria.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Scope",
          level: 1,
          paragraphs: [
            "In scope: asset CRUD and lifecycle management, site inventory and capacity tracking, nightly telemetry reconciliation across the 6 supported vendor adapters, drift detection and alerting, and a REST API surface for downstream consumers (field-ops tooling, BI extracts, the CRUD console).",
            "Out of scope for this release: real-time (sub-nightly) reconciliation, automated physical dispatch/truck-roll scheduling (owned by a separate Field Services system this service only opens tickets into), and multi-tenant support for external carrier partners.",
          ],
        },
        {
          id: "2",
          title: "User Stories",
          level: 1,
          paragraphs: [
            "**US-1**: As a Field Services Manager, I need to register a newly installed asset with its `assetTag`, `assetType`, `site`, `vendor`, `installDate`, and `firmwareVersion` so it enters Provisioning status and becomes visible to reconciliation. Acceptance: duplicate `assetTag` is rejected with a 409; the asset appears in the registry within 5 seconds of submission.",
            "**US-2**: As an OSS Platform Engineer, I need reconciliation to automatically flag any asset absent from telemetry for 3 consecutive nightly cycles as a ghost asset, so stale inventory doesn't silently inflate fleet counts. Acceptance: a `DriftDetected` event is emitted and a ticket is opened against the asset's site.",
            "**US-3**: As a Capacity Planner, I need site-level `utilizationPct` recalculated whenever an asset is added, moved, or decommissioned, so I can see accurate headroom per site without a manual rack audit. Acceptance: `utilizationPct` reflects the change within one materialized-view refresh cycle (5 minutes).",
            "**US-4**: As a Network Operations Director, I need a site automatically marked Degraded when utilization exceeds 90% or more than 10% of its assets are in Maintenance, so at-risk sites surface before they become outages. Acceptance: Newark Gateway Node (91% utilization) and Detroit Central Office (93% utilization, both Degraded) validate this rule correctly.",
            "**US-5**: As an Auditor, I need every asset status transition retained for 7 years with actor and timestamp, so a compliance review can reconstruct the full lifecycle of any asset on demand. Acceptance: `asset_lifecycle_events` returns a complete, immutable transition history for any `assetTag`.",
          ],
        },
      ],
    },
    {
      key: "feature",
      icon: "feature",
      title: "Feature specification",
      description: "Feature behavior, inputs, outputs, and edge cases.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Reconciliation Logic",
          level: 1,
          paragraphs: [
            "Each nightly run (`reconciliation_runs` row) pulls the full `telemetry.raw` window since the previous run, groups snapshots by `assetTag`, and diffs each against the current registry record. A mismatch on `site`, `vendor`, or `firmwareVersion` alone (asset still reachable, just changed) auto-remediates the registry field and logs an `asset_lifecycle_events` entry tagged `auto-remediated`; a full absence triggers the ghost-asset counter for that `assetTag`.",
            "Drift detection thresholds are configurable per asset type — Base Station and Transport Node assets use a 2-cycle threshold (higher operational cost of missing them) while Router, Switch, and Antenna use the standard 3-cycle threshold, reflecting the last production tuning pass logged in `reconciliation-engine`'s changelog.",
          ],
        },
        {
          id: "2",
          title: "Capacity Utilization Calculation",
          level: 1,
          paragraphs: [
            "`utilizationPct = round(sum(asset.rackUnits for asset in site.assets where status != 'Decommissioned') / site.capacityUnits * 100)`. Decommissioned assets are excluded even if not yet physically removed, since they no longer represent live capacity demand — a distinction the v1 design got wrong and which caused several sites to be misreported as over-capacity.",
            "Sites with `utilizationPct` of 0 and `status: Offline` (e.g. Miami Coastal Exchange, MIA-CST-06) are excluded from regional capacity-planning roll-ups entirely rather than counted as 0% utilized headroom, to avoid skewing regional averages.",
          ],
        },
        {
          id: "3",
          title: "Edge Cases",
          level: 1,
          paragraphs: [
            "An asset reporting telemetry from a `site` value that doesn't match its registry `site` (a physical relocation without a corresponding update) is treated as a special drift subtype — `SiteMismatch` — rather than a generic field diff, because it also requires recalculating utilization for both the old and new site.",
            "Vendor adapter timeouts do not count toward the ghost-asset cycle counter; an asset is only flagged absent when its adapter successfully polled its site but returned no matching device, distinguishing 'the network is down' from 'the vendor management system is down.'",
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
            "All `/api/v1` endpoints require a bearer token issued by the platform's identity provider (OAuth2 client-credentials for service-to-service, OIDC for interactive tooling); unauthenticated requests receive a 401 with a standard `{ code, message }` error envelope. Internal gRPC calls between services use mTLS via the service mesh sidecar rather than bearer tokens.",
          ],
        },
        {
          id: "2",
          title: "Core Endpoints",
          level: 1,
          paragraphs: [
            "Asset endpoints: `GET /api/v1/assets` (filterable by `assetType`, `site`, `vendor`, `status`), `GET /api/v1/assets/{assetTag}`, `POST /api/v1/assets` (creates in Provisioning status), `PATCH /api/v1/assets/{assetTag}` (partial update; status transitions validated against the state machine), `DELETE /api/v1/assets/{assetTag}` (soft-delete → Decommissioned, never a hard delete).",
            "Site endpoints: `GET /api/v1/sites`, `GET /api/v1/sites/{siteCode}`, `GET /api/v1/sites/{siteCode}/utilization` (returns current `utilizationPct` plus the trailing 6-month trend), `GET /api/v1/sites/{siteCode}/assets` (all assets at a site).",
            "Reconciliation endpoints: `POST /api/v1/reconciliation/runs` (manually trigger an out-of-cycle run, restricted to OSS Platform Engineer role), `GET /api/v1/reconciliation/runs/{runId}`, `GET /api/v1/reconciliation/drift` (current open drift events, filterable by `driftType`).",
          ],
        },
        {
          id: "3",
          title: "Error Contract",
          level: 2,
          paragraphs: [
            "All error responses share `{ code: string, message: string, details?: object }`. `POST /api/v1/assets` with a duplicate `assetTag` returns 409 with `code: ASSET_TAG_EXISTS`; an invalid status transition (e.g. Provisioning → Decommissioned directly) returns 422 with `code: INVALID_STATUS_TRANSITION` and `details.allowedTransitions`.",
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
            "Testing is layered: unit tests around business logic (state machine transitions, capacity calculation, drift-threshold logic) using table-driven Go tests; integration tests against a dockerized PostgreSQL+PostGIS instance covering the repository layer and reconciliation-engine's full diff cycle; and a smaller set of end-to-end tests that run the six vendor adapters against recorded fixture payloads.",
            "Vendor adapter tests specifically replay captured production payload samples (sanitized) for Cisco, Ericsson, Nokia, Huawei, Juniper, and Ciena, since live vendor management systems are not available in CI.",
          ],
        },
        {
          id: "2",
          title: "Coverage Targets",
          level: 1,
          paragraphs: [
            "`reconciliation-engine` and `asset-registry-service` target 90%+ statement coverage given their role enforcing the status state machine and drift logic. `rest-gateway` (largely generated code) and `provisioning-sync-worker` target 70%, consistent with their lower change frequency and higher share of boilerplate.",
          ],
        },
      ],
    },
    {
      key: "testcases",
      icon: "testcases",
      title: "Test cases",
      description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
      readMinutes: 10,
      sections: [
        {
          id: "1",
          title: "Asset Registry Cases",
          level: 1,
          paragraphs: [
            "`TC-AST-011`: Reject asset creation with a duplicate `assetTag` (e.g. re-submitting `RTR-NYC-0042`) — expect 409 `ASSET_TAG_EXISTS`, no new row written, no `asset_lifecycle_events` entry created.",
            "`TC-AST-014`: Attempt an invalid transition Provisioning → Decommissioned directly on `asset-014` (`SW-MSP-0143`, currently Provisioning) — expect 422 `INVALID_STATUS_TRANSITION` with `allowedTransitions: [\"Active\"]`.",
            "`TC-AST-018`: Decommission `asset-008` (`SW-MIA-0122`, Miami Coastal Exchange) and verify Miami Coastal Exchange's `utilizationPct` recalculates downward within one 5-minute cache cycle.",
          ],
        },
        {
          id: "2",
          title: "Reconciliation Cases",
          level: 1,
          paragraphs: [
            "`TC-REC-004`: Simulate 3 consecutive nightly cycles with no telemetry for a Router-type asset — expect a `DriftDetected` ghost-asset event on cycle 3, not cycle 1 or 2 (3-cycle threshold for Router).",
            "`TC-REC-007`: Simulate 2 consecutive nightly cycles with no telemetry for a Base Station asset (`BTS-DAL-0334`) — expect ghost-asset flag on cycle 2, validating the tighter 2-cycle threshold for Base Station/Transport Node types.",
            "`TC-REC-009`: Feed telemetry reporting `firmwareVersion: v15.6.3` for `RTR-ATL-0089` (registry shows `v15.6.1`) — expect auto-remediation of the firmware field and an `auto-remediated` lifecycle event, with no ticket opened.",
            "`TC-REC-012`: Feed telemetry for an `assetTag` not present in the registry at all — expect an `Unregistered` drift event rather than a ghost-asset event.",
          ],
        },
        {
          id: "3",
          title: "Capacity & Site Cases",
          level: 1,
          paragraphs: [
            "`TC-SITE-002`: Push utilization for Newark Gateway Node (NWK-GTW-03) to 91% via asset additions — expect `status` to auto-transition to Degraded.",
            "`TC-SITE-005`: Verify a site with `status: Offline` and `utilizationPct: 0` (Miami Coastal Exchange) is excluded from the Southeast region's average-utilization roll-up computation.",
          ],
        },
      ],
    },
    {
      key: "dataflow",
      icon: "dataflow",
      title: "Data flow",
      description: "Data movement across services, stores, and integrations.",
      readMinutes: 6,
      sections: [
        {
          id: "1",
          title: "Primary Data Path",
          level: 1,
          paragraphs: [
            "Vendor telemetry → `telemetry-ingestion-adapter` (per-vendor `VendorAdapter.Normalize`) → Kafka topic `telemetry.raw` → `reconciliation-engine` consumer group → diff against `asset-registry-service` (gRPC `GetAsset`) → on match, update `assets` + append `asset_lifecycle_events`; on mismatch, emit `DriftDetected` to Kafka topic `topology.drift` → alerting/ticketing consumer.",
            "Provisioning path: upstream OSS provisioning system → `provisioning-sync-worker` (consumes topic `provisioning.events`) → `asset-registry-service.CreateAsset` (status: Provisioning) → asset becomes visible to the next reconciliation cycle, which transitions it to Active on first successful telemetry match.",
          ],
        },
        {
          id: "2",
          title: "Read Path",
          level: 2,
          paragraphs: [
            "`rest-gateway` translates inbound HTTP to gRPC calls against `asset-registry-service` and `site-topology-service` directly for point reads; utilization roll-ups read from the `site_capacity_cache` materialized view rather than computing live, keeping `GET /api/v1/sites/{siteCode}/utilization` sub-100ms under load.",
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
            "US-1 (asset registration) → `asset-registry-service` / `AssetRegistry.CreateAsset` → `TC-AST-011`, `TC-AST-014`.",
            "US-2 (ghost-asset detection) → `reconciliation-engine` / `AssetReconciler.Diff` → `TC-REC-004`, `TC-REC-007`.",
            "US-3 (utilization recalculation) → `site-topology-service` / `SiteCapacityCalculator` → `TC-AST-018`, `TC-SITE-002`.",
            "US-4 (auto-Degraded status) → `site-topology-service` status-derivation logic → `TC-SITE-002`, `TC-SITE-005`.",
            "US-5 (7-year audit trail) → `asset_lifecycle_events` partitioned table + retention job → validated via integration test suite `store_audit_test.go`.",
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
            "`asset-registry-service`: 94% statement coverage. `reconciliation-engine`: 91%. `site-topology-service`: 88%. `telemetry-ingestion-adapter`: 82% (vendor adapter edge cases are the largest gap). `provisioning-sync-worker`: 76%. `rest-gateway`: 71% (mostly generated glue code, lower-risk).",
            "Overall repository coverage sits at 85% across 118 KLOC; the two modules flagged for follow-up are the Huawei and Ciena adapters, which have the thinnest fixture-based test coverage relative to their production traffic share.",
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
            "This pass produced 14 documents covering architecture, requirements, a 14-endpoint API surface, test strategy across 22 catalogued test cases, and a getting-started tutorial, all derived from static analysis of 118 KLOC across 42 modules in 6 deployable services within the `oss-inventory-service` repository.",
            "Key figures referenced consistently across this document set: ~48,000 tracked assets, 1,240 sites across 5 regions, a 0.4% reconciliation drift rate (down from 6.8%), and an 85% overall test coverage figure.",
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
            "Every document links back to the repository commit (`main` at analysis time), specific file paths under `/internal`, `/proto`, and `/cmd`, and the analysis pass that produced it — the HLD's service breakdown traces to `cmd/*/main.go` entrypoints and `/proto/*.proto` service definitions; the API reference traces to the grpc-gateway annotation blocks in `/proto/asset_registry.proto` and `/proto/site_topology.proto`; test case IDs trace to `internal/reconcile/*_test.go` and `internal/topology/*_test.go`.",
          ],
        },
      ],
    },
    {
      key: "tutorial",
      icon: "tutorial",
      title: "Tutorial",
      description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
      readMinutes: 7,
      sections: [
        {
          id: "1",
          title: "Getting Started",
          level: 1,
          paragraphs: [
            "Clone the repository, then run `docker-compose up -d postgres kafka zookeeper` to start local dependencies. Apply migrations with `make migrate-up`, then seed sample assets and sites with `make seed` (loads fixture data matching the 6-vendor adapter set).",
            "Start the services with `go run ./cmd/asset-registry`, `go run ./cmd/site-topology`, `go run ./cmd/reconciliation-engine`, and `go run ./cmd/rest-gateway` in separate terminals, or `make dev-up` to run all four under a process supervisor. The REST gateway listens on `:8080` by default.",
          ],
        },
        {
          id: "2",
          title: "Triggering a Reconciliation Run Locally",
          level: 1,
          paragraphs: [
            "With services running, publish a sample telemetry payload to `telemetry.raw` using `make publish-fixture VENDOR=cisco`, then manually trigger a cycle with `curl -X POST localhost:8080/api/v1/reconciliation/runs`. Inspect the result with `curl localhost:8080/api/v1/reconciliation/runs/{runId}` — a healthy local run should report zero drift against the seeded fixtures.",
            "To add a new vendor adapter, implement the `VendorAdapter` interface in `internal/adapters/`, register it in `internal/adapters/registry.go`, add fixture payloads under `testdata/fixtures/{vendor}/`, and add a table-driven test case alongside the existing five adapters before opening a pull request.",
          ],
        },
      ],
    },
  ],
};
