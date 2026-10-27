import heroImage from './assets/hero.png'
import type { LotPublication, SaleMode } from './publicationStore.ts'
import type { CatalogAnimal } from './catalogData.ts'

export interface LotSeller {
    username: string
    name: string
    location: string
    avatarUrl: string | null
    rating: string | null
    deals: string
}

export interface LotDetail {
    id: string
    title: string
    species: string
    breed: string
    category: string
    headCount: number
    avgAgeMonths: number | null
    avgWeightKg: number | null
    state: string
    municipality: string
    vaccinated: boolean
    negativeTests: boolean
    vaccinesDetail: string
    testsDetail: string
    saleMode: SaleMode
    price: number
    images: string[]
    status: string
    description: string
    seller: LotSeller
    // Etiquetas opcionales de la tarjeta del catálogo (solo las traen los lotes demo).
    cardExtra?: string
    cardNote?: string
}

// Un lote tal como lo regresa el API (LotResponse.java).
export type ApiLot = Omit<LotPublication, 'id'> & { id: number }

export interface LotDetailResponse {
    lot: ApiLot
    seller: {
        username: string
        displayName: string
        municipality: string | null
        state: string | null
        profileImageUrl: string | null
        activeLots: number
    }
}

// Ficha completa: lote + datos del vendedor (GET /api/user/lots/{id}).
export function fromApi({ lot, seller }: LotDetailResponse): LotDetail {
    return {
        ...fromLot(lot),
        seller: {
            username: seller.username,
            name: seller.displayName,
            location: [seller.municipality, seller.state].filter(Boolean).join(', ') || 'Ubicación no registrada',
            avatarUrl: seller.profileImageUrl,
            rating: null,
            deals: `${seller.activeLots} lote(s) activo(s)`,
        },
    }
}

// Solo el lote, sin datos del vendedor (GET /api/user/lots/catalog).
export function fromLot(lot: ApiLot): LotDetail {
    return {
        id: String(lot.id),
        title: lot.title,
        species: lot.species,
        breed: lot.breed,
        category: lot.category,
        headCount: lot.headCount,
        avgAgeMonths: lot.avgAgeMonths,
        avgWeightKg: lot.avgWeightKg === null ? null : Number(lot.avgWeightKg),
        state: lot.state,
        municipality: lot.municipality,
        vaccinated: lot.vaccinated,
        negativeTests: lot.negativeTests,
        vaccinesDetail: lot.vaccinesDetail ?? '',
        testsDetail: lot.testsDetail ?? '',
        saleMode: lot.saleMode,
        price: Number(lot.price),
        // El API todavía solo guarda nombres de archivo, no URLs; usamos una foto genérica.
        images: [heroImage],
        status: lot.status,
        description: `Lote de ${lot.headCount} ${lot.breed} (${lot.category.toLowerCase()}) originario de ${lot.municipality}, ${lot.state}.`,
        seller: {
            username: lot.username,
            name: lot.username,
            location: `${lot.municipality}, ${lot.state}`,
            avatarUrl: null,
            rating: null,
            deals: 'Vendedor de Corral Abierto',
        },
    }
}

export function fromCatalog(animal: CatalogAnimal): LotDetail {
    const [municipality, state = ''] = animal.location.split(',').map((part) => part.trim())
    const headCount = Number(animal.badge.match(/\d+/)?.[0] ?? animal.extra.match(/\d+/)?.[0] ?? 1)
    const ageNumber = parseInt(animal.age, 10)
    const avgAgeMonths = Number.isNaN(ageNumber) ? null : animal.age.includes('día') ? Math.round(ageNumber / 30) : ageNumber

    return {
        id: animal.id,
        title: animal.title,
        species: animal.species,
        breed: animal.breed,
        category: animal.category,
        headCount,
        avgAgeMonths,
        avgWeightKg: animal.weightKg,
        state,
        municipality,
        vaccinated: animal.vaccinated,
        negativeTests: animal.vaccinated,
        vaccinesDetail: animal.vaccinated ? 'Esquema completo de vacunación y desparasitación vigente.' : '',
        testsDetail: animal.vaccinated ? 'Pruebas negativas de Tuberculosis y Brucelosis.' : '',
        saleMode: animal.unit.includes('cab') ? 'cabeza' : 'lote',
        price: animal.price,
        images: [animal.image],
        status: animal.badge === 'Reservada' ? 'reservada' : 'activa',
        description: `${animal.title}. ${animal.extra}${animal.note ? ` · ${animal.note}` : ''}. Lote de ${animal.seller}, listo para inspección en ${animal.location}.`,
        seller: {
            username: animal.seller,
            name: animal.seller,
            location: animal.location,
            avatarUrl: null,
            rating: animal.rating || null,
            deals: animal.deals,
        },
        cardExtra: animal.extra,
        cardNote: animal.note,
    }
}

export function pricing(lot: LotDetail) {
    if (lot.saleMode === 'lote') {
        return { perHead: lot.price / lot.headCount, total: lot.price, perKg: lot.avgWeightKg ? lot.price / lot.headCount / lot.avgWeightKg : null }
    }
    if (lot.saleMode === 'kg') {
        const perHead = lot.avgWeightKg ? lot.price * lot.avgWeightKg : null
        return { perHead, total: perHead === null ? null : perHead * lot.headCount, perKg: lot.price }
    }
    return { perHead: lot.price, total: lot.price * lot.headCount, perKg: lot.avgWeightKg ? lot.price / lot.avgWeightKg : null }
}

export function money(value: number) {
    return `$${value.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`
}

export function statusLabel(lot: LotDetail) {
    if (lot.status === 'activa') return `Disponible: ${lot.headCount} ${lot.headCount === 1 ? 'cabeza' : 'cabezas'}`
    if (lot.status === 'reservada') return 'Reservada'
    if (lot.status === 'pausada') return 'Pausada'
    return 'Vendida'
}
