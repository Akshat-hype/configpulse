export default function ValidationAlert({ variant = 'success', title, message, errors = [] }) {
  const className = `cp-alert cp-alert--${variant}`

  return (
    <div className={className} role="alert">
      <div className="cp-alert__title">{title}</div>
      {message ? <div className="cp-alert__msg">{message}</div> : null}
      {errors && errors.length ? (
        <div className="cp-alert__errors">
          {errors.map((e, idx) => (
            <div key={idx} className="cp-alert__errorLine">
              {typeof e === 'string' ? e : JSON.stringify(e)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

