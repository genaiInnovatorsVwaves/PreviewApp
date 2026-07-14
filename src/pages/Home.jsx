import { Link } from 'react-router-dom'
import { apps } from '../apps.js'

export default function Home() {
  return (
    <div className="app">
      <header className="hero">
        <h1>Preview App</h1>
        <p>Pick a preview — or jump straight to any track via its URL (e.g. /ESI).</p>
      </header>

      <section>
        <h2 className="section-title">Previews</h2>
        <div className="card-grid">
          {Object.entries(apps).map(([key, app]) => (
            <Link key={key} to={`/${key}`} className="card card-link">
              <h3>{app.name}</h3>
              <p>{app.tagline}</p>
              <span className="badge">/{key}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
