import { useEffect, useMemo, useState } from 'react'

import ConfigCard from '../components/ConfigCard'
import EnvSwitcher from '../components/EnvSwitcher'
import ValidationAlert from '../components/ValidationAlert'
import useConfigStore from '../store/configStore'

export default function ConfigEditor() {
  const environment = useConfigStore((s) => s.environment)
  const location = useConfigStore((s) => s.location)
  const clientId = useConfigStore((s) => s.clientId)

  const resolvedConfig = useConfigStore((s) => s.resolvedConfig)
  const validation = useConfigStore((s) => s.validation)

  const setLocation = useConfigStore((s) => s.setLocation)
  const setClientId = useConfigStore((s) => s.setClientId)
  const validateConfig = useConfigStore((s) => s.validateConfig)
  const deployConfig = useConfigStore((s) => s.deployConfig)
  const fetchResolvedConfig = useConfigStore((s) => s.fetchResolvedConfig)

  const [draft, setDraft] = useState('')
  const [dirty, setDirty] = useState(false)
  const [parseError, setParseError] = useState(null)

  const serverDraft = useMemo(() => {
    if (!resolvedConfig) return ''
    try {
      return JSON.stringify(resolvedConfig, null, 2)
    } catch {
      return ''
    }
  }, [resolvedConfig])

  const currentDraft = dirty ? draft : serverDraft

  const parseDraft = () => {
    setParseError(null)
    try {
      return JSON.parse(currentDraft)
    } catch (e) {
      setParseError(e?.message || 'Invalid JSON')
      return null
    }
  }

  const onValidate = async () => {
    const parsed = parseDraft()
    if (!parsed) return
    await validateConfig({ config: parsed })
  }

  const onDeploy = async () => {
    const parsed = parseDraft()
    if (!parsed) return
    await deployConfig({ config: parsed })
  }

  useEffect(() => {
    // Changing environment/location/client should refetch the resolved config.
    // The textarea stays stable while the user edits (`dirty`).
    fetchResolvedConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment, location, clientId])

  const alertVariant =
    parseError
      ? 'error'
      : validation.status === 'success'
        ? 'success'
        : validation.status === 'error'
          ? 'error'
          : validation.status === 'warning'
            ? 'warning'
            : null

  const alertTitle = parseError
    ? 'JSON Parse Error'
    : validation.title || (validation.status !== 'idle' ? 'Validation' : '')

  const alertMessage = parseError ? parseError : validation.message

  return (
    <div className="cp-container">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Config Editor</div>
          <div className="cp-subtle">Edit JSON, validate, then deploy (best-effort endpoints).</div>
        </div>
        <div style={{ minWidth: 240 }}>
          <EnvSwitcher compact={false} />
        </div>
      </div>

      <div className="cp-grid-2">
        <ConfigCard title="Target">
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
              Deploy applies to: <span className="cp-kbd">{environment}</span> / <span className="cp-kbd">{location}</span> /{' '}
              <span className="cp-kbd">{clientId}</span>
            </div>
          </div>

          <div className="cp-actions">
            <button className="cp-btn" onClick={onValidate} disabled={validation.validating}>
              {validation.validating ? <span className="cp-spinner" style={{ marginRight: 10 }} /> : null}
              Validate Config
            </button>
            <button className="cp-btn cp-btn--secondary" onClick={onDeploy} disabled={validation.validating}>
              {validation.validating ? <span className="cp-spinner" style={{ marginRight: 10 }} /> : null}
              Deploy Config
            </button>
          </div>

          {alertVariant ? (
            <div style={{ marginTop: 14 }}>
              <ValidationAlert
                variant={alertVariant}
                title={alertTitle}
                message={alertMessage}
                errors={!parseError ? validation.errors : []}
              />
            </div>
          ) : (
            <div style={{ marginTop: 14 }} className="cp-subtle">
              Tip: validate catches malformed JSON immediately. When the backend endpoints exist, backend schema
              validation will also run.
            </div>
          )}
        </ConfigCard>

        <ConfigCard title="Draft JSON">
          <textarea
            className="cp-textarea cp-input"
            value={currentDraft}
            onChange={(e) => {
              setDraft(e.target.value)
              setDirty(true)
              setParseError(null)
            }}
            spellCheck={false}
          />

          {!resolvedConfig && !currentDraft ? (
            <div style={{ marginTop: 12 }} className="cp-subtle">
              No resolved config loaded yet. Switch to “Config Viewer” to fetch one, then return here.
            </div>
          ) : null}
        </ConfigCard>
      </div>
    </div>
  )
}

