import clsx from 'clsx'
import React, { ComponentProps } from 'react'

const sizes = {
  small: 'px-2.5 py-0.5 text-xs',
  medium: 'px-3 py-1 text-sm',
  large: 'px-3 py-1 text-base',
}

const colors = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-200 text-gray-800',
}

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'color'> {
  color?: keyof typeof colors
  size?: keyof typeof sizes
  shadow?: boolean
}

export const Badge = ({ className = '', color = 'primary', size = 'small', shadow = false, ...props }: BadgeProps) => {
  const colorClass = colors[color]
  const sizeClass = sizes[size]

  return (
    <span
      className={clsx(`inline-flex items-center rounded-full font-medium`, className, colorClass, sizeClass, {
        shadow,
      })}
      {...props}
    />
  )
}
