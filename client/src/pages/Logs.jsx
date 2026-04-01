import { useEffect, useMemo } from 'react'

import ConfigCard from '../components/ConfigCard'
import useConfigStore from '../store/configStore'

function formatLogLine(l) {
  if (typeof l === 'string') return l
  const level = (l?.level ?? l?.type ?? l?.severity ?? 'INFO').toString().toUpperCase()
  const msg = l?.message ?? l?.msg ?? l?.detail ?? JSON.stringify(l)
  const prefix = `[${level}]`
  return `${prefix} ${msg}`
}

export default function Logs() {
  const logs = useConfigStore((s) => s.logs)
  const fetchLogs = useConfigStore((s) => s.fetchLogs)
  const lastConfigUpdate = useConfigStore((s) => s.lastConfigUpdate)

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const text = useMemo(() => {
    if (!logs?.length) return ''
    return logs.map(formatLogLine).join('\n')
  }, [logs])

  return (
    <div className="cp-container">
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Deployment & Validation Logs</div>
        <div className="cp-subtle">
          Terminal-style feed · last update: {lastConfigUpdate ? new Date(lastConfigUpdate).toLocaleString() : '—'}
        </div>
      </div>

      <ConfigCard title="Terminal">
        <div className="cp-terminal">
          <div className="cp-terminal__header">
            <span>configpulse · log stream</span>
            <span className="cp-subtle">{logs.length ? `${logs.length} events` : 'No events'}</span>
          </div>
          <pre style={{ margin: 0 }}>
            <code>{text || '[INFO] Logs not available yet.'}</code>
          </pre>
        </div>
      </ConfigCard>
    </div>
  )
}

