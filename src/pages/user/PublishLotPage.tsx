import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import { useAuth } from '../../auth/AuthContext.tsx'
import NotificationsPopover from '../../components/NotificationsPopover.tsx'
import { displayName, initials, loadProfile, modeLabel } from '../../profileStore.ts'
import type { SaleMode } from '../../publicationStore.ts'
import type { ApiLot } from '../../lotDetails.ts'
import './PublishLotPage.css'

export default function PublishLotPage() {
  const { user, authFetch } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const profile = loadProfile(user?.username)
  const [title, setTitle] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [category, setCategory] = useState('')
  const [headCount, setHeadCount] = useState('')
  const [avgAgeMonths, setAvgAgeMonths] = useState('')
  const [state, setState] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [vaccinated, setVaccinated] = useState(false)
  const [negativeTests, setNegativeTests] = useState(false)
  const [vaccinesDetail, setVaccinesDetail] = useState('')
  const [testsDetail, setTestsDetail] = useState('')
  const [avgWeightKg, setAvgWeightKg] = useState('')
  const [saleMode, setSaleMode] = useState<SaleMode>('cabeza')
  const [price, setPrice] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [error, setError] = useState('')

  const name = displayName(profile, user?.username)
  const avatarInitials = initials(profile, user?.username)

  const totalWeight = useMemo(() => {
    const heads = Number(headCount)
    const weight = Number(avgWeightKg)
    return heads > 0 && weight > 0 ? heads * weight : 0
  }, [headCount, avgWeightKg])

  const estimatedTotal = useMemo(() => {
    const numericPrice = Number(price)
    const heads = Number(headCount)
    if (!numericPrice || !heads) return 0
    if (saleMode === 'kg') return totalWeight * numericPrice
    if (saleMode === 'cabeza') return heads * numericPrice
    return numericPrice
  }, [headCount, price, saleMode, totalWeight])

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'))
    setPhotos(files)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!user?.username) {
      setError('No se pudo identificar la cuenta activa.')
      return
    }

    if (!title || !species || !breed || !category || !headCount || !state || !municipality || !price) {
      setError('Completa todos los campos obligatorios antes de publicar.')
      return
    }

    if (Number(headCount) <= 0 || Number(price) <= 0) {
      setError('La cantidad de cabezas y el precio deben ser mayores a cero.')
      return
    }

    // Se guarda en el API (POST /api/user/lots) para que aparezca en el catálogo de todos.
    const body = {
      title,
      species,
      breed,
      category,
      headCount: Number(headCount),
      avgAgeMonths: avgAgeMonths ? Number(avgAgeMonths) : null,
      state,
      municipality,
      vaccinated,
      negativeTests,
      vaccinesDetail,
      testsDetail,
      avgWeightKg: avgWeightKg ? Number(avgWeightKg) : null,
      saleMode,
      price: Number(price),
      photoNames: photos.map((file) => file.name),
    }

    setSubmitting(true)
    try {
      const created = await authFetch<ApiLot>('/api/user/lots', { method: 'POST', body })
      navigate(`/user/lote/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar el lote.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="lot-page">
        <header className="lot-header">
          <div className="lot-header-inner">
            <Link to="/user" className="lot-brand"><img src={logo} alt="Corral Abierto" /><span>Corral Abierto</span></Link>
            <nav className="lot-nav"><Link to="/user">Catálogo</Link><Link to="/user/publicaciones">Mis Publicaciones</Link><Link to="/user/profile">Mi Perfil</Link></nav>
            <div className="lot-header-actions"><NotificationsPopover /><Link className="lot-user-chip" to="/user/profile"><span className="lot-avatar">{avatarInitials}</span><span><strong>{name}</strong><small>{modeLabel(profile?.tradeMode)}</small></span></Link></div>
          </div>
        </header>

        <main className="lot-main">
          <div className="lot-breadcrumb"><Link to="/user/publicaciones">Mis publicaciones</Link><span>›</span><span>Publicar nuevo lote</span></div>
          <section className="lot-title-row"><div><span className="lot-kicker">NUEVA PUBLICACIÓN</span><h1>Publicar nuevo lote</h1><p>Captura solo la información necesaria para mostrar tu lote en el catálogo.</p></div><Link className="lot-secondary" to="/user/publicaciones">Cancelar</Link></section>

          <form className="lot-form" onSubmit={handleSubmit}>
            <FormSection number="1" title="Información del lote" description="Datos básicos que verá el comprador en el catálogo.">
              <div className="lot-fields two">
                <Field label="Título del lote" required wide><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Lote de vaquillas Angus" /></Field>
                <Field label="Especie" required><select value={species} onChange={(e) => setSpecies(e.target.value)}><option value="">Selecciona</option><option>Bovino</option><option>Ovino</option><option>Porcino</option><option>Caprino</option><option>Equino</option></select></Field>
                <Field label="Raza" required><input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Raza o cruzamiento" /></Field>
                <Field label="Sexo / categoría" required><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Selecciona</option><option>Hembras</option><option>Machos</option><option>Mixto</option><option>Sementales</option><option>Engorda</option><option>Cría</option></select></Field>
                <Field label="Cantidad de cabezas" required><input type="number" min="1" value={headCount} onChange={(e) => setHeadCount(e.target.value)} placeholder="0" /></Field>
                <Field label="Edad promedio (meses)"><input type="number" min="0" value={avgAgeMonths} onChange={(e) => setAvgAgeMonths(e.target.value)} placeholder="Opcional" /></Field>
                <Field label="Estado de origen" required><input value={state} onChange={(e) => setState(e.target.value)} placeholder="Estado" /></Field>
                <Field label="Municipio / ciudad" required><input value={municipality} onChange={(e) => setMunicipality(e.target.value)} placeholder="Municipio o ciudad" /></Field>
              </div>
            </FormSection>

            <FormSection number="2" title="Vacunas y pruebas de salud" description="Indica si el lote cuenta con vacunas y pruebas negativas de enfermedades.">
              <div className="lot-health-grid">
                <CheckCard checked={vaccinated} onChange={setVaccinated} title="Vacunas al día" description="El lote cuenta con vacunas aplicadas según su manejo." />
                <CheckCard checked={negativeTests} onChange={setNegativeTests} title="Pruebas negativas" description="El lote cuenta con pruebas negativas de enfermedades." />
              </div>
              <div className="lot-fields two compact-top">
                <Field label="Vacunas aplicadas"><input value={vaccinesDetail} onChange={(e) => setVaccinesDetail(e.target.value)} placeholder="Opcional" /></Field>
                <Field label="Pruebas realizadas"><input value={testsDetail} onChange={(e) => setTestsDetail(e.target.value)} placeholder="Opcional" /></Field>
              </div>
            </FormSection>

            <FormSection number="3" title="Pesaje, modalidad de venta y precio" description="Define cómo se venderá el lote y el precio solicitado.">
              <div className="lot-fields two">
                <Field label="Peso promedio por cabeza (kg)"><input type="number" min="0" value={avgWeightKg} onChange={(e) => setAvgWeightKg(e.target.value)} placeholder="Opcional" /></Field>
                <Field label="Peso total estimado"><div className="lot-readonly">{totalWeight ? `${totalWeight.toLocaleString('es-MX')} kg` : '—'}</div></Field>
              </div>

              <div className="lot-sale-modes">
                <ModeButton active={saleMode === 'kg'} onClick={() => setSaleMode('kg')} title="Precio por kg" />
                <ModeButton active={saleMode === 'cabeza'} onClick={() => setSaleMode('cabeza')} title="Precio por cabeza" />
                <ModeButton active={saleMode === 'lote'} onClick={() => setSaleMode('lote')} title="Precio por lote" />
              </div>

              <div className="lot-price-row">
                <Field label={saleMode === 'kg' ? 'Precio por kg (MXN)' : saleMode === 'cabeza' ? 'Precio por cabeza (MXN)' : 'Precio total del lote (MXN)'} required>
                  <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                </Field>
                <div className="lot-total-card"><span>Total estimado</span><strong>{estimatedTotal ? `$${estimatedTotal.toLocaleString('es-MX', { maximumFractionDigits: 2 })}` : '$0'}</strong><small>MXN</small></div>
              </div>
            </FormSection>

            <FormSection number="4" title="Galería de fotos" description="Sube fotografías del lote. No se aceptan videos.">
              <label className="lot-upload">
                <input type="file" accept="image/*" multiple onChange={handlePhotos} />
                <span className="lot-upload-icon">＋</span>
                <strong>Seleccionar fotos</strong>
                <small>JPG, PNG o WEBP</small>
              </label>
              {photos.length > 0 && <div className="lot-photo-list">{photos.map((photo) => <span key={`${photo.name}-${photo.lastModified}`}>{photo.name}</span>)}</div>}
            </FormSection>

            {error && <div className="lot-error">{error}</div>}

            <div className="lot-submit-row"><span>Los campos marcados con * son obligatorios.</span><button type="submit" disabled={submitting}>{submitting ? 'Publicando…' : 'Publicar lote'}</button></div>
          </form>
        </main>
      </div>
  )
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="lot-card"><div className="lot-card-head"><span className="lot-step">{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="lot-card-body">{children}</div></section>
}

function Field({ label, required = false, wide = false, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return <label className={`lot-field ${wide ? 'wide' : ''}`}><span>{label}{required && <b> *</b>}</span>{children}</label>
}

function CheckCard({ checked, onChange, title, description }: { checked: boolean; onChange: (value: boolean) => void; title: string; description: string }) {
  return <button type="button" className={`lot-check-card ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}><span className="lot-check-box">{checked ? '✓' : ''}</span><span><strong>{title}</strong><small>{description}</small></span></button>
}

function ModeButton({ active, onClick, title }: { active: boolean; onClick: () => void; title: string }) {
  return <button type="button" className={`lot-mode ${active ? 'active' : ''}`} onClick={onClick}><span className="lot-radio">{active ? '●' : ''}</span><strong>{title}</strong></button>
}
