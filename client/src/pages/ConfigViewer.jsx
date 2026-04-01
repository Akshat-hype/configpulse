import { useEffect, useMemo, useState } from 'react'

import ValidationAlert from '../components/ValidationAlert'
import EnvSwitcher from '../components/EnvSwitcher'
import useConfigStore from '../store/configStore'
import ConfigCard from '../components/ConfigCard'

function formatErrorHint(err) {
  if (!err) return 'Unknown error'
  return typeof err === 'string' ? err : err.message || 'Failed to load config'
}

export default function ConfigViewer() {
  const environment = useConfigStore((s) => s.environment)
  const location = useConfigStore((s) => s.location)
  const clientId = useConfigStore((s) => s.clientId)

  const resolvedConfig = useConfigStore((s) => s.resolvedConfig)
  const resolvedMeta = useConfigStore((s) => s.resolvedMeta)
  const configLoading = useConfigStore((s) => s.configLoading)
  const configError = useConfigStore((s) => s.configError)

  const setLocation = useConfigStore((s) => s.setLocation)
  const setClientId = useConfigStore((s) => s.setClientId)
  const fetchResolvedConfig = useConfigStore((s) => s.fetchResolvedConfig)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchResolvedConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment, location, clientId])

  const jsonText = useMemo(() => {
    if (!resolvedConfig) return ''
    try {
      return JSON.stringify(resolvedConfig, null, 2)
    } catch {
      return String(resolvedConfig)
    }
  }, [resolvedConfig])

  const onCopy = async () => {
    if (!jsonText) return
    try {
      await navigator.clipboard.writeText(jsonText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Fallback for older browsers:
      const textarea = document.createElement('textarea')
      textarea.value = jsonText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div className="cp-container">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Resolved Config Viewer</div>
          <div className="cp-subtle">Fetches the merged config for a specific client in the selected environment.</div>
        </div>
        <div style={{ minWidth: 240 }}>
          <EnvSwitcher compact={false} />
        </div>
      </div>

      <div className="cp-grid-2">
        <ConfigCard title="Query">
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

          <div style={{ marginTop: 12 }}>
            <div className="cp-subtle">
              GET <span className="cp-kbd">/api/config</span> with: <span className="cp-kbd">env={environment}</span>{' '}
              <span className="cp-kbd">loc={location}</span> <span className="cp-kbd">client={clientId}</span>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Resolved JSON">
          {configError ? (
            <ValidationAlert
              variant="error"
              title="Config Load Failed"
              message={formatErrorHint(configError)}
            />
          ) : (
            <div className="cp-code" style={{ height: '100%' }}>
              <div className="cp-code__header">
                <div className="cp-code__title">resolved.json</div>
                <button className="cp-btn cp-btn--secondary" onClick={onCopy} disabled={!jsonText}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {configLoading ? (
                <div style={{ padding: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="cp-spinner" />
                  <div className="cp-subtle">Resolving layers (global → environment → location → client)…</div>
                </div>
              ) : jsonText ? (
                <pre>
                  <code>{jsonText}</code>
                </pre>
              ) : (
                <div style={{ padding: 18 }} className="cp-subtle">
                  No resolved config loaded yet.
                </div>
              )}
            </div>
          )}

          {resolvedMeta ? (
            <div style={{ marginTop: 12 }}>
              <div className="cp-subtle">
                Meta: <span className="cp-kbd">{resolvedMeta?.environment ?? environment}</span>{' '}
                <span className="cp-kbd">{resolvedMeta?.location ?? location}</span>
              </div>
            </div>
          ) : null}
        </ConfigCard>
      </div>
    </div>
  )
}

