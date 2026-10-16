import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext.tsx'
import NotificationsPopover from '../../components/NotificationsPopover.tsx'
import './AdminLayout.css'

const navItems = [
  { to: '/admin', label: 'Panel principal', icon: '▦', end: true },
  { to: '/admin/users', label: 'Usuarios', icon: '◎' },
  { to: '/admin/publications', label: 'Publicaciones', icon: '▤' },
  { to: '/admin/reports', label: 'Reportes', icon: '△' },
  { to: '/admin/catalog', label: 'Catálogo', icon: '◇' },
  { to: '/admin/settings', label: 'Ajustes', icon: '⚙' },
]

const pageTitles: Record<string, string> = {
  '/admin': 'Panel principal',
  '/admin/users': 'Usuarios',
  '/admin/publications': 'Publicaciones',
  '/admin/reports': 'Reportes',
  '/admin/catalog': 'Catálogo',
  '/admin/settings': 'Ajustes',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const displayName = useMemo(() => {
    if (!user?.username) return 'Administrador'
    return user.username.includes('@') ? user.username.split('@')[0] : user.username
  }, [user?.username])

  const currentTitle = pageTitles[location.pathname] ?? 'Administración'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-console">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark" aria-hidden="true">CA</div>
          <div>
            <strong>Corral Abierto</strong>
            <span>Administración</span>
          </div>
        </div>

        <div className="admin-sidebar-label">NAVEGACIÓN</div>

        <nav className="admin-sidebar-nav" aria-label="Navegación de administración">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-logout" onClick={handleLogout}>
            <span aria-hidden="true">↪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Administración</span>
            <strong>{currentTitle}</strong>
          </div>

          <div className="admin-topbar-actions">
            <NotificationsPopover />
            <span className="admin-divider" aria-hidden="true" />
            <div className="admin-identity">
              <div>
                <strong>{displayName}</strong>
                <span>Administrador</span>
              </div>
              <div className="admin-avatar" aria-hidden="true">
                {displayName.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
