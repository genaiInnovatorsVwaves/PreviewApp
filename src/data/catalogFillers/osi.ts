import type { CatalogCard } from "../types";

export const osiFillers: CatalogCard[] = [
  {
    id: "osi-canary-rollout-manager",
    title: "Canary Rollout Manager",
    category: "Platform engineering",
    description:
      "Progressive delivery orchestration with automated canary analysis — traffic is shifted in stages and rolled back the moment error rate or latency deviates from baseline.",
    author: "Yashraj",
    minutesAgo: 34,
    platforms: ["osi"],
  },
  {
    id: "osi-service-mesh-console",
    title: "Service Mesh Console",
    category: "Platform engineering",
    description:
      "Unified control plane for mTLS policy, retry budgets, and traffic splitting across every mesh-enrolled service — no more hand-editing sidecar configs per namespace.",
    author: "Bhavesh",
    minutesAgo: 38,
    platforms: ["osi"],
  },
  {
    id: "osi-capacity-forecaster",
    title: "Capacity Forecaster",
    category: "Platform engineering",
    description:
      "Predicts cluster and node-pool exhaustion two weeks out from historical growth curves, so autoscaling limits get raised before a launch, not during an incident.",
    author: "Rohan",
    minutesAgo: 42,
    platforms: ["osi"],
  },
  {
    id: "osi-oncall-scheduler",
    title: "On-Call Scheduler",
    category: "Platform engineering",
    description:
      "Fair-rotation on-call scheduling with automatic handoff, timezone-aware paging, and burnout tracking that flags engineers approaching their escalation-load limit.",
    author: "Naman",
    minutesAgo: 46,
    platforms: ["osi"],
  },
  {
    id: "osi-config-drift-sentinel",
    title: "Config Drift Sentinel",
    category: "Platform engineering",
    description:
      "Continuously diffs live infrastructure state against its declared Terraform/Helm source of truth and opens a remediation PR the moment drift is detected.",
    author: "Hemant",
    minutesAgo: 50,
    platforms: ["osi"],
  },
  {
    id: "osi-database-reliability-console",
    title: "Database Reliability Console",
    category: "Platform engineering",
    description:
      "DBRE workbench for query regression detection, replication lag alerting, and safe schema-migration gating across every managed Postgres and MySQL cluster.",
    author: "Chetan",
    minutesAgo: 54,
    platforms: ["osi"],
  },
  {
    id: "osi-api-gateway-manager",
    title: "API Gateway Manager",
    category: "Platform engineering",
    description:
      "Central policy authoring for rate limits, auth, and request transforms across every edge gateway, with per-route traffic analytics and versioned rollout history.",
    author: "aayush",
    minutesAgo: 58,
    platforms: ["osi"],
  },
  {
    id: "osi-artifact-registry-hub",
    title: "Artifact Registry Hub",
    category: "Platform engineering",
    description:
      "Unified package and container artifact registry with retention policies, vulnerability re-scanning on schedule, and promotion pipelines between staging and production repos.",
    author: "Mohak",
    minutesAgo: 62,
    platforms: ["osi"],
  },
  {
    id: "osi-developer-portal",
    title: "Internal Developer Portal",
    category: "Platform engineering",
    description:
      "Self-service software catalog and golden-path scaffolding — new services are provisioned with CI, observability, and on-call wiring already attached.",
    author: "Prem",
    minutesAgo: 66,
    platforms: ["osi"],
  },
  {
    id: "osi-synthetic-monitoring-suite",
    title: "Synthetic Monitoring Suite",
    category: "Platform engineering",
    description:
      "Scripted user-journey checks run from twelve global regions every sixty seconds, catching customer-facing regressions before real users file the first ticket.",
    author: "Sudarshan",
    minutesAgo: 70,
    platforms: ["osi"],
  },
  {
    id: "osi-log-pipeline-manager",
    title: "Log Pipeline Manager",
    category: "Platform engineering",
    description:
      "Visual routing and transformation for high-volume log pipelines — sampling, redaction, and destination fan-out configured without touching a Fluentd config file.",
    author: "Aditi",
    minutesAgo: 74,
    platforms: ["osi"],
  },
  {
    id: "osi-disaster-recovery-orchestrator",
    title: "Disaster Recovery Orchestrator",
    category: "Platform engineering",
    description:
      "Automates cross-region failover runbooks and validates RTO/RPO targets with scheduled DR drills, turning a four-hour manual failover into a fifteen-minute scripted one.",
    author: "Yashraj",
    minutesAgo: 78,
    platforms: ["osi"],
  },
  {
    id: "osi-compliance-as-code-engine",
    title: "Compliance-as-Code Engine",
    category: "Platform engineering",
    description:
      "Encodes SOC2 and PCI control requirements as policy checks that run in CI, blocking non-compliant infrastructure changes before they merge instead of at next quarter's audit.",
    author: "Bhavesh",
    minutesAgo: 82,
    platforms: ["osi"],
  },
  {
    id: "osi-cost-anomaly-detector",
    title: "Cost Anomaly Detector",
    category: "Platform engineering",
    description:
      "Flags sudden per-service spend spikes in near real time by correlating billing deltas with recent deploys, catching a misconfigured autoscaler before it burns a week's budget.",
    author: "Rohan",
    minutesAgo: 86,
    platforms: ["osi"],
  },
  {
    id: "osi-self-service-provisioning",
    title: "Self-Service Environment Provisioning",
    category: "Platform engineering",
    description:
      "Catalog-driven provisioning for databases, queues, and namespaces with guardrailed defaults — teams get infrastructure in minutes without filing a platform ticket.",
    author: "Naman",
    minutesAgo: 90,
    platforms: ["osi"],
  },
  {
    id: "osi-slo-error-budget-tracker",
    title: "SLO & Error Budget Tracker",
    category: "Platform engineering",
    description:
      "Live error-budget burn-down per service with automatic release freezes when budget depletes, keeping reliability targets enforced instead of aspirational.",
    author: "Hemant",
    minutesAgo: 94,
    platforms: ["osi"],
  },
  {
    id: "osi-dependency-license-scanner",
    title: "Dependency & License Scanner",
    category: "Platform engineering",
    description:
      "Continuous SBOM generation with license-risk classification, blocking copyleft dependencies from shipping into proprietary codebases without legal sign-off.",
    author: "Chetan",
    minutesAgo: 98,
    platforms: ["osi"],
  },
  {
    id: "osi-runbook-automation-studio",
    title: "Runbook Automation Studio",
    category: "Platform engineering",
    description:
      "Converts markdown incident runbooks into executable, auditable automation steps that on-call engineers trigger with one click instead of copy-pasting shell commands.",
    author: "aayush",
    minutesAgo: 102,
    platforms: ["osi"],
  },
  {
    id: "osi-sandbox-lifecycle-manager",
    title: "Sandbox Lifecycle Manager",
    category: "Platform engineering",
    description:
      "Ephemeral per-PR preview environments spun up on push and torn down on merge, eliminating the shared staging-environment queue that used to bottleneck every release.",
    author: "Mohak",
    minutesAgo: 106,
    platforms: ["osi"],
  },
  {
    id: "osi-deployment-freeze-coordinator",
    title: "Deployment Freeze Coordinator",
    category: "Platform engineering",
    description:
      "Schedules and enforces org-wide or team-scoped deploy freezes around peak traffic windows, with automatic override approval routing for genuine hotfixes.",
    author: "Prem",
    minutesAgo: 110,
    platforms: ["osi"],
  },
  {
    id: "osi-fleet-manager",
    title: "Multi-Cluster Fleet Manager",
    category: "Platform engineering",
    description:
      "Single-pane rollout and policy enforcement across dozens of Kubernetes clusters spanning regions and cloud providers, with drift and version-skew alerting per fleet.",
    author: "Sudarshan",
    minutesAgo: 114,
    platforms: ["osi"],
  },
  {
    id: "osi-edge-cdn-console",
    title: "Edge & CDN Operations Console",
    category: "Platform engineering",
    description:
      "Cache-rule authoring, purge orchestration, and origin-shield health monitoring across every CDN POP, with instant rollback on a bad cache-key change.",
    author: "Aditi",
    minutesAgo: 118,
    platforms: ["osi"],
  },
  {
    id: "osi-load-test-orchestrator",
    title: "Load Test Orchestrator",
    category: "Platform engineering",
    description:
      "Schedules distributed load tests against staging and shadow-traffic mirrors, auto-comparing latency percentiles release-over-release to catch capacity regressions pre-launch.",
    author: "Yashraj",
    minutesAgo: 122,
    platforms: ["osi"],
  },
  {
    id: "osi-secret-rotation-scheduler",
    title: "Secret Rotation Scheduler",
    category: "Platform engineering",
    description:
      "Policy-driven rotation calendars for API keys and database credentials across every environment, with dependent-service reload orchestrated automatically post-rotation.",
    author: "Bhavesh",
    minutesAgo: 126,
    platforms: ["osi"],
  },
  {
    id: "osi-postmortem-knowledge-base",
    title: "Postmortem Knowledge Base",
    category: "Platform engineering",
    description:
      "Structured incident postmortem repository with automatic action-item tracking and cross-incident pattern detection, surfacing recurring root causes teams keep re-fixing.",
    author: "Rohan",
    minutesAgo: 130,
    platforms: ["osi"],
  },
  {
    id: "osi-feature-rollout-analyzer",
    title: "Feature Rollout Analyzer",
    category: "Platform engineering",
    description:
      "Correlates feature-flag rollout percentages against error rate and performance metrics in real time, auto-pausing a rollout the moment a regression signal appears.",
    author: "Naman",
    minutesAgo: 134,
    platforms: ["osi"],
  },
  {
    id: "osi-kubernetes-rbac-auditor",
    title: "Kubernetes RBAC Auditor",
    category: "Platform engineering",
    description:
      "Continuously audits cluster RoleBindings against least-privilege baselines and flags over-permissioned service accounts before they become an incident-report footnote.",
    author: "Hemant",
    minutesAgo: 138,
    platforms: ["osi"],
  },
  {
    id: "osi-build-pipeline-analytics",
    title: "Build Pipeline Analytics",
    category: "Platform engineering",
    description:
      "Tracks CI build duration, flake rate, and queue time per repository, ranking the slowest pipeline stages so platform teams know exactly where to spend optimization effort.",
    author: "Chetan",
    minutesAgo: 142,
    platforms: ["osi"],
  },
  {
    id: "osi-network-policy-designer",
    title: "Network Policy Designer",
    category: "Platform engineering",
    description:
      "Visual builder for Kubernetes NetworkPolicies with a simulation mode that shows exactly which pods gain or lose connectivity before a policy is applied.",
    author: "aayush",
    minutesAgo: 146,
    platforms: ["osi"],
  },
  {
    id: "osi-status-page-manager",
    title: "Status Page Manager",
    category: "Platform engineering",
    description:
      "Automated public and internal status pages driven directly by incident and monitoring state, so customer-facing status never lags behind what on-call already knows.",
    author: "Mohak",
    minutesAgo: 150,
    platforms: ["osi"],
  },
  {
    id: "osi-backup-verification-service",
    title: "Backup Verification Service",
    category: "Platform engineering",
    description:
      "Automatically restores a sample of nightly backups into an isolated sandbox and verifies data integrity, catching silent backup corruption months before a real restore would.",
    author: "Prem",
    minutesAgo: 154,
    platforms: ["osi"],
  },
  {
    id: "osi-api-deprecation-tracker",
    title: "API Deprecation Tracker",
    category: "Platform engineering",
    description:
      "Tracks internal API version usage across every consuming service and generates a migration-readiness report before a deprecated endpoint is sunset.",
    author: "Sudarshan",
    minutesAgo: 158,
    platforms: ["osi"],
  },
  {
    id: "osi-terraform-state-guardian",
    title: "Terraform State Guardian",
    category: "Platform engineering",
    description:
      "Locks, versions, and diff-reviews Terraform state changes across every workspace, preventing the concurrent-apply state corruption that used to require a manual state-file surgery.",
    author: "Aditi",
    minutesAgo: 162,
    platforms: ["osi"],
  },
  {
    id: "osi-latency-budget-simulator",
    title: "Latency Budget Simulator",
    category: "Platform engineering",
    description:
      "Models end-to-end request latency across a service dependency graph, showing which downstream call is eating the p99 budget before a new feature ships.",
    author: "Yashraj",
    minutesAgo: 166,
    platforms: ["osi"],
  },
  {
    id: "osi-queue-depth-monitor",
    title: "Queue Depth Monitor",
    category: "Platform engineering",
    description:
      "Real-time backlog and consumer-lag tracking across every message queue and topic, with predictive alerts before a slow consumer turns into a multi-hour processing backlog.",
    author: "Bhavesh",
    minutesAgo: 170,
    platforms: ["osi"],
  },
  {
    id: "osi-cluster-upgrade-planner",
    title: "Cluster Upgrade Planner",
    category: "Platform engineering",
    description:
      "Sequences Kubernetes version upgrades across a fleet with pre-flight API-deprecation checks, rolling node-pool cordon/drain orchestration, and automatic rollback on health-check failure.",
    author: "Rohan",
    minutesAgo: 174,
    platforms: ["osi"],
  },
  {
    id: "osi-permission-request-workflow",
    title: "Just-In-Time Access Workflow",
    category: "Platform engineering",
    description:
      "Time-boxed, approval-gated elevated access requests for production systems, with every grant automatically expiring and every session fully audit-logged.",
    author: "Naman",
    minutesAgo: 178,
    platforms: ["osi"],
  },
  {
    id: "osi-release-notes-generator",
    title: "Release Notes Generator",
    category: "Platform engineering",
    description:
      "Compiles merged PRs, linked tickets, and changed API surfaces into structured release notes automatically, replacing the release-day scramble to remember what shipped.",
    author: "Hemant",
    minutesAgo: 182,
    platforms: ["osi"],
  },
  {
    id: "osi-infra-cost-allocation-engine",
    title: "Infra Cost Allocation Engine",
    category: "Platform engineering",
    description:
      "Attributes shared infrastructure spend down to owning team and service using tag-based and usage-proportional allocation, ending the recurring finance-vs-engineering cost dispute.",
    author: "Chetan",
    minutesAgo: 186,
    platforms: ["osi"],
  },
  {
    id: "osi-dns-change-governor",
    title: "DNS Change Governor",
    category: "Platform engineering",
    description:
      "Peer-reviewed, auditable DNS record management with automated propagation verification, preventing the single-typo DNS outage that takes down an entire domain.",
    author: "aayush",
    minutesAgo: 190,
    platforms: ["osi"],
  },
  {
    id: "osi-service-catalog-health-index",
    title: "Service Catalog Health Index",
    category: "Platform engineering",
    description:
      "Scores every registered service on ownership clarity, on-call coverage, test coverage, and documentation completeness, surfacing the orphaned services nobody wants to admit exist.",
    author: "Mohak",
    minutesAgo: 194,
    platforms: ["osi"],
  },
  {
    id: "osi-webhook-delivery-tracker",
    title: "Webhook Delivery Tracker",
    category: "Platform engineering",
    description:
      "Tracks delivery status, retry backoff, and signature validation for every outbound webhook, with a replay console for partner integrations that silently stopped receiving events.",
    author: "Prem",
    minutesAgo: 198,
    platforms: ["osi"],
  },
  {
    id: "osi-gpu-cluster-scheduler",
    title: "GPU Cluster Scheduler",
    category: "Platform engineering",
    description:
      "Fair-share GPU scheduling across ML training and inference workloads with fragmentation-aware bin packing, lifting utilization on shared GPU pools that used to sit half-idle.",
    author: "Sudarshan",
    minutesAgo: 202,
    platforms: ["osi"],
  },
  {
    id: "osi-alert-noise-reducer",
    title: "Alert Noise Reducer",
    category: "Platform engineering",
    description:
      "Clusters correlated alerts into a single actionable incident using topology and timing signals, cutting a 40-page-storm night down to the three alerts that actually mattered.",
    author: "Aditi",
    minutesAgo: 206,
    platforms: ["osi"],
  },
  {
    id: "osi-platform-adoption-tracker",
    title: "Platform Adoption Tracker",
    category: "Platform engineering",
    description:
      "Measures golden-path and internal-tooling adoption per team against platform engineering OKRs, showing leadership exactly which paved roads are actually being walked.",
    author: "Yashraj",
    minutesAgo: 210,
    platforms: ["osi"],
  },
  {
    id: "osi-blue-green-cutover-console",
    title: "Blue-Green Cutover Console",
    category: "Platform engineering",
    description:
      "One-click traffic cutover between blue and green environments with automated smoke tests gating the switch and instant revert if post-cutover health checks fail.",
    author: "Bhavesh",
    minutesAgo: 214,
    platforms: ["osi"],
  },
];
