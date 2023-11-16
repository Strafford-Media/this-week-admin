import clsx from 'clsx'
import React, { ComponentProps } from 'react'

export interface CompanyNameProps extends ComponentProps<'p'> {
  sizeClass?: string
  colorClass?: string
}

export const CompanyName = ({
  className = '',
  colorClass = 'text-primary-300',
  sizeClass = 'text-xl',
  ...props
}: CompanyNameProps) => {
  return (
    <p className={clsx(className, sizeClass, colorClass, 'font-bold')} {...props}>
      <span className="text-[1.2em]">P</span>RIME <span className="text-[1.2em]">S</span>IGHTS
    </p>
  )
}
