import type { CatalogCard } from "../types";

export const osmFillers: CatalogCard[] = [
  {
    id: "osm-canary-rollout-controller",
    title: "Canary Rollout Controller",
    category: "Reverse-engineered documentation",
    description:
      "Go-based canary deployment controller reverse-engineered into a full documentation set — rollout policies, health-check gates, and rollback triggers now traceable end to end.",
    author: "Prem",
    minutesAgo: 25,
    platforms: ["osm"],
  },
  {
    id: "osm-service-mesh-config-generator",
    title: "Service Mesh Config Generator",
    category: "Reverse-engineered documentation",
    description:
      "Envoy config-generation service written in Rust, documented from source — traffic-split rules, mTLS policy inheritance, and sidecar injection logic mapped module by module.",
    author: "Aditi",
    minutesAgo: 29,
    platforms: ["osm"],
  },
  {
    id: "osm-on-call-scheduler-service",
    title: "On-Call Scheduler Service",
    category: "Reverse-engineered documentation",
    description:
      "Python on-call rotation and escalation-policy service, reverse-engineered into HLD, LLD, and API reference — shift handoff logic and override rules fully documented.",
    author: "Mohak",
    minutesAgo: 33,
    platforms: ["osm"],
  },
  {
    id: "osm-artifact-registry-proxy",
    title: "Artifact Registry Proxy",
    category: "Reverse-engineered documentation",
    description:
      "Java pull-through cache and proxy for container and package registries, documented end-to-end — upstream failover, checksum verification, and quota enforcement now onboarding-ready.",
    author: "Bhavesh",
    minutesAgo: 37,
    platforms: ["osm"],
  },
  {
    id: "osm-cost-anomaly-detector",
    title: "Cost Anomaly Detector",
    category: "Reverse-engineered documentation",
    description:
      "Python cloud-spend anomaly detection service, reverse-engineered into a full documentation set covering its statistical baseline models, alert thresholds, and cost-center attribution logic.",
    author: "Chetan",
    minutesAgo: 41,
    platforms: ["osm"],
  },
  {
    id: "osm-synthetic-monitoring-agent",
    title: "Synthetic Monitoring Agent",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript synthetic-transaction and uptime-check agent, documented from its codebase — probe scheduling, assertion DSL, and multi-region execution now fully traceable.",
    author: "Rohan",
    minutesAgo: 45,
    platforms: ["osm"],
  },
  {
    id: "osm-log-pipeline-router",
    title: "Log Pipeline Router",
    category: "Reverse-engineered documentation",
    description:
      "Go-based log ingestion and routing pipeline, reverse-engineered into HLD, LLD, and data-flow documentation — parsing rules, backpressure handling, and sink fan-out mapped in full.",
    author: "Sudarshan",
    minutesAgo: 49,
    platforms: ["osm"],
  },
  {
    id: "osm-dr-failover-orchestrator",
    title: "DR Failover Orchestrator",
    category: "Reverse-engineered documentation",
    description:
      "Kotlin disaster-recovery failover orchestrator, documented end-to-end from source — region-health voting, data-replication checks, and failback sequencing now audit-ready.",
    author: "Hemant",
    minutesAgo: 53,
    platforms: ["osm"],
  },
  {
    id: "osm-compliance-as-code-engine",
    title: "Compliance-as-Code Engine",
    category: "Reverse-engineered documentation",
    description:
      "Rego/OPA-based compliance-as-code policy engine, reverse-engineered into a full documentation set — control mappings, exception workflows, and evaluation traces now explainable.",
    author: "aayush",
    minutesAgo: 57,
    platforms: ["osm"],
  },
  {
    id: "osm-sandbox-provisioning-api",
    title: "Sandbox Provisioning API",
    category: "Reverse-engineered documentation",
    description:
      "Node.js self-service sandbox provisioning API, documented from its codebase — quota policies, TTL-based teardown, and namespace isolation rules covered end to end.",
    author: "Naman",
    minutesAgo: 61,
    platforms: ["osm"],
  },
  {
    id: "osm-slo-tracker-backend",
    title: "SLO Tracker Backend",
    category: "Reverse-engineered documentation",
    description:
      "Go error-budget and SLO-tracking backend, reverse-engineered into HLD, LLD, and API documentation — burn-rate alerting windows and budget-reset logic mapped module by module.",
    author: "Yashraj",
    minutesAgo: 65,
    platforms: ["osm"],
  },
  {
    id: "osm-dependency-scanner-service",
    title: "Dependency Scanner Service",
    category: "Reverse-engineered documentation",
    description:
      "Java software-composition-analysis service, documented end-to-end from source — CVE matching, license-policy enforcement, and build-gate integration now fully traceable.",
    author: "Prem",
    minutesAgo: 69,
    platforms: ["osm"],
  },
  {
    id: "osm-runbook-automation-engine",
    title: "Runbook Automation Engine",
    category: "Reverse-engineered documentation",
    description:
      "Python automated-runbook execution engine, reverse-engineered into a full documentation set — trigger conditions, approval gates, and step-level rollback logic now onboarding-ready.",
    author: "Aditi",
    minutesAgo: 73,
    platforms: ["osm"],
  },
  {
    id: "osm-fleet-config-manager",
    title: "Fleet Config Manager",
    category: "Reverse-engineered documentation",
    description:
      "Go node-fleet configuration management service, documented from its codebase — desired-state reconciliation, drift remediation, and rollout batching mapped in full.",
    author: "Mohak",
    minutesAgo: 77,
    platforms: ["osm"],
  },
  {
    id: "osm-cdn-edge-rules-service",
    title: "CDN Edge Rules Service",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript edge-rules and CDN configuration service, reverse-engineered into HLD, LLD, and API reference — cache-key logic, header rewriting, and edge-function deployment covered end to end.",
    author: "Bhavesh",
    minutesAgo: 81,
    platforms: ["osm"],
  },
  {
    id: "osm-ci-pipeline-orchestrator",
    title: "CI Pipeline Orchestrator",
    category: "Reverse-engineered documentation",
    description:
      "Go continuous-integration pipeline orchestrator, documented end-to-end from source — DAG scheduling, artifact caching, and parallel-stage execution now fully traceable.",
    author: "Chetan",
    minutesAgo: 85,
    platforms: ["osm"],
  },
  {
    id: "osm-deploy-freeze-window-service",
    title: "Deploy Freeze Window Service",
    category: "Reverse-engineered documentation",
    description:
      "Python deployment-freeze and change-window enforcement service, reverse-engineered into a full documentation set — exception approvals and calendar-integration logic mapped module by module.",
    author: "Rohan",
    minutesAgo: 89,
    platforms: ["osm"],
  },
  {
    id: "osm-config-drift-detector",
    title: "Config Drift Detector",
    category: "Reverse-engineered documentation",
    description:
      "Terraform/HCL-aware config-drift detection service, documented from its codebase — state-diffing algorithms, remediation-plan generation, and notification routing covered in full.",
    author: "Sudarshan",
    minutesAgo: 93,
    platforms: ["osm"],
  },
  {
    id: "osm-database-reliability-toolkit",
    title: "Database Reliability Toolkit",
    category: "Reverse-engineered documentation",
    description:
      "Go DBRE toolkit for schema-migration safety and replica-lag monitoring, reverse-engineered into HLD, LLD, and operational-runbook documentation.",
    author: "Hemant",
    minutesAgo: 97,
    platforms: ["osm"],
  },
  {
    id: "osm-api-gateway-policy-engine",
    title: "API Gateway Policy Engine",
    category: "Reverse-engineered documentation",
    description:
      "Java API-gateway policy engine, documented end-to-end from source — rate-limiting rules, auth-token validation, and request-transformation chains now onboarding-ready.",
    author: "aayush",
    minutesAgo: 101,
    platforms: ["osm"],
  },
  {
    id: "osm-container-image-signer",
    title: "Container Image Signer",
    category: "Reverse-engineered documentation",
    description:
      "Go image-signing and provenance-attestation service, reverse-engineered into a full documentation set — signing-key rotation, attestation schema, and verification-webhook logic covered in full.",
    author: "Naman",
    minutesAgo: 105,
    platforms: ["osm"],
  },
  {
    id: "osm-internal-developer-platform-core",
    title: "Internal Developer Platform Core",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript/Node internal developer platform core services, documented from its codebase — service-catalog schema, golden-path scaffolding, and self-service API surface mapped module by module.",
    author: "Yashraj",
    minutesAgo: 109,
    platforms: ["osm"],
  },
  {
    id: "osm-metric-aggregation-pipeline",
    title: "Metric Aggregation Pipeline",
    category: "Reverse-engineered documentation",
    description:
      "Go metrics-aggregation and downsampling pipeline, reverse-engineered into HLD, LLD, and data-flow documentation — rollup windows and cardinality-control logic now fully traceable.",
    author: "Prem",
    minutesAgo: 113,
    platforms: ["osm"],
  },
  {
    id: "osm-ephemeral-environment-manager",
    title: "Ephemeral Environment Manager",
    category: "Reverse-engineered documentation",
    description:
      "Python ephemeral preview-environment manager, documented end-to-end from source — PR-triggered provisioning, resource quotas, and automatic teardown scheduling covered in full.",
    author: "Aditi",
    minutesAgo: 117,
    platforms: ["osm"],
  },
  {
    id: "osm-node-pool-autoscaler",
    title: "Node Pool Autoscaler",
    category: "Reverse-engineered documentation",
    description:
      "Go Kubernetes node-pool autoscaler, reverse-engineered into a full documentation set — bin-packing heuristics, scale-down safety checks, and spot-node eviction handling mapped module by module.",
    author: "Mohak",
    minutesAgo: 121,
    platforms: ["osm"],
  },
  {
    id: "osm-blue-green-deployment-service",
    title: "Blue-Green Deployment Service",
    category: "Reverse-engineered documentation",
    description:
      "Kotlin blue-green deployment orchestration service, documented from its codebase — traffic-cutover sequencing, smoke-test gating, and instant-rollback logic now onboarding-ready.",
    author: "Bhavesh",
    minutesAgo: 125,
    platforms: ["osm"],
  },
  {
    id: "osm-capacity-planning-simulator",
    title: "Capacity Planning Simulator",
    category: "Reverse-engineered documentation",
    description:
      "Python capacity-planning simulation engine, reverse-engineered into HLD, LLD, and API reference — demand-forecast models and headroom-calculation logic covered end to end.",
    author: "Chetan",
    minutesAgo: 129,
    platforms: ["osm"],
  },
  {
    id: "osm-incident-timeline-aggregator",
    title: "Incident Timeline Aggregator",
    category: "Reverse-engineered documentation",
    description:
      "Go incident-timeline aggregation service, documented end-to-end from source — event correlation windows, timeline-merge logic, and postmortem-export formatting fully traceable.",
    author: "Rohan",
    minutesAgo: 133,
    platforms: ["osm"],
  },
  {
    id: "osm-secrets-rotation-scheduler",
    title: "Secrets Rotation Scheduler",
    category: "Reverse-engineered documentation",
    description:
      "Rust secrets-rotation scheduling service, reverse-engineered into a full documentation set — rotation cadence rules, dependent-service notification, and rollback-on-failure handling mapped module by module.",
    author: "Sudarshan",
    minutesAgo: 137,
    platforms: ["osm"],
  },
  {
    id: "osm-vulnerability-patch-tracker",
    title: "Vulnerability Patch Tracker",
    category: "Reverse-engineered documentation",
    description:
      "Java vulnerability-remediation tracking service, documented from its codebase — patch-SLA calculation, exception-approval workflow, and fleet-coverage reporting covered in full.",
    author: "Hemant",
    minutesAgo: 141,
    platforms: ["osm"],
  },
  {
    id: "osm-service-catalog-registry",
    title: "Service Catalog Registry",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript service-catalog and ownership-registry backend, reverse-engineered into HLD, LLD, and API documentation — metadata schema and dependency-graph derivation now onboarding-ready.",
    author: "aayush",
    minutesAgo: 145,
    platforms: ["osm"],
  },
  {
    id: "osm-load-test-harness",
    title: "Load Test Harness",
    category: "Reverse-engineered documentation",
    description:
      "Go distributed load-testing harness, documented end-to-end from source — worker-coordination protocol, ramp-profile DSL, and result-aggregation logic fully traceable.",
    author: "Naman",
    minutesAgo: 149,
    platforms: ["osm"],
  },
  {
    id: "osm-chargeback-reporting-service",
    title: "Chargeback Reporting Service",
    category: "Reverse-engineered documentation",
    description:
      "Python cloud-chargeback and showback reporting service, reverse-engineered into a full documentation set — cost-allocation rules and tag-inheritance logic mapped module by module.",
    author: "Yashraj",
    minutesAgo: 153,
    platforms: ["osm"],
  },
  {
    id: "osm-kubernetes-admission-controller",
    title: "Kubernetes Admission Controller",
    category: "Reverse-engineered documentation",
    description:
      "Go Kubernetes admission-webhook controller, documented from its codebase — policy-evaluation order, mutation-vs-validation flow, and failure-mode handling covered end to end.",
    author: "Prem",
    minutesAgo: 157,
    platforms: ["osm"],
  },
  {
    id: "osm-multi-region-traffic-router",
    title: "Multi-Region Traffic Router",
    category: "Reverse-engineered documentation",
    description:
      "Go global-traffic-routing service, reverse-engineered into HLD, LLD, and data-flow documentation — latency-based routing, health-aware failover, and geo-fencing rules fully traceable.",
    author: "Aditi",
    minutesAgo: 161,
    platforms: ["osm"],
  },
  {
    id: "osm-backup-verification-service",
    title: "Backup Verification Service",
    category: "Reverse-engineered documentation",
    description:
      "Python automated backup-restore verification service, documented end-to-end from source — checksum validation, restore-drill scheduling, and integrity-report generation now onboarding-ready.",
    author: "Mohak",
    minutesAgo: 165,
    platforms: ["osm"],
  },
  {
    id: "osm-alert-noise-reducer",
    title: "Alert Noise Reducer",
    category: "Reverse-engineered documentation",
    description:
      "Java alert-deduplication and noise-reduction service, reverse-engineered into a full documentation set — correlation windows, suppression rules, and fatigue-scoring logic mapped module by module.",
    author: "Bhavesh",
    minutesAgo: 169,
    platforms: ["osm"],
  },
  {
    id: "osm-deployment-approval-gateway",
    title: "Deployment Approval Gateway",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript deployment-approval gateway service, documented from its codebase — multi-stage sign-off logic, quorum rules, and audit-trail generation covered in full.",
    author: "Chetan",
    minutesAgo: 173,
    platforms: ["osm"],
  },
  {
    id: "osm-cluster-upgrade-orchestrator",
    title: "Cluster Upgrade Orchestrator",
    category: "Reverse-engineered documentation",
    description:
      "Go Kubernetes cluster-upgrade orchestration service, reverse-engineered into HLD, LLD, and operational-runbook documentation — drain sequencing, version-skew checks, and rollback windows fully traceable.",
    author: "Rohan",
    minutesAgo: 177,
    platforms: ["osm"],
  },
  {
    id: "osm-telemetry-sampling-controller",
    title: "Telemetry Sampling Controller",
    category: "Reverse-engineered documentation",
    description:
      "Rust trace-sampling and telemetry-control service, documented end-to-end from source — adaptive sampling algorithms and tail-based retention rules mapped module by module.",
    author: "Sudarshan",
    minutesAgo: 181,
    platforms: ["osm"],
  },
  {
    id: "osm-access-review-automation-service",
    title: "Access Review Automation Service",
    category: "Reverse-engineered documentation",
    description:
      "Python periodic-access-review automation service, reverse-engineered into a full documentation set — reviewer-assignment logic, evidence-collection workflow, and revocation triggers covered end to end.",
    author: "Hemant",
    minutesAgo: 185,
    platforms: ["osm"],
  },
  {
    id: "osm-golden-path-template-generator",
    title: "Golden Path Template Generator",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript golden-path scaffolding and template-generation service, documented from its codebase — templating engine, variable substitution, and post-generation hook logic fully traceable.",
    author: "aayush",
    minutesAgo: 189,
    platforms: ["osm"],
  },
  {
    id: "osm-rate-limiter-config-service",
    title: "Rate Limiter Config Service",
    category: "Reverse-engineered documentation",
    description:
      "Go token-bucket rate-limiting configuration service, reverse-engineered into HLD, LLD, and API reference — per-tenant quota rules and burst-allowance logic mapped module by module.",
    author: "Naman",
    minutesAgo: 193,
    platforms: ["osm"],
  },
  {
    id: "osm-health-check-aggregator",
    title: "Health Check Aggregator",
    category: "Reverse-engineered documentation",
    description:
      "Java service-health aggregation backend, documented end-to-end from source — dependency-weighted health scoring and composite-status derivation covered in full.",
    author: "Yashraj",
    minutesAgo: 197,
    platforms: ["osm"],
  },
  {
    id: "osm-spot-instance-reclaimer",
    title: "Spot Instance Reclaimer",
    category: "Reverse-engineered documentation",
    description:
      "Go spot/preemptible-instance reclamation service, reverse-engineered into a full documentation set — interruption-notice handling and graceful-drain sequencing mapped module by module.",
    author: "Prem",
    minutesAgo: 201,
    platforms: ["osm"],
  },
  {
    id: "osm-postmortem-knowledge-base",
    title: "Postmortem Knowledge Base",
    category: "Reverse-engineered documentation",
    description:
      "TypeScript postmortem archive and knowledge-base service, documented from its codebase — tagging taxonomy, action-item tracking, and cross-incident search indexing covered end to end.",
    author: "Aditi",
    minutesAgo: 205,
    platforms: ["osm"],
  },
  {
    id: "osm-change-risk-scoring-engine",
    title: "Change Risk Scoring Engine",
    category: "Reverse-engineered documentation",
    description:
      "Python change-risk scoring engine, reverse-engineered into HLD, LLD, and API documentation — blast-radius estimation, historical-failure weighting, and approval-routing thresholds fully traceable.",
    author: "Mohak",
    minutesAgo: 209,
    platforms: ["osm"],
  },
  {
    id: "osm-dns-automation-service",
    title: "DNS Automation Service",
    category: "Reverse-engineered documentation",
    description:
      "Go DNS record-automation and zone-management service, documented end-to-end from source — record-reconciliation logic, TTL policy, and change-propagation verification mapped module by module.",
    author: "Bhavesh",
    minutesAgo: 213,
    platforms: ["osm"],
  },
  {
    id: "osm-job-queue-throttler",
    title: "Job Queue Throttler",
    category: "Reverse-engineered documentation",
    description:
      "Java background-job queue throttling service, reverse-engineered into a full documentation set — priority-lane scheduling, backoff strategy, and dead-letter handling covered in full.",
    author: "Chetan",
    minutesAgo: 217,
    platforms: ["osm"],
  },
  {
    id: "osm-environment-parity-checker",
    title: "Environment Parity Checker",
    category: "Reverse-engineered documentation",
    description:
      "Python config and dependency parity-checking service across staging and production, documented from its codebase — diffing engine and drift-report generation fully traceable.",
    author: "Rohan",
    minutesAgo: 221,
    platforms: ["osm"],
  },
];
