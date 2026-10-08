import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import { useAuth } from '../../auth/AuthContext.tsx'
import {
    displayName,
    initials,
    loadProfile,
    modeLabel,
    saveProfile,
    type LocalProfile,
    type TradeMode,
} from '../../profileStore.ts'
import './UserAccount.css'

export default function UserSettings() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username))

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
    }

    function save() {
        saveProfile(safeProfile)
        navigate('/user/profile')
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
                        <Link to="/user/profile">Mi perfil</Link>
                        <Link to="/user/settings">Ajustes</Link>
                    </nav>
                    <Link to="/user/profile" className="account-user-chip">
                        <div className="account-mini-avatar">{avatarInitials}</div>
                        <div><strong>{name}</strong><small>{modeLabel(safeProfile.tradeMode)}</small></div>
                    </Link>
                </div>
            </header>

            <main className="account-main">
                <div className="settings-title">
                    <h1>Ajustes</h1>
                    <p>Edita tus datos y cambia en cualquier momento si quieres comprar, vender o hacer ambas cosas.</p>
                </div>

                <div className="settings-form">
                    <section className="account-card">
                        <div className="card-heading">
                            <div><h2>Uso de la plataforma</h2><p>Esto controla qué herramientas se muestran en tu navegación y en tu perfil.</p></div>
                            <span className="card-icon">↔</span>
                        </div>

                        <div className="mode-options">
                            <ModeButton mode="comprador" current={safeProfile.tradeMode} title="Comprar" copy="Catálogo, compras y herramientas para buscar ganado." onSelect={(mode) => update('tradeMode', mode)} />
                            <ModeButton mode="vendedor" current={safeProfile.tradeMode} title="Vender" copy="Publicaciones y herramientas para administrar ventas." onSelect={(mode) => update('tradeMode', mode)} />
                            <ModeButton mode="ambos" current={safeProfile.tradeMode} title="Ambas" copy="Activa las herramientas de compra y venta." onSelect={(mode) => update('tradeMode', mode)} />
                        </div>
                    </section>

                    <section className="account-card">
                        <div className="card-heading">
                            <div><h2>Datos del perfil</h2><p>Información básica que se muestra en tu cuenta.</p></div>
                            <span className="card-icon">✎</span>
                        </div>

                        <div className="settings-grid">
                            <label className="settings-field"><span>Nombre</span><input value={safeProfile.firstName} onChange={(e) => update('firstName', e.target.value)} /></label>
                            <label className="settings-field"><span>Apellidos</span><input value={safeProfile.lastName} onChange={(e) => update('lastName', e.target.value)} /></label>
                            <label className="settings-field"><span>Correo</span><input type="email" value={safeProfile.email} onChange={(e) => update('email', e.target.value)} /></label>
                            <label className="settings-field"><span>Teléfono</span><input value={safeProfile.phone} onChange={(e) => update('phone', e.target.value)} /></label>
                            <label className="settings-field"><span>Municipio</span><input value={safeProfile.municipality} onChange={(e) => update('municipality', e.target.value)} /></label>
                            <label className="settings-field"><span>Estado</span>
                                <select value={safeProfile.state} onChange={(e) => update('state', e.target.value)}>
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
                        </div>
                    </section>

                    <div className="settings-actions">
                        <Link className="cancel" to="/user/profile">Cancelar</Link>
                        <button className="save" type="button" onClick={save}>Guardar cambios</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

function ModeButton({ mode, current, title, copy, onSelect }: { mode: TradeMode; current: TradeMode; title: string; copy: string; onSelect: (mode: TradeMode) => void }) {
    return (
        <button type="button" className={`mode-option ${current === mode ? 'active' : ''}`} onClick={() => onSelect(mode)}>
            <strong>{title}</strong><small>{copy}</small>
        </button>
    )
}
