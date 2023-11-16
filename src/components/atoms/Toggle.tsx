import React, { ReactNode } from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

export interface ToggleProps {
  checked?: boolean
  setChecked?(c: boolean): void
  name?: string
  id?: string
  disabled?: boolean
  label?: ReactNode
  description?: ReactNode
  className?: string
}

export const Toggle = ({
  label,
  description,
  checked,
  setChecked,
  id,
  name,
  disabled = false,
  className = '',
}: ToggleProps) => {
  return (
    <Switch.Group as="div" className={clsx(`flex items-center justify-between`, className)}>
      {label && (
        <span className="flex flex-grow flex-col">
          <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
            {label}
          </Switch.Label>
          {description && (
            <Switch.Description as="span" className="text-sm text-gray-500">
              {description}
            </Switch.Description>
          )}
        </span>
      )}
      <Switch
        id={id}
        name={name}
        checked={checked}
        onChange={setChecked}
        disabled={disabled}
        className={clsx(
          { 'bg-primary-600': checked, 'bg-gray-200': !checked, 'ml-2': !!label },
          'relative inline-flex h-6 w-11 flex-shrink-0 enabled:cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50'
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
