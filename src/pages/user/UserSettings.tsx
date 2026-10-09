import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import { useAuth } from '../../auth/AuthContext.tsx'
import NotificationsPopover from '../../components/NotificationsPopover.tsx'
import {
  displayName,
  initials,
  loadProfile,
  modeLabel,
  saveProfile,
  type Gender,
  type LocalProfile,
  type TradeMode,
} from '../../profileStore.ts'
import './UserAccount.css'

export default function UserSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username))
  const [error, setError] = useState('')

  useEffect(() => {
    setProfile(loadProfile(user?.username))
  }, [user?.username])

  if (!user) return null

  const safeProfile: LocalProfile = profile || {
    username: user.username,
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    tradeMode: 'ambos',
    facility: 'particular',
    address: '',
    postalCode: '',
    locality: '',
    municipality: '',
    state: 'baja_california',
    catalogVisible: true,
    emailNotifications: true,
  }

  const name = displayName(safeProfile, user.username)
  const avatarInitials = initials(safeProfile, user.username)

  function update<K extends keyof LocalProfile>(key: K, value: LocalProfile[K]) {
    setProfile({ ...safeProfile, [key]: value })
    setError('')
  }

  function save() {
    const required = [
      safeProfile.firstName,
      safeProfile.lastName,
      safeProfile.phone,
      safeProfile.municipality,
      safeProfile.state,
      safeProfile.gender,
      safeProfile.address,
    ]

    if (!required.every((value) => Boolean(value?.trim()))) {
      setError('Nombre, apellidos, teléfono, municipio, estado, género y domicilio son obligatorios.')
      return
    }

    saveProfile({
      ...safeProfile,
      firstName: safeProfile.firstName.trim(),
      lastName: safeProfile.lastName.trim(),
      phone: safeProfile.phone.trim(),
      municipality: safeProfile.municipality.trim(),
      address: safeProfile.address.trim(),
    })
    navigate('/user/profile')
  }

  return (
    <div className="account-page settings-page">
      <header className="account-header">
        <div className="account-header-inner">
          <Link to="/user" className="account-brand">
            <img src={logo} alt="Corral Abierto" />
            <span>Corral Abierto</span>
          </Link>

          <nav className="account-main-nav">
            <Link to="/user">Catálogo</Link>
            <Link to="/user/profile">Mi perfil</Link>
            <Link to="/user/settings" className="active-nav">Ajustes</Link>
          </nav>

          <div className="account-header-actions">
            <NotificationsPopover />
            <Link to="/user/profile" className="account-user-chip">
              <div className="account-mini-avatar">{avatarInitials}</div>
              <div><strong>{name}</strong><small>{modeLabel(safeProfile.tradeMode)}</small></div>
            </Link>
          </div>
        </div>
      </header>

      <main className="account-settings-main">
        <header className="account-settings-hero">
          <div>
            <span className="settings-eyebrow">CUENTA Y PERFIL</span>
            <h1>Ajustes</h1>
            <p>Edita tus datos básicos y decide si quieres comprar, vender o hacer ambas cosas.</p>
          </div>
          <Link to="/user/profile" className="settings-back-link">← Volver a mi perfil</Link>
        </header>

        <form className="account-settings-form" onSubmit={(e) => { e.preventDefault(); save() }}>
          <section className="account-settings-section">
            <div className="settings-section-copy">
              <span>01</span>
              <h2>Uso de la plataforma</h2>
              <p>Tu cuenta es la misma. Esta preferencia únicamente cambia las herramientas que ves.</p>
            </div>

            <div className="settings-section-content">
              <div className="mode-options settings-mode-options">
                <ModeButton mode="comprador" current={safeProfile.tradeMode} title="Comprar" copy="Catálogo y herramientas para administrar compras." onSelect={(mode) => update('tradeMode', mode)} />
                <ModeButton mode="vendedor" current={safeProfile.tradeMode} title="Vender" copy="Publicaciones y herramientas para administrar ventas." onSelect={(mode) => update('tradeMode', mode)} />
                <ModeButton mode="ambos" current={safeProfile.tradeMode} title="Ambas" copy="Activa las herramientas de compra y venta." onSelect={(mode) => update('tradeMode', mode)} />
              </div>
            </div>
          </section>

          <section className="account-settings-section">
            <div className="settings-section-copy">
              <span>02</span>
              <h2>Datos del perfil</h2>
              <p>Estos son los datos básicos de tu cuenta. El correo registrado no se puede cambiar desde aquí.</p>
            </div>

            <div className="settings-section-content">
              <div className="settings-grid settings-profile-grid">
                <label className="settings-field">
                  <span>Nombre *</span>
                  <input required value={safeProfile.firstName} onChange={(e) => update('firstName', e.target.value)} />
                </label>
                <label className="settings-field">
                  <span>Apellidos *</span>
                  <input required value={safeProfile.lastName} onChange={(e) => update('lastName', e.target.value)} />
                </label>
                <label className="settings-field">
                  <span>Correo</span>
                  <input className="locked-input" type="email" value={safeProfile.email} readOnly aria-readonly="true" />
                  <small className="field-help">El correo pertenece a tu cuenta y no puede modificarse aquí.</small>
                </label>
                <label className="settings-field">
                  <span>Teléfono *</span>
                  <input required type="tel" value={safeProfile.phone} onChange={(e) => update('phone', e.target.value)} />
                </label>
                <label className="settings-field">
                  <span>Género *</span>
                  <select required value={safeProfile.gender} onChange={(e) => update('gender', e.target.value as Gender)}>
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="mujer">Mujer</option>
                    <option value="hombre">Hombre</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero_no_decir">Prefiero no decirlo</option>
                  </select>
                </label>
                <label className="settings-field">
                  <span>Municipio *</span>
                  <input required value={safeProfile.municipality} onChange={(e) => update('municipality', e.target.value)} />
                </label>
                <label className="settings-field">
                  <span>Estado *</span>
                  <select required value={safeProfile.state} onChange={(e) => update('state', e.target.value)}>
                    <option value="baja_california">Baja California</option>
                    <option value="sonora">Sonora</option>
                    <option value="chihuahua">Chihuahua</option>
                    <option value="nuevo_leon">Nuevo León</option>
                    <option value="durango">Durango</option>
                    <option value="coahuila">Coahuila</option>
                    <option value="jalisco">Jalisco</option>
                    <option value="veracruz">Veracruz</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>
                <label className="settings-field settings-field-wide">
                  <span>Domicilio *</span>
                  <input required value={safeProfile.address} onChange={(e) => update('address', e.target.value)} placeholder="Calle, número o referencia" />
                </label>
              </div>
            </div>
          </section>

          {error && <p className="settings-error" role="alert">{error}</p>}

          <div className="account-settings-actions">
            <Link className="settings-cancel" to="/user/profile">Cancelar</Link>
            <button className="settings-save" type="submit">Guardar cambios</button>
          </div>
        </form>
      </main>
    </div>
  )
}

function ModeButton({ mode, current, title, copy, onSelect }: { mode: TradeMode; current: TradeMode; title: string; copy: string; onSelect: (mode: TradeMode) => void }) {
  return (
    <button type="button" className={`mode-option ${current === mode ? 'active' : ''}`} onClick={() => onSelect(mode)}>
      <span className="mode-radio" />
      <strong>{title}</strong>
      <small>{copy}</small>
    </button>
  )
}
