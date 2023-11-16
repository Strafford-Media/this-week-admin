import { useState } from 'react'
import { useTimeout } from './useTimeout'

export const useArtificialLoader = (ms: number = 600) => {
  const [loading, setLoading] = useState(true)

  useTimeout(() => {
    setLoading(false)
  }, ms)

  return loading
}
