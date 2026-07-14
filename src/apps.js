// Central config: one entry per preview page. The URL segment is the key.
// 3 products (ES / NS / OS) × 2 tracks (I = Innovate, M = Modernize) = 6 pages.
// Add a new page by adding one entry here — no new routes or components needed.

export const apps = {
  ESI: {
    name: 'ES Innovate',
    tagline: 'Enterprise Suite — Innovate track. Greenfield bets and new builds.',
    projects: [
      { id: 'esi-1', name: 'AI Copilot Rollout', description: 'Embed an assistant across the enterprise console.', status: 'Active' },
      { id: 'esi-2', name: 'Realtime Insights', description: 'Streaming analytics for live decisioning.', status: 'Active' },
      { id: 'esi-3', name: 'Partner Sandbox', description: 'Self-serve environment for third-party builders.', status: 'Draft' },
    ],
  },
  ESM: {
    name: 'ES Modernize',
    tagline: 'Enterprise Suite — Modernize track. Migrations and platform upgrades.',
    projects: [
      { id: 'esm-1', name: 'Monolith Decomposition', description: 'Break the core app into services.', status: 'Active' },
      { id: 'esm-2', name: 'Cloud Re-platform', description: 'Lift core workloads to managed infra.', status: 'Active' },
      { id: 'esm-3', name: 'Legacy UI Refresh', description: 'Replace the jQuery admin with React.', status: 'Draft' },
    ],
  },
  NSI: {
    name: 'NS Innovate',
    tagline: 'Network Services — Innovate track. Next-gen connectivity.',
    projects: [
      { id: 'nsi-1', name: 'Edge Mesh', description: 'Distribute routing to edge nodes.', status: 'Active' },
      { id: 'nsi-2', name: 'Zero-Trust Fabric', description: 'Identity-aware network access.', status: 'Draft' },
      { id: 'nsi-3', name: 'Programmable QoS', description: 'Policy-driven traffic shaping.', status: 'Active' },
    ],
  },
  NSM: {
    name: 'NS Modernize',
    tagline: 'Network Services — Modernize track. Upgrading the backbone.',
    projects: [
      { id: 'nsm-1', name: 'IPv6 Migration', description: 'Dual-stack the remaining segments.', status: 'Active' },
      { id: 'nsm-2', name: 'Streaming Telemetry', description: 'Move monitoring off SNMP polling.', status: 'Active' },
      { id: 'nsm-3', name: 'Config Automation', description: 'Retire manual device configs.', status: 'Draft' },
    ],
  },
  OSI: {
    name: 'OS Innovate',
    tagline: 'Operations Suite — Innovate track. Smarter operations.',
    projects: [
      { id: 'osi-1', name: 'Predictive Alerting', description: 'ML-driven anomaly detection.', status: 'Active' },
      { id: 'osi-2', name: 'Auto-Remediation', description: 'Self-healing runbooks.', status: 'Draft' },
      { id: 'osi-3', name: 'Ops Copilot', description: 'Natural-language incident triage.', status: 'Active' },
    ],
  },
  OSM: {
    name: 'OS Modernize',
    tagline: 'Operations Suite — Modernize track. Consolidating tooling.',
    projects: [
      { id: 'osm-1', name: 'Tooling Consolidation', description: 'Merge four dashboards into one.', status: 'Active' },
      { id: 'osm-2', name: 'On-call Revamp', description: 'Modernize paging and escalation.', status: 'Active' },
      { id: 'osm-3', name: 'Runbook Library', description: 'Migrate wiki docs to versioned runbooks.', status: 'Draft' },
    ],
  },
}

// Normalize whatever comes off the URL (esi, Esi, ESI...) to a config key.
export function getApp(appId) {
  if (!appId) return null
  return apps[appId.toUpperCase()] ?? null
}
