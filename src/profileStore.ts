export type TradeMode = 'comprador' | 'vendedor' | 'ambos'
export type Facility = 'rancho' | 'oficina' | 'particular'
export type Gender = 'mujer' | 'hombre' | 'otro' | 'prefiero_no_decir'

export interface LocalProfile {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  gender: Gender | ''
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
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<LocalProfile>

    return {
      username: parsed.username || username,
      email: parsed.email || '',
      firstName: parsed.firstName || '',
      lastName: parsed.lastName || '',
      phone: parsed.phone || '',
      gender: parsed.gender || '',
      tradeMode: parsed.tradeMode || 'ambos',
      facility: parsed.facility || 'particular',
      address: parsed.address || '',
      postalCode: parsed.postalCode || '',
      locality: parsed.locality || '',
      municipality: parsed.municipality || '',
      state: parsed.state || '',
      avatar: parsed.avatar,
      catalogVisible: parsed.catalogVisible ?? true,
      emailNotifications: parsed.emailNotifications ?? true,
    }
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

export function isProfileComplete(profile: LocalProfile | null) {
  if (!profile) return false

  return [
    profile.firstName,
    profile.lastName,
    profile.phone,
    profile.municipality,
    profile.state,
    profile.gender,
    profile.address,
  ].every((value) => Boolean(value?.trim()))
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

export function genderLabel(gender?: Gender | '') {
  if (gender === 'mujer') return 'Mujer'
  if (gender === 'hombre') return 'Hombre'
  if (gender === 'otro') return 'Otro'
  if (gender === 'prefiero_no_decir') return 'Prefiero no decir'
  return 'No configurado'
}

export function canBuy(mode?: TradeMode) {
  return mode === 'comprador' || mode === 'ambos' || !mode
}

export function canSell(mode?: TradeMode) {
  return mode === 'vendedor' || mode === 'ambos'
}
