import { useEffect } from 'react'

import ConfigCard from '../components/ConfigCard'
import ClientBadge from '../components/ClientBadge'
import EnvSwitcher from '../components/EnvSwitcher'
import useConfigStore from '../store/configStore'

function formatTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function getConnectedCount(clients) {
  if (!Array.isArray(clients)) return 0
  return clients.filter((c) => {
    const status = (c?.connectionStatus ?? c?.status ?? c?.state ?? '').toString().toLowerCase()
    const connectedFlag = Boolean(c?.connected)
    return connectedFlag || status === 'connected' || status === 'online'
  }).length
}

export default function Dashboard() {
  const wsConnected = useConfigStore((s) => s.wsConnected)
  const apiHealthy = useConfigStore((s) => s.apiHealthy)
  const clients = useConfigStore((s) => s.clients)
  const lastConfigUpdate = useConfigStore((s) => s.lastConfigUpdate)
  const environment = useConfigStore((s) => s.environment)

  const fetchHealth = useConfigStore((s) => s.fetchHealth)
  const fetchClients = useConfigStore((s) => s.fetchClients)

  useEffect(() => {
    fetchHealth()
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectedCount = getConnectedCount(clients)
  const systemLabel =
    wsConnected && apiHealthy === false
      ? 'Degraded'
      : wsConnected
        ? 'Operational'
        : 'Offline'

  return (
    <div className="cp-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>System Status</div>
          <div className="cp-subtle">Cyberpunk Ops Dashboard · Real-time ConfigPulse</div>
        </div>
        <div style={{ minWidth: 240 }}>
          <EnvSwitcher compact={false} />
        </div>
      </div>

      <div className="cp-grid-2">
        <ConfigCard
          title="System Status"
          right={
            <ClientBadge
              connected={wsConnected}
              label={wsConnected ? 'WS Connected' : 'WS Offline'}
            />
          }
        >
          <div className="cp-metric" style={{ color: wsConnected ? '#00ff9c' : '#ff3b6a' }}>
            {systemLabel}
          </div>
          <div className="cp-subtle" style={{ marginTop: 6 }}>
            API: {apiHealthy === null ? 'Checking…' : apiHealthy ? 'Connected' : 'Unreachable'}
          </div>
        </ConfigCard>

        <ConfigCard title="Active Clients">
          <div className="cp-metric">{connectedCount}</div>
          <div className="cp-subtle" style={{ marginTop: 6 }}>
            Connected clients across environments/locations
          </div>
        </ConfigCard>

        <ConfigCard title="Last Config Update">
          <div className="cp-metric">{formatTime(lastConfigUpdate)}</div>
          <div className="cp-subtle" style={{ marginTop: 6 }}>
            Updated on resolved config change broadcasts
          </div>
        </ConfigCard>

        <ConfigCard title="Current Environment" right={<span className="cp-kbd">{environment}</span>}>
          <div className="cp-subtle" style={{ marginTop: 2 }}>
            Active environment switch affects Config Viewer and Editor.
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="cp-kbd">dev</span>
            <span className="cp-kbd">staging</span>
            <span className="cp-kbd">production</span>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}

