import { Button, Modal, TextInput, Toggle } from '@8thday/react'
import { CheckIcon, NoSymbolIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import React, { ComponentProps, Fragment, useEffect, useMemo, useState } from 'react'
import { IconButton } from '../atoms/IconButton'
import clsx from 'clsx'

const defaultDays = [
  { day: 'Sunday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Monday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Tuesday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Wednesday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Thursday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Friday', open: '9:00a', close: '6:00p', inactive: true },
  { day: 'Saturday', open: '9:00a', close: '6:00p', inactive: true },
]

interface Day {
  open: string
  close: string
  day: string
  inactive?: boolean
}

export interface BusinessHoursProps extends ComponentProps<'div'> {
  businessHours: Day[]
  onUpdate(bh: any): void
}

export const BusinessHours = ({ className = '', businessHours, onUpdate, ...props }: BusinessHoursProps) => {
  const [openEditor, setOpenEditor] = useState(false)

  const updateKey = (index: number, key: string, value: any) => {
    const businessHoursCopy = businessHours.map((bh, i) => (i === index ? { ...bh, [key]: value } : { ...bh }))

    onUpdate(businessHoursCopy)
  }

  const activeDays = businessHours?.filter?.((day) => !day.inactive) ?? []

  return (
    <div className={`${className} flex flex-wrap gap-4`} {...props}>
      <label className="w-full">Business Hours</label>
      {activeDays.map((day, i) => (
        <div className="flex-center flex-col" key={`${day.day}-${i}`}>
          <span className="text-gray-800">{day.day}</span>
          <span className="text-sm text-gray-700">Open: {day.open}</span>
          <span className="text-sm text-gray-700">Close: {day.close}</span>
        </div>
      ))}
      {!activeDays.length && <p className="text-sm text-gray-500">No Hours Listed</p>}
      <div className="w-full">
        <Button
          PreIcon={PencilIcon}
          onClick={() => {
            if (!businessHours?.length) {
              onUpdate(defaultDays)
            }

            setOpenEditor(true)
          }}
        >
          Edit Hours
        </Button>
      </div>
      {openEditor && (
        <Modal portal onClose={() => setOpenEditor(false)}>
          <div className="mb-4 grid gap-6 sm:grid-cols-auto-2 lg:grid-cols-auto-3 xl:grid-cols-auto-4 2xl:grid-cols-auto-5">
            <h3 className="col-span-full">Edit Business Hours</h3>
            {businessHours.map((day, i) => (
              <div
                key={`${day.day}-${i}`}
                className={clsx('flex flex-col rounded border border-gray-300 p-2', { 'opacity-60': day.inactive })}
              >
                <TextInput
                  className="self-center"
                  id={`bh-day-label-${i}`}
                  placeholder="Day Label"
                  disabled={day.inactive}
                  required
                  value={day.day}
                  onChange={(e) => updateKey(i, 'day', e.target.value)}
                />
                <div className="mb-2 mt-auto flex gap-2">
                  <TextInput
                    disabled={day.inactive}
                    collapseDescriptionArea
                    label="Open"
                    value={day.open}
                    onChange={(e) => updateKey(i, 'open', e.target.value)}
                  />
                  <TextInput
                    disabled={day.inactive}
                    collapseDescriptionArea
                    label="Close"
                    value={day.close}
                    onChange={(e) => updateKey(i, 'close', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Toggle
                    checked={!day.inactive}
                    setChecked={(c) => updateKey(i, 'inactive', !c)}
                    rightLabel="Active"
                  />
                  <Button
                    className="!px-2 [&>svg]:m-0"
                    PreIcon={TrashIcon}
                    variant="destructive"
                    onClick={() => {
                      if (!confirm(`Delete business hours for ${day.day}?`)) return

                      const filteredBusinessHours = businessHours.filter((d, idx) => idx !== i)

                      onUpdate(filteredBusinessHours)
                    }}
                  ></Button>
                </div>
              </div>
            ))}
            <Button
              className="m-auto h-fit w-fit"
              PreIcon={PlusIcon}
              onClick={() => {
                onUpdate(businessHours.concat([{ day: '', open: '', close: '' }]))
                setTimeout(() => {
                  document.querySelector<HTMLInputElement>(`#bh-day-label-${businessHours.length}`)?.focus()
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
