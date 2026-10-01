import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, password)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <main className="center">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <p className="muted">New accounts are regular users.</p>

        {/* Same limits as RegisterRequest on the backend. */}
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={50}
            required
            autoFocus
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={72}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button disabled={loading}>{loading ? 'Creating account…' : 'Sign up'}</button>

        <p className="muted">
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}
