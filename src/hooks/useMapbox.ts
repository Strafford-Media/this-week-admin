import mapbox, { MapboxOptions } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'

export interface UseMapboxOptions {
  center?: MapboxOptions['center']
  onClick?(latlng: number[]): void
}

export const useMapbox = <ElRef extends HTMLElement = HTMLDivElement>({ center, onClick }: UseMapboxOptions = {}) => {
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick
  const mapboxRef = useRef<mapbox.Map>()
  const [container, setContainer] = useState<ElRef | null>(null)

  useEffect(() => {
    if (mapboxRef.current || !container || !center) return

    mapboxRef.current = new mapbox.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 1,
    })

    mapboxRef.current.on('click', (e) => {
      onClickRef.current?.(e.lngLat.toArray())
    })
  }, [container])

  return {
    mapboxRef,
    container,
    setContainer,
  }
}
