import { useAuthSubscription } from '@nhost/react-apollo'
import React, { ComponentProps, useState } from 'react'
import { ALL_LISTINGS_SUB } from '../../graphql/queries'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { capitalize } from '../../utils/general'
import { Button } from '@8thday/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { NewListingModal } from './NewListingModal'

export interface ListingsProps extends ComponentProps<'div'> {}

export const Listings = ({ className = '', ...props }: ListingsProps) => {
  const { id: rawParamsId } = useParams()
  const id = Number(rawParamsId)

  const [openNewForm, setOpenNewForm] = useState(false)

  const { data } = useAuthSubscription(ALL_LISTINGS_SUB)

  const goTo = useNavigate()

  return (
    <div className={`${className}`} {...props}>
      <div className="grid h-content max-h-content grid-cols-[250px,1fr] overflow-hidden transition-all duration-300">
        <div
          className={clsx(
            'col-start-1 row-start-1 row-end-2 max-h-full overflow-y-auto transition-all duration-300 @container',
            id ? 'col-end-2 bg-primary-50' : 'z-10 col-end-3 bg-white',
          )}
        >
          <ul className={clsx('grid-cols-auto-5 relative grid gap-2')}>
            <li
              className={clsx(
                'sticky top-0 z-10 col-span-5 flex p-2 shadow-md shadow-primary-50',
                id ? 'bg-primary-50/80' : 'bg-white/80',
              )}
            >
              <Button
                className="mx-0 @md:mx-auto"
                PreIcon={PlusIcon}
                variant="primary"
                onClick={() => setOpenNewForm(true)}
              >
                New Listing
              </Button>
            </li>
            {data?.listing.map((listing, i, wholeList) => (
              <li
                key={listing.id}
                className={clsx(
                  'col-span-5 grid cursor-pointer grid-cols-sub items-center p-2 text-left hover:opacity-70',
                  i !== 0 ? 'border-t border-primary-200' : '',
                )}
                role="navigation"
                onClick={(e) => {
                  if (id === listing.id) return

                  if (e.metaKey) {
                    window.open(`${location.origin}/listings/${listing.id}`, '_blank', 'noreferrer noopener')
                  } else if (!('startViewTransition' in document)) {
                    goTo(`${listing.id}`)
                  } else if (!id || isNaN(id)) {
                    // set the animation direction
                    document.documentElement.style.setProperty('--listing-exit-animation', 'exit-to-right')
                    document.documentElement.style.setProperty('--listing-enter-animation', 'enter-from-right')
                    ;(document as any).startViewTransition(() => goTo(`${listing.id}`))
                  } else {
                    const currentIndex = wholeList.findIndex((l) => l.id === id)
                    const isLower = i > currentIndex

                    // set the animation direction
                    document.documentElement.style.setProperty(
                      '--listing-exit-animation',
                      isLower ? 'exit-to-top' : 'exit-to-bottom',
                    )
                    document.documentElement.style.setProperty(
                      '--listing-enter-animation',
                      isLower ? 'enter-from-bottom' : 'enter-from-top',
                    )
                    ;(document as any).startViewTransition(() => goTo(`${listing.id}`))
                  }
                }}
              >
                <span className="col-span-5 w-full truncate @md:col-span-1 @md:w-auto">{listing.business_name}</span>
                <span
                  className={clsx('hidden capitalize @sm:inline', {
                    'text-rose-600': listing.island === 'hawaii',
                    'text-pink-600': listing.island === 'maui',
                    'text-fuchsia-600': listing.island === 'kauai',
                    'text-yellow-500': listing.island === 'oahu',
                  })}
                >
                  {listing.island}
                </span>
                <span
                  className={clsx('hidden capitalize @sm:inline', {
                    'text-sky-400': listing.tier === 'basic',
                    'text-lime-600': listing.tier === 'standard',
                    'text-yellow-500': listing.tier === 'premium',
                  })}
                >
                  {listing.tier}
                </span>
                <span className="hidden text-gray-500 @md:inline">
                  <span className="text-xs text-gray-400">Created:</span> {displayDate(listing.created_at)}
                </span>
                <span className="hidden text-gray-500 @md:inline">
                  <span className="text-xs text-gray-400">Last Updated:</span> {displayDate(listing.updated_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'col-start-2 col-end-3 row-start-1 row-end-2 transition-all duration-300',
            '[view-transition-name:listing-view]',
          )}
        >
          <Outlet />
        </div>
      </div>
      {openNewForm && <NewListingModal onClose={() => setOpenNewForm(false)} />}
    </div>
  )
}

const today = new Date()
const thisYear = today.getFullYear()
const thisMonth = today.getMonth()
const thisDay = today.getDate()
const thisWeekDay = today.getDay()
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function displayDate(date: string) {
  const d = new Date(date)

  const year = d.getFullYear()
  const isThisYear = thisYear === year

  const month = d.getMonth()
  const isThisMonth = isThisYear && thisMonth === month

  const day = d.getDate()
  const isToday = isThisMonth && thisDay === day

  const isYesterday = !isToday && (d.getDay() + 1) % 7 === thisWeekDay

  if (isToday) {
    return `Today at ${d.toLocaleTimeString()}`
  }

  if (isYesterday) {
    return `Yesterday at ${d.toLocaleTimeString()}`
  }

  return `${months[month]} ${day}${isThisYear ? '' : `, ${year}`}`
}
