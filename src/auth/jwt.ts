import type { Role } from '../types.ts'

interface Claims {
  sub: string
  role: Role
  exp: number
}

export function readToken(token: string): Claims | null {
  try {
    const payload = token.split('.')[1] ?? ''
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const claims = JSON.parse(json) as Claims
    const expired = claims.exp * 1000 <= Date.now()
    return expired ? null : claims
  } catch {
    return null
  }
}
