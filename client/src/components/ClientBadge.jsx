export default function ClientBadge({ connected, label }) {
  const text = label ?? (connected ? 'Connected' : 'Disconnected')

  return (
    <span
      className={`cp-badge ${connected ? 'cp-badge--connected' : 'cp-badge--disconnected'}`}
      title={text}
    >
      <span className="cp-badge__dot" />
      {text}
    </span>
  )
}

