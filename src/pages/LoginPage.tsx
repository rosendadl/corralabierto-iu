import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'
import logo from '../assets/corral-abierto-logo.png'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
    } catch (err) {
      setError((err as Error).message || 'No se pudo iniciar sesión')
      setLoading(false)
    }
  }

  return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="auth-content">
            <img className="auth-logo" src={logo} alt="Corral Abierto" />

            <nav className="auth-tabs" aria-label="Acceso">
              <Link className="auth-tab active" to="/login">Iniciar sesión</Link>
              <Link className="auth-tab" to="/register">Crear cuenta</Link>
            </nav>

            <div className="auth-copy">
              <h1>Bienvenido de vuelta</h1>
              <p>Entra a tu cuenta para continuar en Corral Abierto.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor="username">Correo o usuario</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Correo o usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    autoFocus
                />
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label htmlFor="password">Contraseña</label>
                  <button className="text-button" type="button">¿La olvidaste?</button>
                </div>
                <div className="password-field">
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                  />
                  <button
                      className="show-password"
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </section>

        <aside className="auth-visual login-visual" aria-hidden="true">
          <div className="visual-overlay" />
          <div className="visual-copy">
            <span className="visual-kicker">Mercado ganadero</span>
            <h2>Compra, vende y conecta con productores de todo México.</h2>
            <p>Una plataforma clara para encontrar ganado, publicar lotes y tratar directo.</p>
          </div>
        </aside>
      </main>
  )
}