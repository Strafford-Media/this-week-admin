import { useLayoutEffect, useRef } from 'react'

export const useOnlyOnce = (callback: () => any, condition = true) => {
  const hasRunOnce = useRef(false)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useLayoutEffect(() => {
    if (!hasRunOnce.current && condition) {
      callbackRef.current?.()
      hasRunOnce.current = true
    }
  }, [condition])
}
