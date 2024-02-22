import { Button, Modal, TextInput, Toggle } from '@8thday/react'
import { CheckIcon, NoSymbolIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import React, { ComponentProps, Fragment, useMemo, useState } from 'react'
import { IconButton } from '../atoms/IconButton'
import clsx from 'clsx'

const defaultDays = {
  Sunday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Monday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Tuesday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Wednesday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Thursday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Friday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
  Saturday: {
    open: '9:00a',
    close: '6:00p',
    inactive: true,
  },
}

interface Day {
  open: string
  close: string
  day: string
  inactive?: boolean
}

export interface BusinessHoursProps extends ComponentProps<'div'> {
  businessHours: Record<string, { open: string; close: string }>
  onUpdate(bh: any): void
}

export const BusinessHours = ({ className = '', businessHours, onUpdate, ...props }: BusinessHoursProps) => {
  const [openEditor, setOpenEditor] = useState(false)
  const [editingDay, setEditingDay] = useState('')
  const [newDay, setNewDay] = useState('')

  const days = useMemo(() => {
    const joinedDays = { ...defaultDays, ...businessHours }

    return Object.keys(joinedDays).map<Day>((day) => ({ day, ...joinedDays[day] }))
  }, [businessHours])

  const saveNewDay = () => {
    const updatedBusinessHours = days.reduce((newBH, day) => {
      const { day: removedDay, ...filteredDay } = day

      if (editingDay === day.day) {
        newBH[newDay] = filteredDay
      } else {
        newBH[day.day] = filteredDay
      }
      return newBH
    }, {})

    setEditingDay('')
    setNewDay('')
    onUpdate(updatedBusinessHours)
  }

  const updateKey = (day: string, key: string, value: any) => {
    const businessHoursCopy = copyObject({ ...defaultDays, ...businessHours })
    businessHoursCopy[day][key] = value

    onUpdate(businessHoursCopy)
  }

  const newDayErrorMessage =
    newDay !== editingDay && days.some((d) => d.day === newDay) ? 'This label is already in use.' : ''

  const activeDays = days.filter((day) => !day.inactive)

  return (
    <div className={`${className} flex flex-wrap gap-4`} {...props}>
      <label className="w-full">Business Hours</label>
      {activeDays.map((day) => (
        <div className="flex-center flex-col">
          <span className="text-gray-800">{day.day}</span>
          <span className="text-sm text-gray-700">Open: {day.open}</span>
          <span className="text-sm text-gray-700">Close: {day.close}</span>
        </div>
      ))}
      {!activeDays.length && <p className="text-sm text-gray-500">No Hours Listed</p>}
      <div className="w-full">
        <Button PreIcon={PencilIcon} onClick={() => setOpenEditor(true)}>
          Edit Hours
        </Button>
      </div>
      {openEditor && (
        <Modal portal onClose={() => setOpenEditor(false)}>
          <div className="mb-4 grid gap-6 sm:grid-cols-auto-2 lg:grid-cols-auto-3 xl:grid-cols-auto-4 2xl:grid-cols-auto-5">
            <h3 className="col-span-full">Edit Business Hours</h3>
            {days.map((day, i) => (
              <div
                key={day.day}
                className={clsx('flex flex-col rounded border border-gray-300 p-2', { 'opacity-60': day.inactive })}
              >
                {editingDay === day.day ? (
                  <div className="flex items-start justify-center gap-1">
                    <TextInput
                      id="current-day-label-editing"
                      placeholder="Day Label"
                      errorMessage={newDayErrorMessage}
                      required
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveNewDay()}
                    />
                    <IconButton
                      className="!h-10 text-green-500"
                      srLabel="Save Label"
                      icon={CheckIcon}
                      onClick={() => saveNewDay()}
                    />
                    <IconButton
                      className="!h-10 text-red-500"
                      srLabel="Discard Edits"
                      icon={NoSymbolIcon}
                      onClick={() => {
                        setEditingDay('')
                        setNewDay('')
                      }}
                    />
                  </div>
                ) : (
                  <label className="flex-center mb-4">
                    {day.day}
                    <IconButton
                      srLabel="Edit Day Label"
                      icon={PencilIcon}
                      onClick={() => {
                        setEditingDay(day.day)
                        setNewDay(day.day)
                        setTimeout(() => {
                          document.querySelector<HTMLInputElement>('#current-day-label-editing')?.focus()
                        }, 10)
                      }}
                    />
                  </label>
                )}
                <div className="mb-2 mt-auto flex gap-2">
                  <TextInput
                    disabled={day.inactive}
                    collapseDescriptionArea
                    label="Open"
                    value={day.open}
                    onChange={(e) => updateKey(day.day, 'open', e.target.value)}
                  />
                  <TextInput
                    disabled={day.inactive}
                    collapseDescriptionArea
                    label="Close"
                    value={day.close}
                    onChange={(e) => updateKey(day.day, 'close', e.target.value)}
                  />
                </div>
                {defaultDays[day.day] ? (
                  <Toggle
                    checked={!day.inactive}
                    setChecked={(c) => updateKey(day.day, 'inactive', !c)}
                    rightLabel="Active"
                  />
                ) : (
                  <Button
                    className="self-start"
                    PreIcon={TrashIcon}
                    variant="destructive"
                    onClick={() => {
                      if (!confirm(`Delete business hours for ${day.day}?`)) return
                      const filteredBusinessHours = days.reduce((fBH, d) => {
                        if (d.day === day.day) {
                          return fBH
                        }

                        fBH[d.day] = copyObject(d)

                        return fBH
                      }, {})

                      onUpdate(filteredBusinessHours)
                    }}
                  >
                    Delete Custom Day
                  </Button>
                )}
              </div>
            ))}
            <Button
              className="m-auto h-fit w-fit"
              PreIcon={PlusIcon}
              onClick={() => {
                const businessHoursCopy = copyObject({ ...defaultDays, ...businessHours })
                businessHoursCopy[''] = { open: '', close: '' }
                onUpdate(businessHoursCopy)
                setNewDay('')
                setEditingDay('')
                setTimeout(() => {
                  document.querySelector<HTMLInputElement>('#current-day-label-editing')?.focus()
                }, 10)
              }}
            >
              Add New Custom Day
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

const copyObject = (obj: any) => {
  if (!obj) return obj

  if (Array.isArray(obj)) {
    return obj.map((sub) => copyObject(sub))
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((newObj, key) => ({ ...newObj, [key]: copyObject(obj[key]) }), {})
  }

  return obj
}
