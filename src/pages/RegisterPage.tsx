import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'
import logo from '../assets/corral-abierto-logo.png'
import { savePendingRegistration } from '../profileStore.ts'
import './RegisterPage.css'

export default function RegisterPage() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim()
    const cleanUsername = username.trim()

    if (!cleanEmail || !cleanUsername || !password || !confirmPassword) {
      setError('Completa todos los campos para crear tu cuenta.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await register(cleanUsername, password)
      savePendingRegistration({ username: cleanUsername, email: cleanEmail })
      await login(cleanUsername, password)
      navigate('/user/profile-setup')
    } catch (err) {
      setError((err as Error).message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
      <main className="auth-shell">
        <div className="auth-frame">
          <section className="auth-brand-panel">
            <img className="auth-logo" src={logo} alt="Corral Abierto" />
            <div className="auth-brand-copy">
              <span className="auth-kicker">CORRAL ABIERTO</span>
              <h2>Una cuenta para comprar, vender o hacer ambas cosas.</h2>
              <p>Después de crearla completarás los datos básicos de tu perfil antes de entrar al catálogo.</p>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-content">
              <nav className="auth-tabs" aria-label="Acceso">
                <Link className="auth-tab" to="/login">Iniciar sesión</Link>
                <Link className="auth-tab active" to="/register">Crear cuenta</Link>
              </nav>

              <div className="auth-copy">
                <span className="auth-form-kicker">NUEVA CUENTA</span>
                <h1>Crea tu cuenta</h1>
                <p>Todos los campos son obligatorios.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      autoFocus
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="username">Crear usuario</label>
                  <input
                      id="username"
                      type="text"
                      placeholder="Elige tu nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      minLength={3}
                      maxLength={50}
                      required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="password">Contraseña</label>
                  <div className="password-field">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={100}
                        required
                    />
                    <button className="show-password" type="button" onClick={() => setShowPassword((value) => !value)}>
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={100}
                      required
                  />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
  )
}
