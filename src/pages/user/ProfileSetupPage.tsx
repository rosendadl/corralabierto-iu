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
  type Gender,
  type TradeMode,
} from '../../profileStore.ts'
import './ProfileSetupPage.css'

export default function ProfileSetupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const pending = useMemo(() => loadPendingRegistration(), [])
  const username = user?.username || pending?.username || ''
  const existing = useMemo(() => loadProfile(username), [username])

  const initialEmail = existing?.email || pending?.email || ''
  const emailLocked = Boolean(initialEmail)

  const [avatar, setAvatar] = useState<string | null>(existing?.avatar || null)
  const [tradeMode, setTradeMode] = useState<TradeMode>(existing?.tradeMode || 'ambos')
  const [facility, setFacility] = useState<Facility>(existing?.facility || 'particular')
  const [firstName, setFirstName] = useState(existing?.firstName || '')
  const [lastName, setLastName] = useState(existing?.lastName || '')
  const [phone, setPhone] = useState(existing?.phone || '')
  const [gender, setGender] = useState<Gender | ''>(existing?.gender || '')
  const [email, setEmail] = useState(initialEmail)
  const [address, setAddress] = useState(existing?.address || '')
  const [postalCode, setPostalCode] = useState(existing?.postalCode || '')
  const [locality, setLocality] = useState(existing?.locality || '')
  const [municipality, setMunicipality] = useState(existing?.municipality || '')
  const [state, setState] = useState(existing?.state || 'baja_california')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 900_000) {
      setError('Para esta versión usa una imagen menor a 900 KB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result))
    reader.readAsDataURL(file)
  }

  function validateRequiredFields() {
    const required = [firstName, lastName, phone, email, municipality, state, gender, address]
    return required.every((value) => Boolean(value.trim()))
  }

  function persistProfile() {
    if (!username || !validateRequiredFields()) return false

    saveProfile({
      username,
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      gender,
      tradeMode,
      facility,
      address: address.trim(),
      postalCode: postalCode.trim(),
      locality: locality.trim(),
      municipality: municipality.trim(),
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
    setError('')

    if (!user) {
      navigate('/login')
      return
    }

    if (!validateRequiredFields()) {
      setError('Completa nombre, apellidos, teléfono, correo, municipio, estado, género y domicilio para continuar.')
      return
    }

    setSaving(true)
    const saved = persistProfile()
    setSaving(false)

    if (saved) navigate('/user')
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
            <h1>Completa tu perfil para continuar</h1>
            <p>Estos datos básicos son necesarios para entrar al catálogo. Después podrás cambiar tus preferencias desde Ajustes.</p>
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
            <p className="section-copy">Es una sola cuenta. Esta selección únicamente activa las herramientas que necesitas y podrás cambiarla después.</p>

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
                <p className="section-copy">Los campos marcados son obligatorios para usar la plataforma.</p>
              </div>
              <span className="section-icon">▣</span>
            </div>

            <div className="form-grid two-cols">
              <Field label="Nombre(s) *"><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej. Rosenda" /></Field>
              <Field label="Apellidos *"><input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" /></Field>
              <Field label="Teléfono de contacto *"><input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="(646) 000 0000" /></Field>
              <Field label="Género *">
                <select required value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no decirlo</option>
                </select>
              </Field>
              <Field label="Correo electrónico *" className="span-2">
                <div className="verified-input">
                  <input
                    required
                    type="email"
                    readOnly={emailLocked}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                  {emailLocked && <span>✓ Registrado</span>}
                </div>
              </Field>
            </div>
          </section>

          <section className="profile-card">
            <h2>Ubicación principal</h2>
            <p className="section-copy">El domicilio, municipio y estado son obligatorios. Los demás datos ayudan a precisar tu ubicación.</p>

            <div className="facility-block">
              <label>Tipo de ubicación</label>
              <div className="facility-chips">
                <button type="button" className={facility === 'rancho' ? 'active' : ''} onClick={() => setFacility('rancho')}>⌂ Rancho / Finca</button>
                <button type="button" className={facility === 'oficina' ? 'active' : ''} onClick={() => setFacility('oficina')}>▦ Oficina / Negocio</button>
                <button type="button" className={facility === 'particular' ? 'active' : ''} onClick={() => setFacility('particular')}>⌂ Domicilio particular</button>
              </div>
            </div>

            <div className="form-grid three-cols">
              <Field label="Domicilio / calle y referencia *" className="span-2"><input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej. Av. Reforma 120, Col. Centro" /></Field>
              <Field label="Código postal"><input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} maxLength={5} placeholder="22800" /></Field>
              <Field label="Colonia o localidad"><input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Localidad" /></Field>
              <Field label="Municipio *"><input required value={municipality} onChange={(e) => setMunicipality(e.target.value)} placeholder="Ej. Ensenada" /></Field>
              <Field label="Estado *">
                <select required value={state} onChange={(e) => setState(e.target.value)}>
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

          {error && <p className="profile-form-error" role="alert">{error}</p>}

          <section className="profile-card action-card required-action-card">
            <div>
              <strong>Perfil básico obligatorio</strong>
              <p>Necesitas completar los datos marcados con * para entrar a Corral Abierto.</p>
            </div>
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
