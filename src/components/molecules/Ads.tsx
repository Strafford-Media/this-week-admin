import React, { ComponentProps } from 'react'

export interface AdsProps extends ComponentProps<'div'> {}

export const Ads = ({ className = '', ...props }: AdsProps) => {
  return (
    <div className={`${className}`} {...props}>
      Coming Soon...
    </div>
  )
}
