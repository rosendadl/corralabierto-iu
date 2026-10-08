import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext.tsx'
import {
    clearPendingRegistration,
    loadPendingRegistration,
    loadProfile,
    saveProfile,
    type Facility,
    type TradeMode,
} from '../../profileStore.ts'
import './ProfileSetupPage.css'

export default function ProfileSetupPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const pending = useMemo(() => loadPendingRegistration(), [])
    const username = user?.username || pending?.username || ''
    const existing = useMemo(() => loadProfile(username), [username])

    const [avatar, setAvatar] = useState<string | null>(existing?.avatar || null)
    const [tradeMode, setTradeMode] = useState<TradeMode>(existing?.tradeMode || 'ambos')
    const [facility, setFacility] = useState<Facility>(existing?.facility || 'rancho')
    const [firstName, setFirstName] = useState(existing?.firstName || '')
    const [lastName, setLastName] = useState(existing?.lastName || '')
    const [phone, setPhone] = useState(existing?.phone || '')
    const [address, setAddress] = useState(existing?.address || '')
    const [postalCode, setPostalCode] = useState(existing?.postalCode || '')
    const [locality, setLocality] = useState(existing?.locality || '')
    const [municipality, setMunicipality] = useState(existing?.municipality || '')
    const [state, setState] = useState(existing?.state || 'baja_california')
    const [saving, setSaving] = useState(false)

    const registeredEmail = existing?.email || pending?.email || ''

    function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        // LocalStorage is only temporary for this school/demo frontend, so avoid huge images.
        if (file.size > 900_000) {
            alert('Para esta versión usa una imagen menor a 900 KB.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => setAvatar(String(reader.result))
        reader.readAsDataURL(file)
    }

    function persistProfile() {
        if (!username) return false

        saveProfile({
            username,
            email: registeredEmail,
            firstName,
            lastName,
            phone,
            tradeMode,
            facility,
            address,
            postalCode,
            locality,
            municipality,
            state,
            avatar: avatar || undefined,
            catalogVisible: existing?.catalogVisible ?? true,
            emailNotifications: existing?.emailNotifications ?? true,
        })
        clearPendingRegistration()
        return true
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!user) {
            navigate('/login')
            return
        }

        setSaving(true)
        persistProfile()
        setSaving(false)
        navigate('/user')
    }

    function completeLater() {
        if (user) {
            persistProfile()
            navigate('/user')
        } else {
            navigate('/login')
        }
    }

    return (
        <main className="profile-setup-page">
            <div className="profile-shell">
                <section className="profile-card profile-header-card">
                    <div className="profile-meta-row">
                        <div className="secure-label">✓ CONFIGURACIÓN DE PERFIL</div>
                        <div className="trust-badges">
                            <span>🔒 Datos protegidos</span>
                            <span>✓ Perfil editable después</span>
                        </div>
                    </div>

                    <div className="stepper-row">
                        <span className="step-active"><b>1</b> Información y preferencias</span>
                        <span className="step-muted"><b>2</b> Listo para usar Corral Abierto</span>
                    </div>
                    <div className="progress-track"><div className="progress-value" /></div>

                    <div className="title-block">
                        <h1>Completa tu perfil en Corral Abierto</h1>
                        <p>Elige cómo usarás la plataforma. Después podrás cambiar entre comprar, vender o ambas opciones desde Ajustes.</p>
                    </div>
                </section>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <section className="profile-card avatar-card">
                        <div className="avatar-wrap">
                            <div className="avatar-circle">
                                {avatar ? <img src={avatar} alt="Vista previa de perfil" /> : <span>👤</span>}
                            </div>
                            <label className="camera-button" htmlFor="avatarInput">📷</label>
                            <input id="avatarInput" type="file" accept="image/png,image/jpeg" onChange={handleAvatar} hidden />
                        </div>

                        <div className="avatar-copy">
                            <div className="avatar-heading-row">
                                <div>
                                    <h3>Fotografía de perfil <small>(Opcional)</small></h3>
                                    <p>Puedes usar una foto tuya o el logotipo de tu rancho.</p>
                                </div>
                                <label className="secondary-button" htmlFor="avatarInput">Elegir imagen</label>
                            </div>
                        </div>
                    </section>

                    <section className="profile-card">
                        <span className="eyebrow">PERSONALIZA TU EXPERIENCIA</span>
                        <h2>¿Qué quieres hacer en Corral Abierto?</h2>
                        <p className="section-copy">No son cuentas diferentes. Es el mismo perfil y activamos las herramientas que necesitas.</p>

                        <div className="role-grid">
                            {[
                                ['comprador', '🛒', 'Comprar', 'Explorar ganado, guardar lotes y administrar tus compras.', 'Herramientas de comprador →'],
                                ['vendedor', '🚜', 'Vender', 'Publicar animales y administrar publicaciones y ventas.', 'Herramientas de vendedor →'],
                                ['ambos', '↔', 'Ambas', 'Comprar y vender desde una sola cuenta.', 'Todas las herramientas →'],
                            ].map(([value, icon, title, description, link]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`role-card ${tradeMode === value ? 'selected' : ''}`}
                                    onClick={() => setTradeMode(value as TradeMode)}
                                >
                                    <div className="role-top"><span className="role-icon">{icon}</span><span className="radio-dot" /></div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <strong>{link}</strong>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="profile-card">
                        <div className="section-heading-row">
                            <div>
                                <h2>Datos personales y de contacto</h2>
                                <p className="section-copy">Estos datos se mostrarán en tu perfil y podrás editarlos después.</p>
                            </div>
                            <span className="section-icon">▣</span>
                        </div>

                        <div className="form-grid two-cols">
                            <Field label="Nombre(s) *"><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej. Rosenda" /></Field>
                            <Field label="Apellidos *"><input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" /></Field>
                            <Field label="Teléfono de contacto"><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="(646) 000 0000" /></Field>
                            <Field label="Correo electrónico">
                                <div className="verified-input">
                                    <input readOnly value={registeredEmail} placeholder="Correo registrado" />
                                    <span>✓ Registrado</span>
                                </div>
                            </Field>
                        </div>
                    </section>

                    <section className="profile-card">
                        <h2>Ubicación principal</h2>
                        <p className="section-copy">Sirve para mostrar resultados cercanos y, si vendes, ubicar el origen de tus publicaciones.</p>

                        <div className="facility-block">
                            <label>Tipo de ubicación</label>
                            <div className="facility-chips">
                                <button type="button" className={facility === 'rancho' ? 'active' : ''} onClick={() => setFacility('rancho')}>⌂ Rancho / Finca</button>
                                <button type="button" className={facility === 'oficina' ? 'active' : ''} onClick={() => setFacility('oficina')}>▦ Oficina / Negocio</button>
                                <button type="button" className={facility === 'particular' ? 'active' : ''} onClick={() => setFacility('particular')}>⌂ Domicilio particular</button>
                            </div>
                        </div>

                        <div className="form-grid three-cols">
                            <Field label="Calle, carretera o referencia" className="span-2"><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej. Carr. Ensenada - Tecate Km. 10" /></Field>
                            <Field label="Código postal"><input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} maxLength={5} placeholder="22800" /></Field>
                            <Field label="Colonia o localidad"><input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Localidad" /></Field>
                            <Field label="Municipio"><input value={municipality} onChange={(e) => setMunicipality(e.target.value)} placeholder="Ej. Ensenada" /></Field>
                            <Field label="Estado">
                                <select value={state} onChange={(e) => setState(e.target.value)}>
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
                            </Field>
                        </div>
                    </section>

                    <section className="profile-card action-card">
                        <button type="button" className="text-button" onClick={completeLater}>Completar más tarde</button>
                        <button type="submit" className="primary-button" disabled={saving}>
                            {saving ? 'Guardando perfil...' : 'Guardar y entrar →'}
                        </button>
                    </section>

                    <footer className="profile-footer">
                        <p>Tus preferencias pueden modificarse después desde Ajustes.</p>
                        <span>Corral Abierto • Plataforma ganadera</span>
                    </footer>
                </form>
            </div>
        </main>
    )
}

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
    return <label className={`field ${className}`}><span>{label}</span>{children}</label>
}
