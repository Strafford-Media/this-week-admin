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

  const inScheduler = m.some((m) => m.pathname.includes('scheduler'))
  const inCreate = m.some((m) => m.pathname.includes('ads/create'))
  const inDesign = m.some((m) => m.pathname.includes('ads/manage'))
  const adId = m.find((m) => m.params.adId)?.params.adId

  const goTo = useClickLink()

  return (
    <div className={`${className}`} {...props}>
      <div className="sticky top-0 z-10 flex w-full items-center justify-between gap-4 bg-white p-2 shadow-md sm:justify-start sm:px-4">
        {!atAdRoot && (
          <NavLink to="/ads" className="flex-center gap-2">
            <ArrowLeft className="h-5 w-5" /> All Ads
          </NavLink>
        )}
        {!inScheduler && (
          <Button
            variant="primary"
            PreIcon={CalendarDaysIcon}
            onClick={(e) => goTo(`/ads/scheduler${inDesign && adId ? `/${adId}` : ''}`, e)}
          >
            Scheduler
          </Button>
        )}
        {!inCreate && (
          <Button PreIcon={PlusIcon} onClick={(e) => goTo('/ads/create', e)}>
            New Ad
          </Button>
        )}
      </div>
      {atAdRoot ? <AdList /> : <Outlet />}
    </div>
  )
}
