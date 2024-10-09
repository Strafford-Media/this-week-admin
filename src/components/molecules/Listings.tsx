import { useAuthQuery, useAuthSubscription } from '@nhost/react-apollo'
import React, { ComponentProps, Fragment, useMemo, useState } from 'react'
import { ALL_LISTINGS_SUB, SEARCH_LISTINGS } from '../../graphql/queries'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, TextInput, Toggle, toast, useInterval, useRememberedState } from '@8thday/react'
import clsx from 'clsx'
import { NewListingModal } from './NewListingModal'
import { DocumentPlusIcon, TagIcon } from '@heroicons/react/24/outline'
import { addHour, addMinute } from '@formkit/tempo'
import { useNhostClient } from '@nhost/react'

export interface ListingsProps extends ComponentProps<'div'> {}

export const Listings = ({ className = '', ...props }: ListingsProps) => {
  const nhost = useNhostClient()
  const { id: rawParamsId } = useParams()
  const id = Number(rawParamsId)

  const [openNewListingForm, setOpenNewListingForm] = useState(false)
  const setSearchParams = useSearchParams()[1]

  const { data } = useAuthSubscription(ALL_LISTINGS_SUB)

  const [searchTerm, setSearchTerm] = useState('')
  const [includeNonLive, setIncludeNonLive] = useState(false)

  const { data: searchData } = useAuthQuery(SEARCH_LISTINGS, {
    variables: { searchTerm, limit: 20, includeNonLive },
    skip: searchTerm.length < 6,
  })

  const goTo = useNavigate()

  const [lastRevalidated, setLastRevalidated] = useRememberedState('this-week-last-revalidated', 0)

  const canRevalidate = useMemo(() => {
    return (
      data?.listing.some((l) => new Date(l.updated_at).valueOf() > addHour(new Date(), -2).valueOf()) &&
      lastRevalidated < addMinute(new Date(), -3).valueOf()
    )
  }, [data, lastRevalidated])

  useInterval(
    () => {
      setLastRevalidated((l) => l - 1)
    },
    canRevalidate ? 0 : 60 * 1000,
  )

  const filteredListings = useMemo(() => {
    if (!searchTerm) return data?.listing ?? []

    const lowSearch = searchTerm.toLowerCase()

    const basicSearchResults = (data?.listing ?? []).filter((l) => l.business_name.toLowerCase().includes(lowSearch))

    if (!basicSearchResults.length && searchData?.fuzzy_search_listings.length) {
      const listingMap = (data?.listing ?? []).reduce((map, item) => ({ ...map, [item.id]: item }), {})

      return searchData.fuzzy_search_listings.map((f) => listingMap[f.id])
    }

    return basicSearchResults
  }, [searchData, data, searchTerm])

  return (
    <div className={`${className}`} {...props}>
      <div className="grid h-contentD max-h-contentD grid-cols-[250px,1fr] overflow-hidden transition-all duration-300">
        <div
          className={clsx(
            'col-start-1 row-start-1 row-end-2 max-h-full overflow-y-auto pb-16 transition-all duration-300 @container',
            id ? 'col-end-2 bg-secondary-50' : 'z-10 col-end-3 bg-white',
          )}
        >
          <ul className={clsx('relative grid grid-cols-auto-7 gap-2')}>
            <li
              className={clsx(
                'sticky top-0 z-10 col-span-7 flex flex-wrap gap-2 p-2 shadow-md shadow-primary-50',
                id ? 'bg-secondary-50/80' : 'bg-white/80',
              )}
            >
              <Button
                PreIcon={TagIcon}
                variant="secondary"
                onClick={() => {
                  setSearchParams((s) => (s.set('manage-categories', '1'), s))
                }}
              >
                Manage Categories
              </Button>
              <Button PreIcon={DocumentPlusIcon} variant="primary" onClick={() => setOpenNewListingForm(true)}>
                New Listing
              </Button>
              <TextInput
                placeholder="Search Listings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                collapseDescriptionArea
              />
              <Toggle
                className="m-1"
                rightLabel="Include Drafts"
                checked={includeNonLive}
                setChecked={setIncludeNonLive}
              />
              {canRevalidate && (
                <Button
                  variant="dismissive"
                  onClick={async () => {
                    const res = await nhost.functions.call('duda-revalidate')
                    if (res.error) {
                      return toast.error({ message: 'Unable to Refresh Web Cache', description: res.error.message })
                    }
                    toast.success({
                      message: 'Web Cache Refreshed!',
                      description: 'All listing updates will be live within 3 minutes.',
                    })
                    setLastRevalidated(new Date().valueOf())
                  }}
                >
                  Refresh Web Cache
                </Button>
              )}
            </li>
            {filteredListings.map((listing, i, wholeList) => (
              <li
                key={listing.id}
                className={clsx(
                  'col-span-7 grid cursor-pointer grid-cols-sub items-center p-2 text-left hover:opacity-70',
                  { 'border-t border-secondary-800/50': i !== 0, 'text-primary-500': listing.id === id },
                )}
                role="navigation"
                tabIndex={0}
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
                <span className="col-span-6 w-full truncate @md:col-span-1 @md:w-auto">{listing.business_name}</span>
                <span className={clsx('hidden @sm:inline', listing.live ? 'text-green-600' : 'text-gray-500')}>
                  {listing.live ? 'Live' : 'Draft'}
                </span>
                <span className="hidden capitalize text-gray-500 @sm:inline">
                  {listing.island?.split('|').map((isle, isleIndex) => (
                    <Fragment key={isle}>
                      {isleIndex !== 0 && ' | '}
                      <span
                        className={clsx({
                          'text-rose-600': isle === 'hawaii',
                          'text-pink-600': isle === 'maui',
                          'text-fuchsia-600': isle === 'kauai',
                          'text-yellow-500': isle === 'oahu',
                        })}
                      >
                        {isle}
                      </span>
                    </Fragment>
                  ))}
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
          <Outlet key={id} />
        </div>
      </div>
      {openNewListingForm && <NewListingModal onClose={() => setOpenNewListingForm(false)} />}
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
