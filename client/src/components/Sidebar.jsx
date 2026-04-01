import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/configs', label: 'Config Viewer' },
  { to: '/editor', label: 'Config Editor' },
  { to: '/clients', label: 'Clients' },
  { to: '/logs', label: 'Logs' },
  { to: '/environments', label: 'Environments' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="cp-sidebar" aria-label="Primary navigation">
      <div style={{ padding: '8px 6px 14px', borderBottom: '1px solid rgba(0,255,156,0.16)' }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>NAVIGATION</div>
        <div className="cp-subtle">Cyber control center</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14 }}>
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`cp-navlink ${isActive ? 'cp-navlink--active' : ''}`}
            >
              <span>{item.label}</span>
              <span style={{ color: 'rgba(230,255,245,0.75)' }}>›</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

