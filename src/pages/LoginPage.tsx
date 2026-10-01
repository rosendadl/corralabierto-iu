import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [mode, setMode] = useState<'credentials' | 'phone'>('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (mode === 'phone') {
      alert(`Simulación: se enviaría un código SMS al +52 ${phone}`)
      return
    }

    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
      <main className="corral-login-page">
        <div className="corral-login-shell">
          <section className="corral-login-panel">
            <div>
              <header className="corral-brand">
                <div className="corral-brand-icon">
                  <span className="material-symbols-outlined">fence</span>
                </div>
                <div>
                  <strong>Corral Abierto</strong>
                  <span>Mercado Ganadero Digital de Alta Confianza</span>
                </div>
              </header>

              <div className="corral-heading">
                <h1>Bienvenido de vuelta, productor</h1>
                <p>
                  Ingresa para gestionar tus lotes de subasta, inspecciones sanitarias y
                  liquidaciones seguras.
                </p>
              </div>

              <div className="corral-tabs">
                <button
                    type="button"
                    className={mode === 'credentials' ? 'active' : ''}
                    onClick={() => setMode('credentials')}
                >
                  <span className="material-symbols-outlined">badge</span>
                  Correo o Clave
                </button>
                <button
                    type="button"
                    className={mode === 'phone' ? 'active' : ''}
                    onClick={() => setMode('phone')}
                >
                  <span className="material-symbols-outlined">sms</span>
                  Celular (SMS)
                </button>
              </div>

              <form className="corral-form" onSubmit={handleSubmit}>
                {mode === 'credentials' ? (
                    <>
                      <label>
                        Correo electrónico, RFC o Clave UPP Ganadera
                        <div className="corral-input-wrap">
                          <span className="material-symbols-outlined">account_circle</span>
                          <input
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="ejemplo@ranchoelrodeo.com o RFC/UPP"
                              required
                              autoFocus
                          />
                        </div>
                      </label>

                      <label>
                        Contraseña de acceso
                        <div className="corral-input-wrap">
                          <span className="material-symbols-outlined">lock</span>
                          <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                          />
                          <button
                              type="button"
                              className="corral-eye"
                              onClick={() => setShowPassword((value) => !value)}
                              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                          </button>
                        </div>
                      </label>
                    </>
                ) : (
                    <label>
                      Número de teléfono móvil (10 dígitos)
                      <div className="corral-input-wrap corral-phone-input">
                        <span className="corral-prefix">+52</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="646 123 4567"
                            required
                        />
                      </div>
                      <small>Te enviaremos un código temporal de verificación por SMS.</small>
                    </label>
                )}

                <div className="corral-options">
                  <label className="corral-check">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    Recordar este equipo en el rancho
                  </label>
                  <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                {error && <p className="corral-error">{error}</p>}

                <button className="corral-submit" type="submit" disabled={loading}>
                  <span>{loading ? 'Ingresando…' : mode === 'phone' ? 'Enviar código' : 'Ingresar a mi cuenta'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div className="corral-divider"><span>o accede rápidamente con</span></div>

              <div className="corral-social-buttons">
                <button type="button">
                  <span className="material-symbols-outlined">chat</span>
                  Código WhatsApp
                </button>
                <button type="button">Cuenta Google</button>
              </div>

              <p className="corral-register">
                ¿Aún no tienes registro ganadero? <Link to="/register">Crea tu cuenta en Corral Abierto</Link>
              </p>
            </div>

            <div className="corral-trust">
              <span><span className="material-symbols-outlined">verified</span>Validado SENASICA</span>
              <span><span className="material-symbols-outlined">shield_locked</span>Pago en Custodia</span>
              <span><span className="material-symbols-outlined">support_agent</span>Soporte Técnico 24/7</span>
            </div>
          </section>

          <aside className="corral-photo-panel">
            <div className="corral-photo-overlay" />
            <div className="corral-photo-content">
              <div className="corral-live-row">
                <span className="corral-live-badge"><i />Subasta Activa en Tiempo Real</span>
                <span>Ciclo 2025</span>
              </div>

              <div className="corral-metrics">
                <div><strong>+1,200</strong><span>Ganaderías Certificadas</span></div>
                <div><strong>100%</strong><span>Trazabilidad SINIIGA</span></div>
                <div className="wide"><strong>$45,000,000+ MXN</strong><span>Liquidados con garantía prendaria</span></div>
              </div>

              <blockquote>
                “Corral Abierto nos permitió vender nuestros lotes directamente a engordadores de primera línea y con el pago totalmente garantizado en la báscula.”
                <footer>Don Heriberto Ramos · Rancho El Fresno</footer>
              </blockquote>

              <div className="corral-side-footer">
                <span>Infraestructura Ganadera Segura</span>
                <span>Versión 3.4.2</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
  )
}
