import { useEffect } from 'react'

import ClientBadge from '../components/ClientBadge'
import ConfigCard from '../components/ConfigCard'
import useConfigStore from '../store/configStore'

function pickClientId(c) {
  return c?.clientId ?? c?.client_id ?? c?.id ?? c?._id ?? '—'
}

function pickVersion(c) {
  return c?.version ?? c?.clientVersion ?? c?.client_version ?? '—'
}

function pickLocation(c) {
  return c?.location ?? c?.loc ?? '—'
}

function isConnected(c) {
  const status = (c?.connectionStatus ?? c?.status ?? c?.state ?? '').toString().toLowerCase()
  const connectedFlag = Boolean(c?.connected)
  return connectedFlag || status === 'connected' || status === 'online' || status === 'active'
}

export default function Clients() {
  const clients = useConfigStore((s) => s.clients)
  const fetchClients = useConfigStore((s) => s.fetchClients)

  useEffect(() => {
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="cp-container">
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Clients Monitor</div>
        <div className="cp-subtle">Connected clients and their current configuration versions.</div>
      </div>

      <ConfigCard title="Connected Clients">
        <table className="cp-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Version</th>
              <th>Location</th>
              <th>Connection Status</th>
            </tr>
          </thead>
          <tbody>
            {!clients.length ? (
              <tr>
                <td colSpan={4} className="cp-subtle" style={{ padding: 16 }}>
                  No client data available yet.
                </td>
              </tr>
            ) : (
              clients.map((c, idx) => {
                const connected = isConnected(c)
                return (
                  <tr key={pickClientId(c) + idx}>
                    <td>{pickClientId(c)}</td>
                    <td>{pickVersion(c)}</td>
                    <td>{pickLocation(c)}</td>
                    <td>
                      <ClientBadge connected={connected} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </ConfigCard>
    </div>
  )
}

