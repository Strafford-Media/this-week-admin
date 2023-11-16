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
      <div className="grid grid-cols-[250px,1fr] h-content max-h-content overflow-hidden transition-all duration-300">
        <div
          className={clsx(
            'transition-all overflow-y-auto duration-300 @container row-start-1 row-end-2 col-start-1 max-h-full',
            id ? 'bg-primary-50 col-end-2' : 'bg-white col-end-3 z-10'
          )}
        >
          <ul className="relative">
            <li
              className={clsx(
                'p-2 z-10 sticky top-0 shadow-md shadow-primary-50 flex',
                id ? 'bg-primary-50/80' : 'bg-white/80'
              )}
            >
              <Button
                className="@xs:mx-auto mx-0"
                PreIcon={PlusIcon}
                variant="primary"
                onClick={() => setOpenNewForm(true)}
              >
                New Listing
              </Button>
            </li>
            {data?.listing.map((listing, i, wholeList) => (
              <li key={listing.id} className={clsx(i !== 0 ? 'border-t border-primary-200' : '')}>
                <button
                  className="p-2 truncate w-full text-left @xs:w-auto hover:"
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
                        isLower ? 'exit-to-top' : 'exit-to-bottom'
                      )
                      document.documentElement.style.setProperty(
                        '--listing-enter-animation',
                        isLower ? 'enter-from-bottom' : 'enter-from-top'
                      )
                      ;(document as any).startViewTransition(() => goTo(`${listing.id}`))
                    }
                  }}
                >
                  <span>{listing.business_name}</span>
                  <span className="@xs:inline hidden ml-4 text-primary-600">
                    {listing.tier}/{capitalize(listing.island)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'transition-all duration-300 row-start-1 row-end-2 col-start-2 col-end-3',
            '[view-transition-name:listing-view]'
          )}
        >
          <Outlet />
        </div>
      </div>
      {openNewForm && <NewListingModal onClose={() => setOpenNewForm(false)} />}
    </div>
  )
}
