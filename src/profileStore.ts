export type TradeMode = 'comprador' | 'vendedor' | 'ambos'
export type Facility = 'rancho' | 'oficina' | 'particular'

export interface LocalProfile {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  tradeMode: TradeMode
  facility: Facility
  address: string
  postalCode: string
  locality: string
  municipality: string
  state: string
  avatar?: string
  catalogVisible?: boolean
  emailNotifications?: boolean
}

export interface PendingRegistration {
  username: string
  email: string
}

const PROFILE_PREFIX = 'corral-profile:'
const PENDING_KEY = 'corral-pending-registration'

export function profileKey(username: string) {
  return `${PROFILE_PREFIX}${username.toLowerCase()}`
}

export function loadProfile(username?: string | null): LocalProfile | null {
  if (!username) return null
  try {
    const raw = localStorage.getItem(profileKey(username))
    return raw ? (JSON.parse(raw) as LocalProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: LocalProfile) {
  localStorage.setItem(profileKey(profile.username), JSON.stringify(profile))
  window.dispatchEvent(new Event('corral-profile-updated'))
}

export function savePendingRegistration(data: PendingRegistration) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(data))
}

export function loadPendingRegistration(): PendingRegistration | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as PendingRegistration) : null
  } catch {
    return null
  }
}

export function clearPendingRegistration() {
  sessionStorage.removeItem(PENDING_KEY)
}

export function displayName(profile: LocalProfile | null, username?: string | null) {
  const full = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
  return full || username || 'Usuario'
}

export function initials(profile: LocalProfile | null, username?: string | null) {
  const name = displayName(profile, username)
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
}

export function modeLabel(mode?: TradeMode) {
  if (mode === 'comprador') return 'Comprador'
  if (mode === 'vendedor') return 'Vendedor'
  return 'Comprador y vendedor'
}

export function canBuy(mode?: TradeMode) {
  return mode === 'comprador' || mode === 'ambos' || !mode
}

export function canSell(mode?: TradeMode) {
  return mode === 'vendedor' || mode === 'ambos'
}
