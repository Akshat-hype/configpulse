import useConfigStore from '../store/configStore'

const ENV_OPTIONS = [
  { value: 'dev', label: 'Dev' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
]

export default function EnvSwitcher({ compact = false }) {
  const environment = useConfigStore((s) => s.environment)
  const setEnvironment = useConfigStore((s) => s.setEnvironment)

  return (
    <div style={{ display: 'flex', flexDirection: compact ? 'column' : 'row', gap: 10, alignItems: compact ? 'flex-start' : 'center' }}>
      {!compact && <div className="cp-label" style={{ margin: 0 }}>Environment</div>}
      <select
        className="cp-select"
        value={environment}
        onChange={(e) => setEnvironment(e.target.value)}
        aria-label="Environment"
        style={compact ? { width: 180 } : { width: 220 }}
      >
        {ENV_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

