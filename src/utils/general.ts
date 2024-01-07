import { MouseEvent } from 'react'

export const capitalize = (str?: string | null) =>
  str
    ?.at(0)
    ?.toUpperCase()
    .concat(str?.slice(1)) ?? ''

export const arePrimitiveArraysEqual = (arr1 = [], arr2 = []) => {
  if (arr1.length !== arr2.length) {
    return false
  }

  const arr1Map = arr1.reduce((map, item) => ({ ...map, [item]: true }), {})

  return arr2.every((item) => arr1Map[item])
}

export const formatDate = (date: string | Date) => {
  if (!date) {
    return ''
  }

  const dateObj = new Date(date)

  if (dateObj.toString() === 'Invalid Date') {
    return date.toString()
  }

  return dateObj.toLocaleDateString()
}
export const formatTime = (date: string | Date) => {
  if (!date) {
    return ''
  }

  const dateObj = new Date(date)

  if (dateObj.toString() === 'Invalid Date') {
    return date.toString()
  }

  return dateObj.toLocaleTimeString()
}
export const formatDateTime = (date: string | Date) => {
  if (!date) {
    return ''
  }

  const dateObj = new Date(date)

  if (dateObj.toString() === 'Invalid Date') {
    return date.toString()
  }

  return dateObj.toLocaleString()
}

export const prevDefAndNoProp = (callback?: (e: MouseEvent) => any) => (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  callback?.(e)
}
