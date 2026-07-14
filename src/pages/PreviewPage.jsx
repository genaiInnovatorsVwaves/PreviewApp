import { useParams, Link } from 'react-router-dom'
import { getApp } from '../apps.js'

export default function PreviewPage() {
  const { appId } = useParams()
  const app = getApp(appId)

  // URL segment didn't match any configured preview.
  if (!app) {
    return (
      <div className="app">
        <header className="hero">
          <h1>Preview not found</h1>
          <p>“/{appId}” isn’t one of the previews.</p>
        </header>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="badge badge-link">← Back to all previews</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="topnav">
        <Link to="/" className="nav-link">← All previews</Link>
      </nav>

      <header className="hero">
        <h1>Welcome to {app.name}</h1>
        <p>{app.tagline}</p>
      </header>

      <section>
        <h2 className="section-title">Projects</h2>
        <div className="card-grid">
          {app.projects.map((project) => (
            <article key={project.id} className="card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="badge">{project.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
