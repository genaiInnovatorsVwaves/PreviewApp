import type { DocumentGalleryData } from "../types";

export const terraformModuleLibraryDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/terraform-module-library",
  repoName: "TERRAFORMMODULELIBRARY",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 86,140 lines across 312 Go files and 214 embedded Terraform test fixtures",
    "Parsed go.mod (Go 1.22), Dockerfile, and docker-compose.yaml service topology",
    "Built module dependency graph across registry-api-server, module-publish-worker, semver-compatibility-checker, drift-scanner, deployment-tracker",
    "Extracted layered architecture: registry protocol handlers → domain services → Postgres repositories → S3-compatible object storage",
    "Indexed Postgres schema — modules, module_versions, deployments, drift_scan_results, compatibility_checks (5 tables, 18 foreign keys)",
    "Generated Business Requirements from Jira epic PLAT-4021 references in commit history",
    "Generated Product Requirements from 41 linked user stories",
    "Generated High-Level Design from service boundaries and GitHub Actions publish workflow",
    "Generated Data Flow Diagram from webhook handlers and nightly cron entrypoints",
    "Generated Low-Level Design across 5 core Go packages",
    "Generated API Reference from 26 registered HTTP routes (Terraform registry protocol + custom endpoints)",
    "Generated Test Plan and 61 Test Cases from *_test.go suites",
    "Generated Traceability Matrix and Coverage report from `go test -cover` output",
    "Generated Tutorial and Provenance record",
  ],
  documents: [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 9,
      sections: [
        {
          id: "1",
          title: "Executive Summary",
          level: 1,
          paragraphs: [
            "The system was reverse-engineered directly from its source repository. Terraform Module Library is a self-hosted Terraform module registry and governance layer, built by the Platform Foundations team (7 engineers) to replace hand-rolled, copy-pasted Terraform across AWS, Azure, GCP, and Kubernetes environments. It currently indexes 210 published modules and tracks 1,840 live deployments across production, staging, development, and sandbox environments.",
            "The registry backend (86 KLOC of Go) implements the standard Terraform module registry protocol, so consuming teams point `source = \"registry.internal/aws-vpc-baseline\"` at it directly from `terraform init` with no custom tooling. On top of the protocol-compliant surface, the team layered semantic-version compatibility checking, nightly drift scanning against every tracked deployment, and a formal Draft → Beta → Published → Deprecated lifecycle enforced at the API layer rather than by convention.",
          ],
        },
        {
          id: "2",
          title: "Architecture Overview",
          level: 1,
          paragraphs: [
            "Static analysis identified five core services sharing a single Postgres database and an S3-compatible bucket for module tarballs: `registry-api-server` (HTTP surface, both the Terraform-protocol routes and the internal management API), `module-publish-worker` (consumes GitHub Actions publish webhooks, validates semver, uploads tarballs), `semver-compatibility-checker` (computes whether version N+1 of a module is a safe upgrade for a given deployment), `drift-scanner` (nightly job comparing each deployment's last-applied module version hash against the module's current published version), and `deployment-tracker` (ingests `terraform apply` completion events from CI runners and updates the `deployments` table).",
            "`registry-api-server` is stateless and horizontally scaled behind an internal load balancer; the four background services run as separate deployments so a stuck drift scan can never block a module publish. All five communicate exclusively through Postgres and S3 — there is no direct service-to-service RPC, which the codebase's `ARCHITECTURE.md` explicitly calls out as a deliberate choice to keep the write path (publishing) independent from the read-heavy path (drift scanning, compatibility checks).",
          ],
        },
        {
          id: "3",
          title: "Key Design Decisions",
          level: 1,
          paragraphs: [
            "The team chose to implement the actual Terraform module registry protocol (service discovery via `/.well-known/terraform.json`, versions/download endpoints) rather than build a custom pull mechanism, so any `terraform init` anywhere in the org works against the internal registry with zero client-side tooling — this decision is documented in ADR-014 in the repository's `docs/adr/` folder.",
            "Drift detection is pull-based and nightly rather than event-driven in real time: the `drift-scanner` service diffs the `deployments.last_applied_module_hash` column against `module_versions.content_hash` for the currently published version. The ADR trade-off notes this bounds worst-case drift-detection latency to 24 hours but avoids requiring every CI runner to push state on every apply, which was rejected as too invasive to existing pipelines.",
          ],
        },
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 11,
      sections: [
        {
          id: "1",
          title: "Module Breakdown",
          level: 1,
          paragraphs: [
            "`internal/registry/` implements the Terraform-protocol handlers and exposes a narrow `ModuleVersionResolver` interface (`Resolve(namespace, name, provider string) ([]semver.Version, error)`) so the HTTP layer never touches SQL directly. `internal/compatibility/` implements `ProviderCompatibilityMatrix`, which encodes which module major versions are certified against which Terraform CLI and provider-plugin versions — this is the data the `oss-inventory-service`-style consuming teams query before bumping a pinned version.",
            "`internal/drift/` implements the `DriftScanner` interface with a single production implementation, `PostgresDriftScanner`, plus a `MockDriftScanner` used exclusively in the 61-case test suite. `internal/publish/` owns the full publish state machine and is the only package permitted to write to `module_versions.status`.",
          ],
        },
        {
          id: "2",
          title: "Data Access Layer",
          level: 1,
          paragraphs: [
            "Persistence is centralized behind `internal/store/`, a repository layer over `pgx` with five tables: `modules` (moduleName, owningTeam, provider, currentStatus), `module_versions` (moduleId FK, version semver, contentHash, publishedAt), `deployments` (deploymentName, moduleName, environment, team, lastAppliedModuleHash, status), `drift_scan_results` (deploymentId FK, scannedAt, driftDetected boolean, details jsonb), and `compatibility_checks` (moduleId FK, fromVersion, toVersion, verdict).",
            "Query logic is isolated from business logic — `PostgresDriftScanner.Scan()` calls only `store.DeploymentRepository` and `store.ModuleVersionRepository` methods, never raw SQL, which keeps the drift algorithm itself unit-testable with an in-memory fake store (used across 14 of the 61 test cases).",
          ],
        },
        {
          id: "3",
          title: "Error Handling",
          level: 1,
          paragraphs: [
            "Errors are normalized to a small typed set in `internal/apierr/` — `ErrModuleNotFound`, `ErrInvalidSemver`, `ErrModuleDeprecated`, `ErrDriftScanInProgress` — each mapped to a specific HTTP status by a shared middleware in `registry-api-server`, so every 4xx/5xx response carries the same JSON error envelope (`{\"error\": {\"code\": \"...\", \"message\": \"...\"}}`).",
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
            "Internal Terraform module library, reverse-engineered into full documentation — module contracts, variable interfaces, and provider compatibility matrices. The originating business case (Jira epic PLAT-4021) targeted a specific, measured problem: infrastructure provisioning lead time averaged 2 weeks per new service because every team hand-wrote Terraform from scratch, with no shared, pre-approved, versioned building blocks. Post-launch, provisioning lead time for teams consuming registry modules dropped to 3 days.",
            "The second, equally weighted goal was drift visibility. Before the registry existed, infrastructure drift — a deployment's actual applied state diverging from its source module — was discovered reactively, typically during an incident. The nightly `drift-scanner` job reduced mean-time-to-remediate for drift from 11 days to 36 hours by surfacing it proactively on the dashboard rather than waiting for a production symptom.",
          ],
        },
        {
          id: "2",
          title: "Stakeholders",
          level: 1,
          paragraphs: [
            "Primary stakeholders identified from the commit history and CODEOWNERS file: the VP of Platform Engineering (executive sponsor, quarterly OKR owner for provisioning lead time), the Cloud Infrastructure Director (owns the module deprecation and compatibility policy), and the Security & Compliance Lead (requires every `aws-iam-role-factory` and `aws-s3-secure-bucket` publish to pass a policy-as-code check before reaching Published status).",
            "Secondary stakeholders are the module-owning teams themselves — Cloud Networking, Kubernetes Platform, Data Platform, Security Engineering, and Observability — each of which publishes and maintains its own subset of the 210 registered modules and is accountable for responding to drift alerts on deployments referencing their modules.",
          ],
        },
        {
          id: "3",
          title: "Functional Requirements",
          level: 1,
          paragraphs: [
            "FR-1: The system must implement the standard Terraform module registry protocol so any `terraform init` in the organization can resolve modules with zero custom tooling. FR-2: Every module version publish must pass semver validation and, for security-owned modules, a policy-as-code gate before becoming resolvable. FR-3: The system must detect and surface drift between a deployment's applied state and its source module version within 24 hours. FR-4: Deprecating a module version must propagate a visible notice to every deployment still referencing it.",
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
            "The product scope inferred from the codebase covers module publishing and versioning, drift detection, deprecation lifecycle management, and a management console — the live sandbox preview in this workspace mirrors that console, showing the `moduleName`, `version`, `provider`, `owningTeam`, `downloads`, `lastPublished`, and `status` fields exactly as modeled in `internal/store/modules.go`, alongside the `deploymentName`, `moduleName`, `environment`, `team`, `lastApplied`, and `status` fields from `internal/store/deployments.go`.",
          ],
        },
        {
          id: "2",
          title: "User Stories",
          level: 1,
          paragraphs: [
            "US-1: As a module owner on the Cloud Networking team, I need to publish a new `moduleName` version and have it rejected with a field-level error if the version tag isn't valid semver, so bad tags never reach consumers. Acceptance: publishing `aws-vpc-baseline` at version `v3.4` (missing patch) returns `ErrInvalidSemver` and the module's `status` remains unchanged.",
            "US-2: As a platform engineer, I need every deployment referencing a module still in `status: Deprecated` to surface a visible warning, so teams migrate off deprecated infrastructure before it's fully removed. Acceptance: a deployment whose `moduleName` resolves to a module with `status: Deprecated` shows a deprecation banner with the recommended replacement version.",
            "US-3: As a security engineer, I need `aws-iam-role-factory` and `aws-s3-secure-bucket` publishes to require a passing policy-as-code scan before `status` can transition from `Draft`/`Beta` to `Published`, so no unreviewed IAM or bucket-policy change reaches production consumers.",
            "US-4: As an SRE, I need the drift scanner to flag any `deployment` whose `lastApplied` hash no longer matches the currently published version of its `moduleName`, with `status` set to `Drift Detected`, so I can triage before it causes an incident.",
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
          title: "Semver Compatibility Checking",
          level: 1,
          paragraphs: [
            "The `ProviderCompatibilityMatrix` accepts a module name and a `fromVersion`/`toVersion` pair and returns a verdict of `safe`, `breaking`, or `unknown`. It classifies a version bump as breaking whenever the major component changes (per semver convention) or when the module's `variables.tf` diff, computed at publish time, removes a previously required input variable — the latter check is what distinguishes this from naive semver-string comparison.",
            "A `breaking` verdict does not block publish — the registry's philosophy, per `docs/adr/ADR-009-non-blocking-compatibility.md`, is to warn rather than gate, since module owners occasionally need to ship an intentional breaking change. Instead, every deployment on an older major version receives a compatibility warning surfaced in the console the next time its drift scan runs.",
          ],
        },
        {
          id: "2",
          title: "Drift Detection Logic",
          level: 1,
          paragraphs: [
            "Nightly, `drift-scanner` iterates every row in `deployments`, looks up the currently published `content_hash` for that row's `moduleName`, and compares it to the deployment's stored `lastAppliedModuleHash`. A mismatch writes a row to `drift_scan_results` with `driftDetected: true` and flips the deployment's `status` to `Drift Detected` unless it is already `Apply Failed`, which takes precedence.",
            "Edge case: a deployment pinned to an explicit older module version (rather than tracking latest) is intentionally excluded from drift comparison against newer versions — the scanner reads the deployment's declared `source` version constraint from its last `terraform apply` metadata and only compares against drift within that constraint, not against the module's absolute latest.",
          ],
        },
        {
          id: "3",
          title: "Deprecation Lifecycle",
          level: 1,
          paragraphs: [
            "Deprecating a module version is a one-way transition (`Published → Deprecated`) that cannot be reversed through the API — re-publishing requires a new version number. On deprecation, `module-publish-worker` enqueues a notification fan-out to every `deployment` row currently referencing that module, which the console surfaces as a banner; three currently-deprecated modules in the seed data (`aws-cloudfront-cdn`, `azure-storage-account`, `gcp-bigquery-dataset`) demonstrate this state.",
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
            "The Terraform-protocol routes under `/v1/modules/` are authenticated via a service-account bearer token issued by the org's internal identity provider and configured in each consumer's `~/.terraformrc` credentials block; the management API under `/api/v1/` requires the same bearer token plus an `X-Team` header used for row-level authorization (a team can only mutate modules where `owningTeam` matches).",
          ],
        },
        {
          id: "2",
          title: "Core Endpoints",
          level: 1,
          paragraphs: [
            "Registry protocol (consumer-facing, read-only): `GET /.well-known/terraform.json` (service discovery), `GET /v1/modules/{namespace}/{name}/{provider}/versions` (list available versions), `GET /v1/modules/{namespace}/{name}/{provider}/{version}/download` (returns a signed S3 tarball URL).",
            "Management API (publish and governance): `POST /api/v1/modules/{namespace}/{name}/{provider}/publish` (body: version, contentHash, changelogUrl), `GET /api/v1/modules/{moduleName}` (module detail incl. current status and download count), `POST /api/v1/modules/{moduleName}/deprecate` (body: replacementVersion, reason), `GET /api/v1/compatibility/{moduleName}/{fromVersion}/{toVersion}` (compatibility verdict).",
            "Deployment and drift API: `GET /api/v1/deployments` (paginated, filterable by environment/team/status), `GET /api/v1/deployments/{deploymentName}`, `GET /api/v1/deployments/{deploymentName}/drift` (latest scan result), `POST /api/v1/deployments/{deploymentName}/drift-scan` (force an out-of-band scan, rate-limited to 1/hour per deployment).",
          ],
        },
        {
          id: "3",
          title: "Error Contracts",
          level: 1,
          paragraphs: [
            "All non-2xx responses return `{\"error\": {\"code\": string, \"message\": string}}`. Publish endpoints additionally return HTTP 409 with `code: \"VERSION_EXISTS\"` if the exact version has already been published — versions are immutable once published, matching real Terraform registry semantics.",
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
            "Testing is layered: `internal/*/  *_test.go` unit tests around the compatibility, drift, and publish state-machine logic using the in-memory fake store; integration tests in `test/integration/` spin up Postgres and MinIO (S3-compatible) via `docker-compose.test.yaml` and exercise `registry-api-server` end to end; and a smaller set of 8 end-to-end tests in `test/e2e/` run an actual `terraform init` against a locally running registry instance to verify protocol compliance.",
          ],
        },
        {
          id: "2",
          title: "Coverage Targets",
          level: 1,
          paragraphs: [
            "The publish state machine and drift-scanning logic — the two areas with the highest incident cost if wrong — target 90%+ statement coverage and currently sit at 94% and 91% respectively. The management console's read-only list/filter endpoints are covered more lightly (68%), consistent with their lower change frequency and lower blast radius if a bug ships.",
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
          title: "Happy Path Cases",
          level: 1,
          paragraphs: [
            "TC-PUB-001: Publish `aws-lambda-baseline` v0.3.0 with valid semver and a passing changelog URL → module version created, `status: Draft`. TC-PUB-004: Promote a `Draft` module to `Beta` via the management API → status transition recorded with timestamp and actor. TC-COMPAT-002: Query compatibility between `aws-eks-cluster` v2.8.0 → v2.9.0 (minor bump, no removed variables) → verdict `safe`.",
            "TC-DRIFT-001: Run nightly scan against `prod-us-east-networking` (deployment tracking `aws-vpc-baseline`, hash matches current published version) → `driftDetected: false`, status remains `Healthy`. TC-DEPLOY-006: Create a new deployment record referencing a `Published` module → deployment status initializes to `Pending` until first drift scan confirms `Healthy`.",
          ],
        },
        {
          id: "2",
          title: "Negative Cases",
          level: 1,
          paragraphs: [
            "TC-PUB-009: Reject module publish with non-semver version tag (e.g. `v3.4`) → HTTP 400, `code: \"INVALID_SEMVER\"`, no row written to `module_versions`. TC-PUB-011: Reject publish of a version that already exists → HTTP 409, `code: \"VERSION_EXISTS\"`. TC-SEC-003: Reject publish to `aws-iam-role-factory` when the policy-as-code scan attached to the request is missing or failing → HTTP 422, `code: \"POLICY_CHECK_REQUIRED\"`.",
            "TC-DRIFT-003: Flag deployment `prod-eu-vnet` (tracking `azure-vnet-hub-spoke`) as drift when its stored `lastAppliedModuleHash` no longer matches the currently published version's `contentHash` → status flips to `Drift Detected`, a row is written to `drift_scan_results`. TC-AUTHZ-002: Reject a deprecate request from a team whose `X-Team` header does not match the module's `owningTeam` → HTTP 403.",
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
          title: "Publish Path",
          level: 1,
          paragraphs: [
            "A CI tag push in a module's source repo triggers a GitHub Actions publish webhook, consumed by `module-publish-worker`. The worker validates the semver tag, runs the policy-as-code check for security-owned modules, uploads the built tarball to the S3-compatible bucket, and writes the new row to `module_versions` with `status: Draft`. `registry-api-server` reads exclusively from `module_versions`/`modules`, so the new version becomes resolvable via the Terraform protocol the moment the write commits — there is no separate cache-invalidation step.",
          ],
        },
        {
          id: "2",
          title: "Drift Scan Path",
          level: 1,
          paragraphs: [
            "Nightly, `drift-scanner` reads every row from `deployments`, joins against `module_versions` on the currently published version for that module, computes the hash comparison, and writes results to `drift_scan_results` while updating `deployments.status` in place. The management console polls `GET /api/v1/deployments` for rendering, so scan results are visible within one polling interval of the job completing — typically under a minute.",
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
            "FR-1 (registry protocol compliance) → HLD §2 Architecture Overview → `internal/registry/` → TC-E2E-001 through TC-E2E-008 (live `terraform init` runs). FR-2 (semver + policy gate on publish) → Feature Spec §1, §3 → `internal/publish/` → TC-PUB-001, TC-PUB-009, TC-PUB-011, TC-SEC-003.",
            "FR-3 (24-hour drift detection) → Feature Spec §2 → `internal/drift/PostgresDriftScanner` → TC-DRIFT-001, TC-DRIFT-003. FR-4 (deprecation notice propagation) → Feature Spec §3 → `module-publish-worker` notification fan-out → TC-DEPRE-001 through TC-DEPRE-004 (not itemized above but present in the full 61-case suite under `test/unit/publish/deprecate_test.go`).",
          ],
        },
      ],
    },
    {
      key: "coverage",
      icon: "coverage",
      title: "Coverage",
      description: "Documentation and code coverage across the codebase.",
      readMinutes: 6,
      sections: [
        {
          id: "1",
          title: "Per-Package Coverage",
          level: 1,
          paragraphs: [
            "`internal/publish/`: 94% statement coverage. `internal/drift/`: 91%. `internal/compatibility/`: 87%. `internal/registry/` (protocol handlers): 82%. `internal/store/` (repository layer, exercised mostly via integration tests rather than unit tests): 76%. `internal/console/` (management API read endpoints): 68% — flagged in the repo's `COVERAGE.md` as the next priority for test investment.",
          ],
        },
      ],
    },
    {
      key: "summary",
      icon: "summary",
      title: "Generation summary",
      description: "Summarizes what is covered across all related documents in a single consolidated view.",
      readMinutes: 5,
      sections: [
        {
          id: "1",
          title: "What Was Generated",
          level: 1,
          paragraphs: [
            "This pass produced 14 documents covering architecture, requirements, API surface, test strategy, and a getting-started tutorial, all derived from static analysis of 86,140 lines across 312 Go files in Terraform Module Library. The analysis indexed 5 core services, 5 Postgres tables, 26 HTTP routes, and 61 test cases, and cross-referenced the codebase against Jira epic PLAT-4021 and the repository's `docs/adr/` decision log to ground the business requirements in the goals the team actually tracked at launch.",
          ],
        },
      ],
    },
    {
      key: "provenance",
      icon: "provenance",
      title: "Provenance",
      description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
      readMinutes: 6,
      sections: [
        {
          id: "1",
          title: "Generation Trail",
          level: 1,
          paragraphs: [
            "HLD and LLD were generated from `internal/*/` package structure and the ADRs in `docs/adr/` (14 decision records, most recently ADR-014). BRD was generated from Jira epic PLAT-4021 and its 41 linked stories, cross-referenced against `CODEOWNERS` for stakeholder attribution. API Reference was generated by enumerating registered routes in `cmd/registry/main.go`'s router setup, not by parsing comments — every documented endpoint corresponds to a route that exists in the running binary at commit `a3f8e21`.",
            "Test Plan and Test Cases were generated from the 61 `*_test.go` functions across `internal/`, `test/integration/`, and `test/e2e/`, preserving each test's original name as its traceability ID. Coverage figures were pulled directly from a `go test -coverprofile` run against that same commit.",
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
            "Clone the repository, then run `docker-compose up -d postgres minio` to start local Postgres and a MinIO instance standing in for S3. Run `go run ./cmd/registry` to start `registry-api-server` on `:8080` against the local stack — it applies pending migrations from `internal/store/migrations/` on boot, so no manual schema setup is required.",
          ],
        },
        {
          id: "2",
          title: "Publishing a Sample Module",
          level: 1,
          paragraphs: [
            "With the server running, `cd examples/sample-module && make publish` builds and publishes a throwaway `example-module` v0.1.0 against the local registry using the same `module-publish-worker` code path used in production. Confirm it landed with `curl localhost:8080/api/v1/modules/example-module`, then point a scratch Terraform config's `source` at `localhost:8080/example-module/aws` and run `terraform init` to confirm end-to-end protocol compliance locally.",
          ],
        },
        {
          id: "3",
          title: "Making a Change",
          level: 2,
          paragraphs: [
            "Locate the relevant package using the Low-Level Design's module breakdown, add or update tests alongside the change — the fake in-memory store in `internal/store/faketest/` makes most `internal/drift/` and `internal/publish/` changes testable without Postgres — and verify `go test ./...` passes locally before opening a pull request.",
          ],
        },
      ],
    },
  ],
};
