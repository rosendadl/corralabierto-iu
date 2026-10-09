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
      await login(username.trim(), password)
    } catch (err) {
      setError((err as Error).message || 'No se pudo iniciar sesión')
      setLoading(false)
    }
  }

  return (
      <main className="auth-shell">
        <div className="auth-frame">
          <section className="auth-brand-panel">
            <img className="auth-logo" src={logo} alt="Corral Abierto" />
            <div className="auth-brand-copy">
              <span className="auth-kicker">MERCADO GANADERO</span>
              <h2>Compra y vende ganado con una experiencia más clara.</h2>
              <p>Encuentra productores, compara publicaciones y administra tu actividad desde una sola cuenta.</p>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-content">
              <nav className="auth-tabs" aria-label="Acceso">
                <Link className="auth-tab active" to="/login">Iniciar sesión</Link>
                <Link className="auth-tab" to="/register">Crear cuenta</Link>
              </nav>

              <div className="auth-copy">
                <span className="auth-form-kicker">BIENVENIDO</span>
                <h1>Inicia sesión</h1>
                <p>Continúa a tu cuenta de Corral Abierto.</p>
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
                  <label htmlFor="password">Contraseña</label>
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
        </div>
      </main>
  )
}
