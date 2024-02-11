import React, { ComponentProps } from 'react'

export interface HomeProps extends ComponentProps<'div'> {}

export const Home = ({ className = '', ...props }: HomeProps) => {
  return (
    <div className={`${className} flex-center h-content flex-col p-4`} {...props}>
      <img
        className="max-w-2/3"
        src="https://lirp.cdn-website.com/0e650340/dms3rep/multi/opt/twhawaii-logo-1920w.png"
        alt="This Week Hawaii"
      />
      <h2 className="text-2xl text-primary-500 lg:text-4xl">Website Management</h2>
    </div>
  )
}
