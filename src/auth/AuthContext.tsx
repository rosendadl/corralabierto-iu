import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from '../api.ts'
import type { User } from '../types.ts'
import { readToken } from './jwt.ts'

interface AuthValue {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  authFetch: <T>(path: string) => Promise<T>
}

const AuthContext = createContext<AuthValue | null>(null)
const TOKEN_KEY = 'token'

function storedToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  return token && readToken(token) ? token : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(storedToken)
  const claims = token ? readToken(token) : null
  const user: User | null = claims ? { username: claims.sub, role: claims.role } : null

  function saveToken(value: string | null) {
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
    setToken(value)
  }

  async function login(username: string, password: string) {
    const res = await api<{ accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    saveToken(res.accessToken)
  }

  async function register(username: string, password: string) {
    await api('/api/auth/register', { method: 'POST', body: { username, password } })
    await login(username, password)
  }

  function logout() {
    saveToken(null)
  }

  // For protected endpoints: adds the token, and logs out if the backend rejects it.
  async function authFetch<T>(path: string) {
    try {
      return await api<T>(path, { token })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout()
      throw err
    }
  }

  // Log out automatically when the token expires.
  const expiresAt = claims?.exp
  useEffect(() => {
    if (!expiresAt) return
    const id = setTimeout(() => saveToken(null), expiresAt * 1000 - Date.now())
    return () => clearTimeout(id)
  }, [expiresAt])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
