import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext.tsx'
import { animals } from './catalogData.ts'
import { fromCatalog, fromLot, type ApiLot, type LotDetail } from './lotDetails.ts'

const SHOW_DEMO_LOTS = true
const demoLots = SHOW_DEMO_LOTS ? animals.map(fromCatalog) : []

export function useCatalog() {
    const { authFetch } = useAuth()
    const [apiLots, setApiLots] = useState<LotDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return authFetch<ApiLot[]>('/api/user/lots/catalog')
            .then((lots) => setApiLots(lots.map(fromLot)))
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo.'))
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {
        load()
    }, [load])

    return { lots: [...apiLots, ...demoLots], loading, error, reload: load }
}
