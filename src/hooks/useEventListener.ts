import { useEffect, useRef } from 'react'

export const useEventListener = (event, callback) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const listener = (e) => callbackRef.current(e)

    window.addEventListener(event, listener)

    return () => window.removeEventListener(event, listener)
  }, [event])
}
