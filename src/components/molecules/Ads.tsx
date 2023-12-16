import React, { ComponentProps } from 'react'
import { Button, useClickLink } from '@8thday/react'
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Outlet, useMatches } from 'react-router-dom'
import ArrowLeft from '@heroicons/react/24/solid/ArrowLeftIcon'
import { NavLink } from 'react-router-dom'
import { AdList } from './AdList'

export interface AdsProps extends ComponentProps<'div'> {}

export const Ads = ({ className = '', ...props }: AdsProps) => {
  const m = useMatches()
  const atAdRoot = m.length === 2

  const goTo = useClickLink()
  return (
    <div className={`${className}`} {...props}>
      <div className="sticky top-0 flex w-full items-center gap-4 p-2 shadow-md sm:px-4">
        {!atAdRoot && (
          <NavLink to="/ads" className="flex-center gap-2">
            <ArrowLeft className="h-5 w-5" /> All Ads
          </NavLink>
        )}
        <Button variant="primary" PreIcon={CalendarDaysIcon} onClick={(e) => goTo('/ads/scheduler', e)}>
          Scheduler
        </Button>
        <Button PreIcon={PlusIcon} onClick={(e) => goTo('/ads/create', e)}>
          New Ad
        </Button>
      </div>
      {atAdRoot ? <AdList /> : <Outlet />}
    </div>
  )
}
