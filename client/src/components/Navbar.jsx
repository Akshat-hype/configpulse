import ClientBadge from './ClientBadge'
import EnvSwitcher from './EnvSwitcher'
import useConfigStore from '../store/configStore'

function formatTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function Navbar() {
  const wsConnected = useConfigStore((s) => s.wsConnected)
  const systemStatus = useConfigStore((s) => s.systemStatus)
  const lastConfigUpdate = useConfigStore((s) => s.lastConfigUpdate)

  return (
    <header className="cp-navbar">
      <div className="cp-brand">
        <span className="cp-brand-mark" />
        <span>ConfigPulse</span>
      </div>

      <div className="cp-inline" style={{ justifyContent: 'flex-end' }}>
        <EnvSwitcher compact />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginLeft: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ClientBadge connected={wsConnected} label={wsConnected ? 'WS Connected' : 'WS Offline'} />
          </div>
          <div className="cp-subtle" style={{ textAlign: 'right' }}>
            {systemStatus} · Last update: {formatTime(lastConfigUpdate)}
          </div>
        </div>
      </div>
    </header>
  )
}

