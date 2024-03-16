import clsx from 'clsx'
import React, { ComponentProps, forwardRef } from 'react'
import { IconType } from '../../utils/types'

const sizes = {
  3: { icon: 'w-3 h-3', button: 'w-5 h-5' },
  4: { icon: 'w-4 h-4', button: 'w-6 h-6' },
  5: { icon: 'w-5 h-5', button: 'w-8 h-8' },
  6: { icon: 'w-6 h-6', button: 'w-10 h-10' },
  8: { icon: 'w-8 h-8', button: 'w-12 h-12' },
  12: { icon: 'w-12 h-12', button: 'w-16 h-16' },
  16: { icon: 'w-16 h-16', button: 'w-20 h-20' },
}

export interface IconButtonProps extends ComponentProps<'button'> {
  iconClass?: string
  icon: IconType
  srLabel: string
  size?: keyof typeof sizes
  colorClass?: string
  spin?: boolean
  refByState?: (elRef: HTMLButtonElement | null) => void
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className = '',
      srLabel,
      spin = false,
      icon: Icon,
      size = 5,
      iconClass = '',
      colorClass = 'text-gray-400 enabled:hover:text-primary-500 focus:text-gray-600',
      refByState,
      ...props
    },
    ref,
  ) => {
    const sizeClass = sizes[size]

    return (
      <button
        className={clsx(
          className,
          sizeClass.button,
          colorClass,
          `inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`,
        )}
        {...props}
        ref={ref || refByState}
      >
        <span className="sr-only">{srLabel}</span>
        <Icon className={clsx(sizeClass.icon, iconClass, { 'animate-spin': spin })} aria-hidden="true" />
      </button>
    )
  },
)
