import { useEffect } from 'react'

import ConfigCard from '../components/ConfigCard'
import EnvSwitcher from '../components/EnvSwitcher'
import useConfigStore from '../store/configStore'

export default function Environments() {
  const environment = useConfigStore((s) => s.environment)
  const location = useConfigStore((s) => s.location)
  const clientId = useConfigStore((s) => s.clientId)
  const setLocation = useConfigStore((s) => s.setLocation)
  const setClientId = useConfigStore((s) => s.setClientId)
  const fetchResolvedConfig = useConfigStore((s) => s.fetchResolvedConfig)

  useEffect(() => {
    // Environment switcher should refetch config.
    fetchResolvedConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment])

  return (
    <div className="cp-container">
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Environment Switcher</div>
        <div className="cp-subtle">Dev / Staging / Production · refetches the resolved config.</div>
      </div>

      <ConfigCard title="Environment Controls">
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 240 }}>
            <EnvSwitcher compact={false} />
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="cp-form-grid">
              <div>
                <div className="cp-label">Location</div>
                <input
                  className="cp-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="india"
                />
              </div>
              <div>
                <div className="cp-label">Client ID</div>
                <input
                  className="cp-input"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="enterprise-client-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="cp-subtle">
          Current selection: <span className="cp-kbd">{environment}</span> / <span className="cp-kbd">{location}</span> /{' '}
          <span className="cp-kbd">{clientId}</span>
        </div>
      </ConfigCard>
    </div>
  )
}

