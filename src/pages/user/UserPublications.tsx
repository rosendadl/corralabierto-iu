import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import { useAuth } from '../../auth/AuthContext.tsx'
import NotificationsPopover from '../../components/NotificationsPopover.tsx'
import { displayName, initials, loadProfile, modeLabel, type LocalProfile } from '../../profileStore.ts'
import { loadPublications, type LotPublication } from '../../publicationStore.ts'
import './UserPublications.css'

export default function UserPublications() {
  const { user } = useAuth()
  const location = useLocation()
  const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username))
  const [publications, setPublications] = useState<LotPublication[]>(() => loadPublications(user?.username))
  const [status, setStatus] = useState<'todas' | 'activa' | 'pausada' | 'vendida'>('todas')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const refreshProfile = () => setProfile(loadProfile(user?.username))
    const refreshPublications = () => setPublications(loadPublications(user?.username))

    refreshProfile()
    refreshPublications()
    window.addEventListener('corral-profile-updated', refreshProfile)
    window.addEventListener('corral-publications-updated', refreshPublications)
    return () => {
      window.removeEventListener('corral-profile-updated', refreshProfile)
      window.removeEventListener('corral-publications-updated', refreshPublications)
    }
  }, [user?.username])

  useEffect(() => {
    if (location.hash === '#ventas') {
      requestAnimationFrame(() => document.getElementById('ventas')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  const name = displayName(profile, user?.username)
  const avatarInitials = initials(profile, user?.username)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return publications.filter((item) => {
      const matchesStatus = status === 'todas' || item.status === status
      const haystack = `${item.title} ${item.species} ${item.breed} ${item.municipality} ${item.state}`.toLowerCase()
      return matchesStatus && (!term || haystack.includes(term))
    })
  }, [publications, search, status])

  const counts = useMemo(() => ({
    all: publications.length,
    active: publications.filter((item) => item.status === 'activa').length,
    sold: publications.filter((item) => item.status === 'vendida').length,
  }), [publications])

  return (
    <div className="pub-page">
      <header className="pub-header">
        <div className="pub-header-inner">
          <Link to="/user" className="pub-brand">
            <img src={logo} alt="Corral Abierto" />
            <span>Corral Abierto</span>
          </Link>

          <nav className="pub-nav">
            <Link to="/user">Catálogo</Link>
            <Link className="active" to="/user/publicaciones">Mis Publicaciones</Link>
            <Link to="/user/compras">Mis Compras</Link>
            <Link to="/user/profile">Mi Perfil</Link>
          </nav>

          <div className="pub-header-actions">
            <NotificationsPopover />
            <Link className="pub-user-chip" to="/user/profile">
              <span className="pub-avatar">{avatarInitials}</span>
              <span><strong>{name}</strong><small>{modeLabel(profile?.tradeMode)}</small></span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pub-main">
        <section className="pub-page-head">
          <div>
            <span className="pub-kicker">VENDEDOR</span>
            <h1>Mis publicaciones</h1>
            <p>Administra tus lotes publicados y revisa tus ventas y liquidaciones desde el mismo lugar.</p>
          </div>
          <Link className="pub-primary" to="/user/publicar">＋ Publicar nuevo lote</Link>
        </section>

        <section className="pub-summary" aria-label="Resumen de publicaciones">
          <SummaryCard label="Publicaciones" value={counts.all} helper="Total creado" />
          <SummaryCard label="Activas" value={counts.active} helper="Visibles en catálogo" />
          <SummaryCard label="Vendidas" value={counts.sold} helper="Operaciones cerradas" />
        </section>

        <section className="pub-panel">
          <div className="pub-panel-head">
            <div>
              <h2>Lotes publicados</h2>
              <p>Aquí aparecerán los lotes que publiques.</p>
            </div>
            <div className="pub-controls">
              <div className="pub-search">
                <span>⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar publicación..." />
              </div>
              <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                <option value="todas">Todas</option>
                <option value="activa">Activas</option>
                <option value="pausada">Pausadas</option>
                <option value="vendida">Vendidas</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="pub-empty">
              <div className="pub-empty-icon">▦</div>
              <h3>{publications.length === 0 ? 'Todavía no has publicado ningún lote' : 'No hay resultados con esos filtros'}</h3>
              <p>{publications.length === 0 ? 'Cuando publiques tu primer lote, aparecerá aquí con la información que hayas capturado.' : 'Prueba otra búsqueda o cambia el estado seleccionado.'}</p>
              {publications.length === 0 && <Link to="/user/publicar">Publicar nuevo lote</Link>}
            </div>
          ) : (
            <div className="pub-list">
              {filtered.map((item) => <PublicationRow key={item.id} item={item} />)}
            </div>
          )}
        </section>

        <section className="pub-panel pub-sales" id="ventas">
          <div className="pub-panel-head simple">
            <div>
              <span className="pub-kicker">OPERACIONES</span>
              <h2>Ventas y liquidaciones</h2>
              <p>Resumen simple de las ventas generadas desde tus publicaciones.</p>
            </div>
          </div>

          <div className="sales-summary">
            <div><span>Ventas registradas</span><strong>0</strong></div>
            <div><span>Pendientes de liquidar</span><strong>0</strong></div>
            <div><span>Total liquidado</span><strong>$0</strong></div>
          </div>

          <div className="sales-table-wrap">
            <table className="sales-table">
              <thead><tr><th>Lote</th><th>Comprador</th><th>Estado</th><th>Total</th></tr></thead>
              <tbody>
                <tr className="sales-empty-row"><td colSpan={4}>No hay ventas o liquidaciones registradas todavía.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return <article className="pub-summary-card"><span>{label}</span><strong>{value}</strong><small>{helper}</small></article>
}

function PublicationRow({ item }: { item: LotPublication }) {
  const statusLabel = item.status === 'activa' ? 'Activa' : item.status === 'pausada' ? 'Pausada' : 'Vendida'
  const priceLabel = item.saleMode === 'kg' ? 'por kg' : item.saleMode === 'cabeza' ? 'por cabeza' : 'por lote'

  return (
    <article className="pub-row">
      <div className="pub-row-media">
        <div className="pub-photo-placeholder"><span>▧</span><small>{item.photoNames.length ? `${item.photoNames.length} foto${item.photoNames.length === 1 ? '' : 's'}` : 'Sin fotos'}</small></div>
      </div>
      <div className="pub-row-content">
        <div className="pub-row-top">
          <div>
            <span className={`pub-status ${item.status}`}>{statusLabel}</span>
            <h3>{item.title}</h3>
          </div>
          <div className="pub-price"><strong>${item.price.toLocaleString('es-MX')}</strong><small>MXN {priceLabel}</small></div>
        </div>
        <div className="pub-row-meta">
          <span><small>Especie</small><b>{item.species}</b></span>
          <span><small>Raza</small><b>{item.breed}</b></span>
          <span><small>Cabezas</small><b>{item.headCount}</b></span>
          <span><small>Origen</small><b>{[item.municipality, item.state].filter(Boolean).join(', ') || '—'}</b></span>
        </div>
      </div>
    </article>
  )
}
