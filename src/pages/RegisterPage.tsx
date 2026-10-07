import { useState } from 'react'
// import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'
import logo from '../assets/corral-abierto-logo.png'
import './RegisterPage.css'
import { Link, useNavigate } from "react-router";



export default function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !username || !password || !confirmPassword) {
      setError("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      console.log("antes de register")

      await register(username, password)

      console.log("registro exitoso")

      navigate("/user/profile-setup")
      //await register(username, password);
      //navigate("/user/profile-setup");

    } catch {
      setError("No se pudo crear la cuenta");
      setLoading(false)
    }
  }

  /*
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      // Tu backend actual solo recibe username + password.
      // El correo ya se captura en la interfaz para conectarlo cuando el endpoint lo soporte.
      await register(username, password)
      navigate("/user/profile-setup")
    } catch (err) {
      setError((err as Error).message || 'No se pudo crear la cuenta')
      setLoading(false)
    }
  }
*/
  return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="auth-content">
            <img className="auth-logo" src={logo} alt="Corral Abierto" />

            <nav className="auth-tabs" aria-label="Acceso">
              <Link className="auth-tab" to="/login">Iniciar sesión</Link>
              <Link className="auth-tab active" to="/register">Crear cuenta</Link>
            </nav>

            <div className="auth-copy">
              <h1>Crea tu cuenta</h1>
              <p>Regístrate para comprar, publicar y contactar productores.</p>
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

        <aside className="auth-visual register-visual" aria-hidden="true">
          <div className="visual-overlay" />
          <div className="visual-copy">
            <span className="visual-kicker">Corral Abierto</span>
            <h2>Todo tu mercado ganadero en un mismo lugar.</h2>
            <p>Publica lotes, encuentra oportunidades y trata directamente con otros productores.</p>
          </div>
        </aside>
      </main>
  )
}