import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../auth/AuthContext.tsx'
import { PageHeading } from './AdminHome.tsx'

type AdminAccountSettings = {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
}

type PlatformSettings = {
  allowRegistrations: boolean
  allowPublications: boolean
  announcement: string
}

const PLATFORM_STORAGE_KEY = 'corral-admin-platform-settings'
const PLATFORM_NAME = 'Corral Abierto'

function accountStorageKey(username: string) {
  return `corral-admin-account:${username || 'admin'}`
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function DisplayItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-settings-display-item">
      <span>{label}</span>
      <strong>{value || 'Sin registrar'}</strong>
    </div>
  )
}

export default function AdminSettings() {
  const { user } = useAuth()
  const authUsername = user?.username ?? ''

  const initialAccount = useMemo<AdminAccountSettings>(() => {
    const fallback: AdminAccountSettings = {
      firstName: '',
      lastName: '',
      username: authUsername,
      email: authUsername.includes('@') ? authUsername : '',
      phone: '',
    }

    return readJson(accountStorageKey(authUsername), fallback)
  }, [authUsername])

  const initialPlatform = useMemo<PlatformSettings>(() => {
    return readJson<PlatformSettings>(PLATFORM_STORAGE_KEY, {
      allowRegistrations: true,
      allowPublications: true,
      announcement: '',
    })
  }, [])

  const [account, setAccount] = useState<AdminAccountSettings>(initialAccount)
  const [platform, setPlatform] = useState<PlatformSettings>(initialPlatform)
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [isEditingPlatform, setIsEditingPlatform] = useState(false)
  const [emailLocked, setEmailLocked] = useState(Boolean(initialAccount.email))
  const [accountSaved, setAccountSaved] = useState(false)
  const [platformSaved, setPlatformSaved] = useState(false)

  function updateAccount(field: keyof AdminAccountSettings, value: string) {
    setAccount((current) => ({ ...current, [field]: value }))
    setAccountSaved(false)
  }

  function updatePlatform<K extends keyof PlatformSettings>(field: K, value: PlatformSettings[K]) {
    setPlatform((current) => ({ ...current, [field]: value }))
    setPlatformSaved(false)
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const valueToSave: AdminAccountSettings = {
      ...account,
      username: authUsername || account.username,
      email: account.email.trim(),
    }

    localStorage.setItem(accountStorageKey(authUsername), JSON.stringify(valueToSave))
    setAccount(valueToSave)
    if (valueToSave.email) setEmailLocked(true)
    setAccountSaved(true)
    setIsEditingAccount(false)
  }

  function cancelAccountEdit() {
    setAccount(readJson(accountStorageKey(authUsername), initialAccount))
    setAccountSaved(false)
    setIsEditingAccount(false)
  }

  function savePlatform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(platform))
    setPlatformSaved(true)
    setIsEditingPlatform(false)
  }

  function cancelPlatformEdit() {
    setPlatform(readJson(PLATFORM_STORAGE_KEY, initialPlatform))
    setPlatformSaved(false)
    setIsEditingPlatform(false)
  }

  return (
    <section className="admin-page admin-settings-page">
      <PageHeading
        eyebrow="AJUSTES"
        title="Cuenta y plataforma"
        description="Consulta la información administrativa y modifica únicamente los datos que necesites."
      />

      <div className="admin-settings-stack">
        <section className="admin-panel admin-settings-section">
          <div className="admin-settings-section-head admin-settings-section-head-actions">
            <div className="admin-settings-section-head-main">
              <div className="admin-settings-section-icon" aria-hidden="true">◎</div>
              <div>
                <h2>Cuenta del administrador</h2>
                <p>Información básica asociada a tu cuenta administrativa.</p>
              </div>
            </div>

            {!isEditingAccount && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => {
                  setAccountSaved(false)
                  setIsEditingAccount(true)
                }}
              >
                Editar información
              </button>
            )}
          </div>

          {!isEditingAccount ? (
            <div className="admin-settings-display-grid">
              <DisplayItem label="Nombre" value={account.firstName} />
              <DisplayItem label="Apellidos" value={account.lastName} />
              <DisplayItem label="Nombre de usuario" value={account.username} />
              <DisplayItem label="Correo electrónico" value={account.email} />
              <DisplayItem label="Teléfono" value={account.phone} />

              {accountSaved && (
                <div className="admin-settings-inline-status">Cambios guardados</div>
              )}
            </div>
          ) : (
            <form className="admin-settings-form" onSubmit={saveAccount}>
              <div className="admin-settings-grid">
                <label className="admin-settings-field">
                  <span>Nombre</span>
                  <input
                    type="text"
                    value={account.firstName}
                    onChange={(event) => updateAccount('firstName', event.target.value)}
                    placeholder="Nombre"
                  />
                </label>

                <label className="admin-settings-field">
                  <span>Apellidos</span>
                  <input
                    type="text"
                    value={account.lastName}
                    onChange={(event) => updateAccount('lastName', event.target.value)}
                    placeholder="Apellidos"
                  />
                </label>

                <label className="admin-settings-field">
                  <span>Nombre de usuario</span>
                  <input type="text" value={account.username} readOnly aria-readonly="true" />
                  <small>El usuario está vinculado al acceso de la cuenta.</small>
                </label>

                <label className="admin-settings-field">
                  <span>Correo electrónico</span>
                  <input
                    type="email"
                    value={account.email}
                    onChange={(event) => updateAccount('email', event.target.value)}
                    placeholder="Agregar correo"
                    readOnly={emailLocked}
                    aria-readonly={emailLocked}
                  />
                  <small>
                    {emailLocked
                      ? 'El correo ya fue registrado y no se puede modificar.'
                      : 'Puedes agregar un correo una sola vez. Después quedará bloqueado.'}
                  </small>
                </label>

                <label className="admin-settings-field admin-settings-field-wide">
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    value={account.phone}
                    onChange={(event) => updateAccount('phone', event.target.value)}
                    placeholder="Teléfono"
                  />
                </label>
              </div>

              <div className="admin-settings-actions">
                <button className="admin-text-button" type="button" onClick={cancelAccountEdit}>
                  Cancelar
                </button>
                <button className="admin-primary-button" type="submit">Guardar cambios</button>
              </div>
            </form>
          )}
        </section>

        <section className="admin-panel admin-settings-section">
          <div className="admin-settings-section-head admin-settings-section-head-actions">
            <div className="admin-settings-section-head-main">
              <div className="admin-settings-section-icon" aria-hidden="true">◇</div>
              <div>
                <h2>Configuración de la plataforma</h2>
                <p>Controles generales para la operación de Corral Abierto.</p>
              </div>
            </div>

            {!isEditingPlatform && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => {
                  setPlatformSaved(false)
                  setIsEditingPlatform(true)
                }}
              >
                Editar configuración
              </button>
            )}
          </div>

          {!isEditingPlatform ? (
            <div className="admin-platform-summary">
              <div className="admin-settings-display-grid admin-settings-display-grid-platform">
                <DisplayItem label="Nombre" value={PLATFORM_NAME} />
                <DisplayItem
                  label="Nuevos registros"
                  value={platform.allowRegistrations ? 'Permitidos' : 'Desactivados'}
                />
                <DisplayItem
                  label="Nuevas publicaciones"
                  value={platform.allowPublications ? 'Permitidas' : 'Desactivadas'}
                />
                <DisplayItem
                  label="Aviso general"
                  value={platform.announcement || 'Sin aviso activo'}
                />
              </div>

              {platformSaved && (
                <div className="admin-settings-inline-status">Configuración guardada</div>
              )}
            </div>
          ) : (
            <form className="admin-settings-form" onSubmit={savePlatform}>
              <div className="admin-settings-fixed-row">
                <span>Nombre</span>
                <strong>{PLATFORM_NAME}</strong>
              </div>

              <div className="admin-settings-toggles">
                <label className="admin-toggle-row">
                  <div>
                    <strong>Permitir nuevos registros</strong>
                    <span>Permite que nuevos usuarios creen una cuenta.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={platform.allowRegistrations}
                    onChange={(event) => updatePlatform('allowRegistrations', event.target.checked)}
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <strong>Permitir nuevas publicaciones</strong>
                    <span>Permite que los vendedores publiquen nuevos lotes.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={platform.allowPublications}
                    onChange={(event) => updatePlatform('allowPublications', event.target.checked)}
                  />
                </label>
              </div>

              <label className="admin-settings-field admin-settings-field-full">
                <span>Aviso general</span>
                <textarea
                  rows={4}
                  value={platform.announcement}
                  onChange={(event) => updatePlatform('announcement', event.target.value)}
                  placeholder="Escribe un aviso para la plataforma si es necesario."
                />
              </label>

              <div className="admin-settings-actions">
                <button className="admin-text-button" type="button" onClick={cancelPlatformEdit}>
                  Cancelar
                </button>
                <button className="admin-primary-button" type="submit">Guardar configuración</button>
              </div>
            </form>
          )}
        </section>
      </div>
    </section>
  )
}
