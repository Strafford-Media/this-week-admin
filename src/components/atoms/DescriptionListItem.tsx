import React, { ComponentProps } from 'react'

export interface DescriptionListItemProps extends ComponentProps<'div'> {
  label: string
}

export const DescriptionListItem = ({ className = '', children, label, ...props }: DescriptionListItemProps) => {
  return (
    <div className={`${className}`} {...props}>
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  )
}
