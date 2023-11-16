import React, { ComponentProps } from 'react'

export interface HomeProps extends ComponentProps<'div'> {}

export const Home = ({ className = '', ...props }: HomeProps) => {
  return (
    <div className={`${className}`} {...props}>
      This Week Hawaii Website Admin Dashboard
    </div>
  )
}
