// Central config: one entry per preview. The URL segment (ES / NS / OS) is the key.
// Add a new preview by adding one entry here — no new routes or components needed.

const sharedProjects = [
  { id: 1, name: 'Project Alpha', description: 'A placeholder project to preview the card layout.', status: 'Active' },
  { id: 2, name: 'Project Beta', description: 'Another sample project shown in the list view.', status: 'Draft' },
  { id: 3, name: 'Project Gamma', description: 'Demonstrates how project cards wrap on the grid.', status: 'Active' },
  { id: 4, name: 'Project Delta', description: 'Placeholder content for a fourth project entry.', status: 'Archived' },
  { id: 5, name: 'Project Epsilon', description: 'Sample data to fill out the project gallery.', status: 'Active' },
  { id: 6, name: 'Project Zeta', description: 'Final placeholder card in the demo list.', status: 'Draft' },
]

export const apps = {
  ES: { name: 'ESPreview', tagline: 'Enterprise Suite preview environment.', projects: sharedProjects },
  NS: { name: 'NSPreview', tagline: 'Network Services preview environment.', projects: sharedProjects },
  OS: { name: 'OSPreview', tagline: 'Operations Suite preview environment.', projects: sharedProjects },
}

// Normalize whatever comes off the URL (es, Es, ES...) to a config key.
export function getApp(appId) {
  if (!appId) return null
  return apps[appId.toUpperCase()] ?? null
}
