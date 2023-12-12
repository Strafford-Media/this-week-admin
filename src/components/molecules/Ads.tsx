import React, { ComponentProps } from 'react'
import { Button } from '@8thday/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import ArrowLeft from '@heroicons/react/24/solid/ArrowLeftIcon'
import { NavLink } from 'react-router-dom'
import { AdList } from './AdList'

export interface AdsProps extends ComponentProps<'div'> {}

export const Ads = ({ className = '', ...props }: AdsProps) => {
  const m = useMatches()
  const atAdRoot = m.length === 2

  const goTo = useNavigate()
  return (
    <div className={`${className}`} {...props}>
      <div className="sticky top-0 flex w-full items-center justify-between p-2 shadow-md sm:px-4">
        {!atAdRoot && (
          <NavLink to="/ads" className="flex-center gap-2">
            <ArrowLeft className="h-5 w-5" /> All Ads
          </NavLink>
        )}
        <Button
          variant={!atAdRoot ? 'secondary' : 'primary'}
          PreIcon={PlusIcon}
          onClick={() => {
            goTo('/ads/create')
          }}
        >
          New Ad
        </Button>
      </div>
      {atAdRoot ? <AdList /> : <Outlet />}
    </div>
  )
}
