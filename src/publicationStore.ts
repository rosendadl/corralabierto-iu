export type PublicationStatus = 'activa' | 'pausada' | 'vendida'
export type SaleMode = 'kg' | 'cabeza' | 'lote'

export interface LotPublication {
  id: string
  username: string
  title: string
  species: string
  breed: string
  category: string
  headCount: number
  avgAgeMonths: number | null
  state: string
  municipality: string
  vaccinated: boolean
  negativeTests: boolean
  vaccinesDetail: string
  testsDetail: string
  avgWeightKg: number | null
  saleMode: SaleMode
  price: number
  photoNames: string[]
  status: PublicationStatus
  createdAt: string
}

const PREFIX = 'corral-publications:'

function key(username?: string | null) {
  return `${PREFIX}${(username || 'guest').toLowerCase()}`
}

export function loadPublications(username?: string | null): LotPublication[] {
  try {
    const raw = localStorage.getItem(key(username))
    if (!raw) return []
    const parsed = JSON.parse(raw) as LotPublication[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePublication(username: string, publication: Omit<LotPublication, 'id' | 'username' | 'createdAt' | 'status'>) {
  const current = loadPublications(username)
  const next: LotPublication = {
    ...publication,
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    username,
    createdAt: new Date().toISOString(),
    status: 'activa',
  }

  localStorage.setItem(key(username), JSON.stringify([next, ...current]))
  window.dispatchEvent(new Event('corral-publications-updated'))
  return next
}
