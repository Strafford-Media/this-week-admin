import { useNhostClient } from '@nhost/react'
import { useEffect, useRef, useState } from 'react'

export const useNhostFunction = <T = any>(
  path: string,
  payload: any
): { data: T | null; error: any; loading: boolean; refetch(): void } => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(loading)
  loadingRef.current = loading

  const [refetchStatus, setRefetchStatus] = useState(0)
  const refetch = () => setRefetchStatus((c) => (loadingRef.current ? c : c + 1))

  const nhost = useNhostClient()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await nhost.functions.call<T>(path, payload, { useAxios: false })

      if (result.error) {
        setData(null)
        setError(result.error)
      } else {
        setData(result.res.data)
        setError(null)
      }
      setLoading(false)
    })()
  }, [path, JSON.stringify(payload), refetchStatus])

  return { data, error, loading, refetch }
}
