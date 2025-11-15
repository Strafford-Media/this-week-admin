import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps, Fragment, useMemo, useState } from 'react'
import { ALL_LISTINGS_SUB, SEARCH_LISTINGS } from '../../graphql/queries'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, TextInput, Toggle, toast, useInterval, useRememberedState } from '@8thday/react'
import clsx from 'clsx'
import { NewListingModal } from './NewListingModal'
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  DocumentPlusIcon,
  ShieldCheckIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { ArrowDownIcon } from '@heroicons/react/16/solid'
import { addHour, addMinute } from '@formkit/tempo'
import { useNhostClient } from '@nhost/react'
import { AllListingsSubscription, Listing_Order_By, Order_By } from '../../gql/graphql'
import { useNoFlickerSub } from '../../hooks/useNoFlickerSub'

const sortOrderClasses = ['opacity-100', 'opacity-80', 'opacity-60', 'opacity-40', 'opacity-20']

export interface ListingsProps extends ComponentProps<'div'> {}

export const Listings = ({ className = '', ...props }: ListingsProps) => {
  const nhost = useNhostClient()
  const { id: rawParamsId } = useParams()
  const id = Number(rawParamsId)

  const [openNewListingForm, setOpenNewListingForm] = useState(false)
  const setSearchParams = useSearchParams()[1]

  const [searchTerm, setSearchTerm] = useState('')
  const [includeNonLive, setIncludeNonLive] = useState(false)

  const [orderBy, setOrderBy] = useState<Listing_Order_By[]>([{ business_name: Order_By.Asc }])
  const { data } = useNoFlickerSub(ALL_LISTINGS_SUB, {
    variables: {
      orderBy,
      where: { live: includeNonLive ? { _is_null: false } : { _eq: true } },
    },
  })

  const sortedFields = orderBy.reduce((map, item) => ({ ...map, ...item }), {})
  const sortedFieldOrder = orderBy.reduce<Record<string, number>>(
    (map, item, index) => ({ ...map, ...Object.keys(item).reduce((m, k) => ({ [k]: index }), {}) }),
    {},
  )

  const sort = (field: keyof Listing_Order_By, dir: Order_By | null) => {
    setOrderBy((obs) => {
      const oldObs = obs.filter((ob) => !ob[field])

      return dir ? [{ [field]: dir }, ...oldObs] : oldObs
    })
  }

  const onSortClick = (field: keyof Listing_Order_By) => {
    switch (sortedFields[field]) {
      case Order_By.Asc:
        return sort(field, Order_By.Desc)
      case Order_By.Desc:
        return sort(field, null)
      default:
        return sort(field, Order_By.Asc)
    }
  }

  const { data: searchData } = useAuthQuery(SEARCH_LISTINGS, {
    variables: { searchTerm, limit: 20, includeNonLive },
    skip: searchTerm.length < 4,
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
      const listingMap = (data?.listing ?? []).reduce<Record<number, AllListingsSubscription['listing'][number]>>(
        (map, item) => ({ ...map, [item.id]: item }),
        {},
      )

      return searchData.fuzzy_search_listings.map((f) => listingMap[f.id]).filter(Boolean)
    }

    return basicSearchResults
  }, [searchData, data, searchTerm])

  return (
    <div className={`${className}`} {...props}>
      <div className="grid h-contentD max-h-contentD grid-cols-[300px,1fr] overflow-hidden transition-all duration-300">
        <div
          className={clsx(
            'col-start-1 row-start-1 row-end-2 max-h-full overflow-y-auto pb-16 transition-all duration-300 @container',
            id ? 'col-end-2 bg-secondary-50' : 'z-10 col-end-3 bg-white',
          )}
        >
          <ul className={clsx('relative grid grid-cols-auto-9 gap-x-2')}>
            {filteredListings.map((listing, i, wholeList) => (
              <li
                key={listing.id}
                className={clsx(
                  'col-span-full grid cursor-pointer grid-cols-sub items-center p-2 text-left hover:opacity-70',
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
                <span className="flex-center">
                  {listing.promoted && <CheckBadgeIcon className="h-5 w-5 text-green-500" />}
                </span>
                <span className="flex-center text-lg">{listing.is_island_original && '✨'}</span>
                <span className="flex-center">
                  {listing.this_week_recommended && <ShieldCheckIcon className="h-5 w-5 text-green-500" />}
                </span>
                <span className="hidden text-gray-500 @md:inline">{displayDate(listing.created_at)}</span>
                <span className="hidden text-gray-500 @md:inline">{displayDate(listing.updated_at)}</span>
              </li>
            ))}
            <li
              className={clsx(
                'sticky top-0 col-span-full row-start-1 flex flex-wrap gap-2 p-2',
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
            <li
              className={clsx(
                'sticky top-14 col-span-full row-start-2 grid grid-cols-sub items-center bg-white/80 p-2 text-gray-600 shadow-md shadow-primary-50',
                id ? 'invisible max-h-0' : 'visible max-h-8',
              )}
            >
              <button className="flex items-center" onClick={() => onSortClick('business_name')}>
                Business Name
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['business_name'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['business_name']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('live')}>
                Status
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['live'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['live']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('island')}>
                Islands
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['island'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['island']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('tier')}>
                Plan Tier
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['tier'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['tier']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('promoted')}>
                Promoted
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['promoted'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['promoted']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('is_island_original')}>
                Original
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['is_island_original'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['is_island_original']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('this_week_recommended')}>
                Recommended
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['this_week_recommended'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['this_week_recommended']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('created_at')}>
                Created
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['created_at'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['created_at']],
                  )}
                />
              </button>
              <button className="flex items-center" onClick={() => onSortClick('updated_at')}>
                Updated
                <ArrowDownIcon
                  className={clsx(
                    'ml-2 inline-block h-4 w-4 opacity-0',
                    sortedFields['updated_at'] === Order_By.Asc && 'rotate-180',
                    sortOrderClasses[sortedFieldOrder['updated_at']],
                  )}
                />
              </button>
            </li>
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
const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
const yesterdayDate = yesterday.toISOString().split('T')[0]
const thisYear = today.getFullYear()
const thisMonth = today.getMonth()
const thisDay = today.getDate()
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function displayDate(date: string) {
  const d = new Date(date)

  const year = d.getFullYear()
  const isThisYear = thisYear === year

  const month = d.getMonth()
  const isThisMonth = isThisYear && thisMonth === month

  const day = d.getDate()
  const isToday = isThisMonth && thisDay === day

  const isYesterday = d.toISOString().startsWith(yesterdayDate)

  if (isToday) {
    return `Today at ${d.toLocaleTimeString(undefined, { timeStyle: 'medium' })}`
  }

  if (isYesterday) {
    return `Yesterday at ${d.toLocaleTimeString(undefined, { timeStyle: 'medium' })}`
  }

  return `${months[month]} ${day}${isThisYear ? '' : `, ${year}`}`
}
