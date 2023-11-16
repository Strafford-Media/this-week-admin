import React, { useState, useEffect, useRef } from 'react'

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay) {
      const id = setTimeout(tick, delay)

      return () => clearTimeout(id)
    }
  }, [delay])
}
