import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ConfigViewer from './pages/ConfigViewer'
import ConfigEditor from './pages/ConfigEditor'
import Clients from './pages/Clients'
import Logs from './pages/Logs'
import Environments from './pages/Environments'
import useWebSocket from './hooks/useWebSocket'
import useConfigStore from './store/configStore'

function NotificationStack() {
  const notifications = useConfigStore((s) => s.notifications)
  const dismiss = useConfigStore((s) => s.dismissNotification)

  if (!notifications.length) return null

  return (
    <div className="cp-notifications" aria-live="polite">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`cp-notification cp-notification--${n.type}`}
          role="status"
        >
          <div className="cp-notification__top">
            <div className="cp-notification__title">{n.title}</div>
            <button
              className="cp-btn"
              style={{ padding: '6px 10px', borderRadius: 10 }}
              onClick={() => dismiss(n.id)}
            >
              Dismiss
            </button>
          </div>
          <div className="cp-notification__msg">{n.message}</div>
        </div>
      ))}
    </div>
  )
}

function App() {
  // Initialize WebSocket once for the whole dashboard app.
  useWebSocket()

  return (
    <BrowserRouter>
      <div className="cp-shell">
        <Sidebar />
        <div className="cp-main">
          <Navbar />
          <NotificationStack />
          <div className="cp-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/configs" element={<ConfigViewer />} />
              <Route path="/editor" element={<ConfigEditor />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/environments" element={<Environments />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
