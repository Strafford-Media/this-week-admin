import { useEffect, useRef, useState } from 'react'

export function useRememberedState<T>(key: string, initialValue: T | (() => T)) {
  const currentKey = useRef(key)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)

      if (item == null) {
        const newValue = initialValue instanceof Function ? initialValue() : initialValue

        localStorage.setItem(key, JSON.stringify(newValue))

        return newValue
      }

      return item ? JSON.parse(item) : item
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    const valueToStore = typeof value === 'function' ? value(storedValue) : value

    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  useEffect(() => {
    if (key !== currentKey.current) {
      currentKey.current = key
      try {
        const item = localStorage.getItem(key)

        if (item == null) {
          const newValue = initialValue instanceof Function ? initialValue() : initialValue

          localStorage.setItem(key, JSON.stringify(newValue))

          setStoredValue(newValue)
        } else {
          setStoredValue(item ? JSON.parse(item) : item)
        }
      } catch (error) {
        setStoredValue(initialValue)
      }
    }
  }, [key])

  return [storedValue, setValue]
}
