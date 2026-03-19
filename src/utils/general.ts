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

export const onlyDigitsRegex = /^\d+$/

export const nonNumericInputsRegex = /[^\d.-]/

export const safeClone = <T = any>(obj: any): [Error | null, T] => {
  try {
    return [null, JSON.parse(JSON.stringify(obj)) as T]
  } catch (e) {
    return [e instanceof Error ? e : new Error(e as any), obj]
  }
}

export const displayUserRole = (role: string) => {
  switch (role) {
    case 'subscriber':
      return 'Subscriber'
    case 'user':
      return 'Staff'
    case 'admin':
      return 'Super Admin'
  }
}

export function downloadTableAsCsv(table_id: string, separator = ',') {
  // Select rows from table_id
  const rows = document.querySelectorAll('table#' + table_id + ' tr')

  // Construct csv
  const csv = []

  for (let i = 0; i < rows.length; i++) {
    const row = []
    const cols = rows[i].querySelectorAll<HTMLElement>('td, th')

    for (let j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      const data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')

      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      const cleanData = data.replace(/"/g, '""')

      row.push('"' + cleanData + '"')
    }
    csv.push(row.join(separator))
  }

  const csv_string = csv.join('\n')

  // Download it
  const filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv'
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('target', '_blank')
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string))
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
