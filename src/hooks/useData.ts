// src/hooks/useData.ts
// Simple reusable hook for fetching data with loading/error states.

import { useState, useEffect, useCallback } from 'react'

export function useData<T>(fetcher: () => Promise<T | null>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? 'Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, reload: load }
}
