import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PreviewPage from './pages/PreviewPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* /ES, /NS, /OS — the :appId param selects which preview renders */}
      <Route path="/:appId" element={<PreviewPage />} />
      {/* Unknown paths fall back to the home index */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
