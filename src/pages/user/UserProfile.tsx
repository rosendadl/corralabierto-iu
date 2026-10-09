import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import { useAuth } from '../../auth/AuthContext.tsx'
import NotificationsPopover from '../../components/NotificationsPopover.tsx'
import {
  canBuy,
  canSell,
  displayName,
  initials,
  loadProfile,
  modeLabel,
  saveProfile,
  type LocalProfile,
} from '../../profileStore.ts'
import './UserAccount.css'

export default function UserProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username))

  useEffect(() => {
    const refresh = () => setProfile(loadProfile(user?.username))
    refresh()
    window.addEventListener('corral-profile-updated', refresh)
    return () => window.removeEventListener('corral-profile-updated', refresh)
  }, [user?.username])

  const name = displayName(profile, user?.username)
  const avatarInitials = initials(profile, user?.username)
  const location = [profile?.municipality, prettyState(profile?.state)].filter(Boolean).join(', ') || 'Ubicación no configurada'
  const seller = canSell(profile?.tradeMode)
  const buyer = canBuy(profile?.tradeMode)

  const memberSince = useMemo(
    () => new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date()),
    [],
  )

  function toggleCatalogVisibility() {
    if (!profile) return
    const next = { ...profile, catalogVisible: !(profile.catalogVisible ?? true) }
    saveProfile(next)
    setProfile(next)
  }

  function toggleEmailNotifications() {
    if (!profile) return
    const next = { ...profile, emailNotifications: !(profile.emailNotifications ?? true) }
    saveProfile(next)
    setProfile(next)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <div className="account-header-inner">
          <Link to="/user" className="account-brand">
            <img src={logo} alt="Corral Abierto" />
            <span>Corral Abierto</span>
          </Link>

          <nav className="account-main-nav">
            <Link to="/user">Catálogo</Link>
            {seller && <Link to="/user/publicaciones">Mis Publicaciones</Link>}
            {buyer && <Link to="/user/compras">Mis Compras</Link>}
            <Link to="/user/settings">Ajustes</Link>
          </nav>

          <div className="account-header-actions">
            <NotificationsPopover />
            <Link to="/user/profile" className="account-user-chip active">
              <div className="account-mini-avatar">{avatarInitials}</div>
              <div><strong>{name}</strong><small>{modeLabel(profile?.tradeMode)}</small></div>
            </Link>
          </div>
        </div>
      </header>

      <main className="account-main">
        <section className="account-hero">
          <div className="account-hero-person">
            <div className="account-avatar-large">
              {profile?.avatar ? <img src={profile.avatar} alt={name} /> : <span>{avatarInitials}</span>}
            </div>
            <div className="account-identity">
              <div className="account-title-row">
                <h1>{name}</h1>
                <span className="account-mode-badge">{modeLabel(profile?.tradeMode)}</span>
              </div>
              <p className="account-username">@{user?.username}</p>
              <div className="account-meta">
                {profile?.email && <span>✉ {profile.email}</span>}
                {profile?.phone && <span>☎ {profile.phone}</span>}
                <span>⌖ {location}</span>
                <span>Miembro desde {memberSince}</span>
              </div>
            </div>
          </div>

          <div className="account-hero-actions">
            <Link className="account-btn secondary" to="/user/settings">Ver ajustes</Link>
            <Link className="account-btn primary" to="/user/settings">Editar perfil</Link>
          </div>
        </section>

        <nav className="account-tabs" aria-label="Navegación de cuenta">
          <Link className="active" to="/user/profile">Mi perfil</Link>
          {seller && <Link to="/user/publicaciones">Mis publicaciones</Link>}
          {seller && <Link to="/user/ventas">Ventas</Link>}
          {buyer && <Link to="/user/compras">Mis compras</Link>}
          <Link to="/user/settings">Seguridad y ajustes</Link>
        </nav>

        <div className="account-grid">
          <div className="account-column">
            <section className="account-card">
              <div className="card-heading">
                <div><h2>Información de perfil</h2><p>Datos que identifican tu cuenta dentro de Corral Abierto.</p></div>
                <span className="card-icon">✓</span>
              </div>

              <div className="profile-data-grid">
                <InfoBox label="Usuario" value={user?.username || '—'} />
                <InfoBox label="Tipo de perfil" value={modeLabel(profile?.tradeMode)} />
                <InfoBox label="Correo" value={profile?.email || 'No configurado'} />
                <InfoBox label="Teléfono" value={profile?.phone || 'No configurado'} />
                <InfoBox label="Ubicación" value={location} wide />
                <InfoBox label="Tipo de domicilio" value={facilityLabel(profile?.facility)} />
              </div>
            </section>

            {seller && (
              <section className="account-card">
                <div className="card-heading">
                  <div><h2>Herramientas de vendedor</h2><p>Tu perfil está habilitado para publicar y administrar lotes.</p></div>
                  <span className="card-icon">↗</span>
                </div>
                <div className="account-action-list">
                  <Link to="/user/publicar"><span><b>Publicar un animal o lote</b><small>Crea una nueva publicación para el catálogo.</small></span><b>→</b></Link>
                  <Link to="/user/publicaciones"><span><b>Mis publicaciones</b><small>Administra lo que tienes activo, pausado o vendido.</small></span><b>→</b></Link>
                </div>
              </section>
            )}

            {buyer && (
              <section className="account-card">
                <div className="card-heading">
                  <div><h2>Herramientas de comprador</h2><p>Accesos rápidos para explorar y administrar tus compras.</p></div>
                  <span className="card-icon">⌕</span>
                </div>
                <div className="account-action-list">
                  <Link to="/user"><span><b>Explorar catálogo</b><small>Busca ganado por especie, precio y ubicación.</small></span><b>→</b></Link>
                  <Link to="/user/compras"><span><b>Mis compras</b><small>Consulta tus operaciones y lotes guardados.</small></span><b>→</b></Link>
                </div>
              </section>
            )}
          </div>

          <aside className="account-column account-side">
            <section className="account-card">
              <div className="card-heading">
                <div><h2>Seguridad de cuenta</h2><p>Acceso y protección de tus credenciales.</p></div>
                <span className="card-icon">⌾</span>
              </div>

              <div className="security-row">
                <div><strong>Contraseña</strong><small>Usa tu contraseña de acceso actual.</small></div>
                <button type="button" onClick={() => alert('El cambio de contraseña se conectará cuando exista el endpoint del backend.')}>Cambiar</button>
              </div>
              <div className="security-row">
                <div><strong>Correo de la cuenta</strong><small>{profile?.email || 'No configurado'}</small></div>
                <span className="status-pill">Registrado</span>
              </div>
            </section>

            <section className="account-card">
              <div className="card-heading">
                <div><h2>Privacidad y notificaciones</h2></div>
                <span className="card-icon">☷</span>
              </div>

              {seller && (
                <ToggleRow
                  title="Visibilidad en catálogo"
                  description="Permite que otros usuarios encuentren tu perfil como vendedor."
                  checked={profile?.catalogVisible ?? true}
                  onChange={toggleCatalogVisibility}
                />
              )}
              <ToggleRow
                title="Notificaciones por correo"
                description="Recibe avisos importantes de actividad de tu cuenta."
                checked={profile?.emailNotifications ?? true}
                onChange={toggleEmailNotifications}
              />
            </section>

            <section className="account-card account-actions-card">
              <span className="actions-label">ACCIONES DE CUENTA</span>
              <Link to="/user/settings" className="plain-action">Editar datos y preferencias <b>→</b></Link>
              <button className="logout-action" type="button" onClick={handleLogout}>Cerrar sesión <b>→</b></button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

function InfoBox({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={`info-box ${wide ? 'wide' : ''}`}><span>{label}</span><strong>{value}</strong></div>
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="toggle-row">
      <div><strong>{title}</strong><small>{description}</small></div>
      <button type="button" className={`switch ${checked ? 'on' : ''}`} onClick={onChange} aria-pressed={checked}><span /></button>
    </div>
  )
}

function facilityLabel(value?: string) {
  if (value === 'rancho') return 'Rancho / Finca'
  if (value === 'oficina') return 'Oficina / Negocio'
  if (value === 'particular') return 'Domicilio particular'
  return 'No configurado'
}

function prettyState(value?: string) {
  if (!value) return ''
  const map: Record<string, string> = {
    baja_california: 'Baja California',
    sonora: 'Sonora',
    chihuahua: 'Chihuahua',
    nuevo_leon: 'Nuevo León',
    durango: 'Durango',
    coahuila: 'Coahuila',
    jalisco: 'Jalisco',
    veracruz: 'Veracruz',
    otro: 'Otro',
  }
  return map[value] || value
}
