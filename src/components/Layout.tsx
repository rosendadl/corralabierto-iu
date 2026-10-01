import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'

interface Props {
  links: { to: string; label: string }[]
}

export default function Layout({ links }: Props) {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="header">
        <strong>Internal Access</strong>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="account">
          <span>{user?.username}</span>
          <span className="role">{user?.role}</span>
          <button className="secondary" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  )
}
