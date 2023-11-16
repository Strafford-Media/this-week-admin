import React, { ComponentProps } from 'react'

export interface LoadingScreenProps extends ComponentProps<'div'> {}

export const LoadingScreen = ({ className = '', ...props }: LoadingScreenProps) => {
  return (
    <div className={`${className} flex-center min-h-screen animate-pulse`} {...props}>
      Loading...
    </div>
  )
}
