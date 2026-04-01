export default function ConfigCard({ title, right, children }) {
  return (
    <section className="cp-card glow-card">
      <div className="cp-card__inner">
        <div className="cp-card__title">
          <span>{title}</span>
          {right ? <span>{right}</span> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

