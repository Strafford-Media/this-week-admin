import React, { ComponentProps, Fragment, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuthQuery } from '@nhost/react-apollo'
import { LISTING_BY_ID } from '../../graphql/queries'
import { LoadingScreen } from './LoadingScreen'
import { Button, Checkbox, Modal, Select, TextArea, TextInput, Toggle, toast } from '@8thday/react'
import { ArrowPathIcon, TagIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CameraIcon, StarIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useNhostClient } from '@nhost/react'
import {
  CREATE_CATEGORY_LISTINGS,
  DELETE_CATEGORY_LISTING_BY_ID,
  DELETE_LISTING,
  UPDATE_LISTING,
} from '../../graphql/mutations'
import { ListingByIdSubQuery } from '../../gql/graphql'
import { useMutation } from '@apollo/client'
import { ImageUploader } from './ImageUploader'
import { graphql } from '../../gql'
import clsx from 'clsx'
import { useCategoryTags } from '../../hooks/useCategoryTags'
import { SocialAccounts } from './SocialAccounts'
import { CreateBookingLink } from './CreateBookingLink'
import { BusinessHours } from './BusinessHours'
import { VideoPlayer } from './VideoPlayer'

interface BookingLink {
  type: 'fareharbor-item' | 'fareharbor-grid' | 'external'
  label: string
  description: string
  title: string
  shortname: string
  item: string
  sheet: string
  asn: string
  'asn-ref': string
  'full-item': boolean
  flow: string
  branding: boolean
  'bookable-only': boolean
  script: string
  href: string
}

const tiers = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'basic', label: 'Basic' },
]

const islands = ['hawaii', 'maui', 'oahu', 'kauai']

export interface ListingProps extends ComponentProps<'div'> {}

export const Listing = ({ className = '', ...props }: ListingProps) => {
  const nhost = useNhostClient()

  const { tags, tagMap } = useCategoryTags()

  const setSearchParams = useSearchParams()[1]

  const { id: idFromParams } = useParams()
  const id = Number(idFromParams)

  const goTo = useNavigate()

  const [fixable, setFixable] = useState({})
  const [erroredImg, setErroredImg] = useState({})

  const [openCreateBookingModal, setOpenCreateBookingModal] = useState(false)

  const [newVidUrl, setNewVidUrl] = useState('')
  const [listing, setListing] = useState<NonNullable<ListingByIdSubQuery['listing_by_pk']>>({
    slogan: '',
    description: '',
    business_name: '',
    live: false,
    tier: 'basic',
    island: '',
    id,
    created_at: '',
    listing_category_tags: [],
    updated_at: '',
    this_week_recommended: false,
    social_media: {},
    business_hours: {},
    images: [],
    videos: [],
    booking_links: [],
    layout_data: {},
    lat_lng: '',
  })

  const {
    data,
    refetch,
    error,
    called,
    loading: fetchLoading,
  } = useAuthQuery(LISTING_BY_ID, {
    variables: { id },
    skip: !id || isNaN(id),
    onCompleted({ listing_by_pk }) {
      if (listing_by_pk) {
        setListing(listing_by_pk)
      }
    },
  })

  const refreshListingData = () => {
    refetch().then(({ data }) => {
      if (data.listing_by_pk) {
        setListing(data.listing_by_pk)
      }
    })
  }

  const [updateListing, { loading: saveLoading }] = useMutation(UPDATE_LISTING)

  const update = async (key: string, value: any, shouldRefresh = true) => {
    if (data?.listing_by_pk?.[key] === value) return

    const res = await updateListing({ variables: { id, set: { [key]: value } } }).catch((err) =>
      err instanceof Error ? err : new Error(JSON.stringify(err)),
    )

    if (res instanceof Error) {
      return toast.error({
        message: "Couldn't save.",
        description: res.message,
        duration: 1000,
      })
    }

    shouldRefresh && refreshListingData()
  }

  const updateLayoutData = async (key: string, value: any) => {
    const res = await nhost.graphql
      .request(
        graphql(`
          mutation updateLayoutData($id: Int!, $layoutData: jsonb!) {
            update_listing_by_pk(pk_columns: { id: $id }, _append: { layout_data: $layoutData }) {
              id
            }
          }
        `),
        { id, layoutData: { [key]: value } },
      )
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      return toast.error({
        message: "Couldn't save.",
        description: res.message,
      })
    }

    refreshListingData()
  }

  const updateImmediately = async (key: string, value: any) => {
    if (!key || typeof value === 'undefined') return

    setListing((l) => ({ ...l, [key]: value }))

    update(key, value)
  }

  const timeoutIdRef = useRef(0)
  const setAndDebounceUpdate = (key: string, value: any) => {
    if (!key || typeof value === 'undefined') return

    setListing((l) => ({ ...l, [key]: value }))

    clearTimeout(timeoutIdRef.current)
    timeoutIdRef.current = window.setTimeout(() => {
      update(key, value, false)
    }, 400)
  }

  const tagOptions = useMemo(() => {
    return tags
      .filter((t) => listing.listing_category_tags.every((c) => c.category_tag_id !== t.id))
      .map((t) => ({ value: `${t.id}`, label: t.label }))
  }, [tags, listing?.listing_category_tags])

  const bookingLinkValidation = useMemo(() => {
    return (listing?.booking_links ?? []).map((bl: BookingLink) => !!bl.shortname && !!bl.item && !!bl.label)
  }, [listing?.booking_links])

  const [openBookingLink, setOpenBookingLink] = useState(-1)

  if (called && !fetchLoading && !error && !data?.listing_by_pk) {
    goTo('..')
  }

  return (
    <div className={`${className} h-full max-h-content overflow-y-auto px-4 pb-8 shadow-inner`} {...props}>
      {!listing ? (
        <LoadingScreen className="!h-full !min-h-0" />
      ) : (
        <>
          <div className="sticky top-0 z-10 -mx-4 flex min-h-8 p-4 backdrop-blur-sm">
            <button
              className="mr-auto"
              role="navigation"
              onClick={(e) => {
                if (e.metaKey) {
                  window.open(`${location.origin}/listings`, '_blank', 'noreferrer noopener')
                } else if (!('startViewTransition' in document)) {
                  goTo(`..`)
                } else {
                  // set the animation direction
                  document.documentElement.style.setProperty('--listing-exit-animation', 'exit-to-right')
                  document.documentElement.style.setProperty('--listing-enter-animation', 'enter-from-right')
                  ;(document as any).startViewTransition(() => goTo(`..`))
                }
              }}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            {(fetchLoading || saveLoading) && <ArrowPathIcon className="h-5 w-5 animate-spin" />}
          </div>
          <div className="max-w-3xl space-y-4 @container">
            <TextInput
              collapseDescriptionArea
              label="Business Name"
              value={listing.business_name}
              onChange={(e) => setAndDebounceUpdate('business_name', e.target.value)}
            />
            <Select
              collapseDescriptionArea
              label="Tier"
              value={listing.tier}
              onValueChange={(v) => updateImmediately('tier', v)}
              items={tiers}
            />
            <div className="grid grid-cols-2 gap-4 @md:grid-cols-4">
              <label className="col-span-full">Island(s)</label>
              {islands.map((isle) => (
                <Checkbox
                  checked={(listing.island || '').includes(isle)}
                  setChecked={(c) => {
                    updateImmediately(
                      'island',
                      islands.filter((is) => (is === isle ? c : listing.island?.includes(is))).join('|'),
                    )
                  }}
                  label={isle}
                  labelClass="capitalize"
                />
              ))}
            </div>
            <Toggle
              className="!flex"
              checked={listing.live}
              setChecked={(c) => updateImmediately('live', c)}
              rightLabel="Live"
              rightDescription="Show this listing to the public"
            />
            <Toggle
              className="!flex"
              checked={listing.this_week_recommended}
              setChecked={(c) => updateImmediately('this_week_recommended', c)}
              rightLabel="This Week Recommended"
              rightDescription="Publicly recommend this listing"
            />
            <SocialAccounts
              socialAccounts={listing.social_media}
              setSocialAccounts={(sa) => setAndDebounceUpdate('social_media', sa)}
            />
            {tags.length ? (
              <div>
                <label className="block w-full">Category Tags</label>
                <ul className="flex flex-wrap gap-2 py-2">
                  {listing.listing_category_tags.map(
                    (lct) =>
                      tagMap[lct.category_tag_id] && (
                        <li
                          className="cursor-pointer rounded-full bg-primary-500 px-2 py-0.5 text-sm capitalize text-white"
                          key={lct.id}
                          onClick={async () => {
                            const res = await nhost.graphql
                              .request(DELETE_CATEGORY_LISTING_BY_ID, { id: lct.id })
                              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                            if (res instanceof Error || res.error) {
                              return toast.error({ message: 'Unable to remove this tag' })
                            }

                            refetch().then(({ data }) => {
                              if (data.listing_by_pk) {
                                setListing(data.listing_by_pk)
                              }
                            })
                          }}
                        >
                          {tagMap[lct.category_tag_id].label}
                        </li>
                      ),
                  )}
                </ul>
                <div className="flex items-center">
                  <Select
                    className="inline-block"
                    placeholder="Add a Category Tag"
                    collapseDescriptionArea
                    items={tagOptions}
                    value=""
                    onValueChange={async (t) => {
                      const ctId = Number(t)

                      if (!ctId) return

                      const res = await nhost.graphql
                        .request(CREATE_CATEGORY_LISTINGS, {
                          objects: [{ listing_id: id, category_tag_id: ctId }],
                        })
                        .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                      if (res instanceof Error || res.error) {
                        console.error(res)
                        return toast.error({
                          message: `There was an error adding the tag`,
                          description: `please try again`,
                        })
                      }

                      refetch().then(({ data }) => {
                        if (data.listing_by_pk) {
                          setListing(data.listing_by_pk)
                        }
                      })
                    }}
                  ></Select>
                  <Button
                    PreIcon={TagIcon}
                    className="ml-4"
                    onClick={() => {
                      setSearchParams((s) => (s.set('manage-categories', '1'), s))
                    }}
                  >
                    Manage Categories
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setSearchParams((s) => (s.set('manage-categories', '1'), s))
                }}
              >
                Configure Category Tags
              </Button>
            )}
            <div className="relative min-h-40 min-w-64">
              <label>Logo</label>
              {listing.layout_data.logo && (
                <img src={listing.layout_data.logo} alt="Company Logo" className="absolute inset-0 h-full" />
              )}
              <ImageUploader
                contentLabel="Logo"
                type="logo"
                className={clsx('absolute inset-0 mt-8 h-32 w-64', {
                  'opacity-100': !listing.layout_data.logo,
                  'opacity-0 focus-within:opacity-95 hover:opacity-95': listing.layout_data.logo,
                })}
                entityId={id}
                onSuccess={() => {
                  refetch().then(({ data }) => {
                    if (data.listing_by_pk) {
                      setListing(data.listing_by_pk)
                    }
                  })
                }}
              />
            </div>
            <TextInput
              collapseDescriptionArea
              label="Short Slogan"
              value={listing.slogan ?? ''}
              onChange={(e) => setAndDebounceUpdate('slogan', e.target.value)}
            />
            <TextArea
              collapseDescriptionArea
              label="Description"
              value={listing.description ?? ''}
              onChange={(e) => setAndDebounceUpdate('description', e.target.value)}
            />
            <div className="mb-6">
              <label className="mb-4">Booking Links</label>
              <ul className="flex flex-wrap gap-2">
                {listing.booking_links?.map((bl: BookingLink, i: number) => (
                  <li key={i} tabIndex={0} onClick={(e) => setOpenBookingLink(i)}>
                    <div className="flex w-full max-w-80 cursor-pointer flex-col items-center gap-4 rounded-md border border-gray-300 p-4 shadow-md">
                      {bl.type === 'fareharbor-grid' ? (
                        <>
                          <h4>Fareharbor Grid</h4>
                          <p>Flow ID: {getFlowFromScript(bl.script)}</p>
                        </>
                      ) : (
                        <>
                          {bl.title && <h4 className="text-center">{bl.title}</h4>}
                          {bl.description && (
                            <div className="text-justify">
                              {bl.description.split('\n').map((text, i) => (
                                <Fragment key={i}>
                                  {i !== 0 && <br />}
                                  {text}
                                </Fragment>
                              ))}
                            </div>
                          )}
                          {bl.label && (
                            <Button disabled={!bl.href && !bl.shortname} tabIndex={-1} variant="primary">
                              {bl.label}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                    {openBookingLink === i && (
                      <Modal portal onClose={() => setOpenBookingLink(-1)} className="w-2xl">
                        <div className="flex w-2xl max-w-full flex-col gap-y-3">
                          <h3 className="mb-4">
                            {bl.type === 'external'
                              ? 'External Booking Link'
                              : bl.type === 'fareharbor-item'
                                ? 'Single Fareharbor Item'
                                : 'Fareharbor Grid'}
                          </h3>
                          {bl.type !== 'fareharbor-grid' && (
                            <>
                              <TextInput
                                value={bl.title}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'title', e.target.value),
                                  )
                                }
                                label="Link Heading"
                                collapseDescriptionArea
                              />
                              <TextArea
                                value={bl.description}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'description', e.target.value),
                                  )
                                }
                                label="Link Description"
                                collapseDescriptionArea
                              />
                              <TextInput
                                value={bl.label}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'label', e.target.value),
                                  )
                                }
                                label="Button Label"
                                collapseDescriptionArea
                                required
                              />
                            </>
                          )}
                          {bl.type === 'fareharbor-grid' && (
                            <TextArea
                              className="mb-4"
                              label="Fareharbor Script"
                              description="Paste the code provided in the Fareharbor dashboard for a grid of items."
                              value={bl.script}
                              onChange={(e) =>
                                setAndDebounceUpdate(
                                  'booking_links',
                                  updateBookingLinks(listing.booking_links, i, 'script', e.target.value),
                                )
                              }
                              required
                            />
                          )}
                          {bl.type === 'external' && (
                            <TextInput
                              label="Link URL"
                              value={bl.href}
                              onChange={(e) =>
                                setAndDebounceUpdate(
                                  'booking_links',
                                  updateBookingLinks(listing.booking_links, i, 'href', e.target.value),
                                )
                              }
                              required
                            />
                          )}
                          {bl.type === 'fareharbor-item' && (
                            <>
                              <hr className="my-8" />
                              <h3 className="font-normal">Advanced Options</h3>
                              <TextInput
                                value={bl.shortname}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'shortname', e.target.value),
                                  )
                                }
                                label="Company shortname"
                                description="Fareharbor customer identifier"
                                required
                              />
                              <TextInput
                                value={bl.item}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'item', e.target.value),
                                  )
                                }
                                label="Item ID"
                                placeholder="usually a 3-6 digit number"
                                collapseDescriptionArea
                                required
                              />
                              <Toggle
                                rightLabel="Full Item"
                                rightDescription="Include item description and images"
                                checked={bl['full-item']}
                                setChecked={(c) => {
                                  updateImmediately(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'full-item', c),
                                  )
                                }}
                              />
                              <TextInput
                                value={bl.sheet}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'sheet', e.target.value),
                                  )
                                }
                                label="Pricing Sheet ID"
                                placeholder="usually a 3-6 digit number"
                                collapseDescriptionArea
                              />
                              <TextInput
                                label="ASN"
                                value={bl.asn}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'asn', e.target.value),
                                  )
                                }
                                collapseDescriptionArea
                              />
                              <TextInput
                                label="asn-ref"
                                value={bl['asn-ref']}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'asn-ref', e.target.value),
                                  )
                                }
                                collapseDescriptionArea
                              />
                              <TextInput
                                value={bl.flow}
                                onChange={(e) =>
                                  setAndDebounceUpdate(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'flow', e.target.value),
                                  )
                                }
                                label="Flow ID"
                                description="Specify a defined sales flow (leave empty for defaults)"
                              />
                              <Toggle
                                rightLabel="Branding"
                                checked={bl.branding}
                                setChecked={(c) => {
                                  updateImmediately(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'branding', c),
                                  )
                                }}
                              />
                              <Toggle
                                rightLabel="Bookable Only"
                                rightDescription="Hide closed and call to book availabilities"
                                checked={bl['bookable-only']}
                                setChecked={(c) => {
                                  updateImmediately(
                                    'booking_links',
                                    updateBookingLinks(listing.booking_links, i, 'bookable-only', c),
                                  )
                                }}
                              />
                            </>
                          )}
                          <hr className="my-6" />
                          <Button
                            className="self-start"
                            PreIcon={TrashIcon}
                            variant="destructive"
                            onClick={() => {
                              if (confirm('Deleting a booking link is irrevocable. Continue?')) {
                                updateImmediately(
                                  'booking_links',
                                  listing.booking_links.filter((_, ix) => ix !== i),
                                )
                                setOpenBookingLink(-1)
                              }
                            }}
                          >
                            Delete Booking Link
                          </Button>
                        </div>
                      </Modal>
                    )}
                  </li>
                ))}
                <Button PreIcon={PlusIcon} className="self-center" onClick={() => setOpenCreateBookingModal(true)}>
                  Add a Booking Link
                </Button>
              </ul>
            </div>
            <TextInput
              collapseDescriptionArea
              label="Primary Email"
              value={listing.primary_email ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_email', e.target.value)}
            />
            <TextInput
              collapseDescriptionArea
              label="Primary Phone"
              value={listing.primary_phone ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_phone', e.target.value)}
            />
            <TextInput
              collapseDescriptionArea
              label="Primary Website URL"
              value={listing.primary_web_url ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_web_url', e.target.value)}
            />
            <TextInput
              label="Primary Address"
              description="Optional if Latitude/Longitude provided"
              value={listing.primary_address ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_address', e.target.value)}
            />
            <TextInput
              description="Optional if Primary Address provided"
              label="Latitude/Longitude"
              placeholder="ex: (0,0)"
              value={listing.lat_lng ?? ''}
              onChange={(e) => setAndDebounceUpdate('lat_lng', e.target.value)}
            />
            <BusinessHours
              businessHours={listing.business_hours}
              onUpdate={(bh) => setAndDebounceUpdate('business_hours', bh)}
            />
            <div>
              <label>Images</label>
              <ul className="flex max-h-80 flex-wrap gap-2 overflow-y-auto p-2 shadow-inner">
                <ImageUploader
                  contentLabel="Images"
                  className="h-32 w-64"
                  entityId={id}
                  onSuccess={() => {
                    refetch().then(({ data }) => {
                      if (data.listing_by_pk) {
                        setListing(data.listing_by_pk)
                      }
                    })
                  }}
                />
                {listing.images.map((image) => (
                  <li
                    className={clsx('group relative h-32', erroredImg[image.url] ? 'w-64' : 'w-auto')}
                    key={image.original_url}
                  >
                    <img
                      className="h-full w-full rounded shadow"
                      src={image.url}
                      alt={image.original_url}
                      onError={async () => {
                        setErroredImg((e) => ({ ...e, [image.url]: true }))
                        if (image.original_url) {
                          const fetchable = await fetch(image.original_url).then((r) => r.ok)

                          if (fetchable) {
                            setFixable((f) => ({ ...f, [image.url]: true }))
                          }
                        }
                      }}
                    />
                    <div className="flex-center absolute right-0 top-0 gap-2">
                      {listing.layout_data.main_image === image.url && <StarIcon className="h-6 w-6 text-yellow-400" />}
                      {listing.layout_data.action_shot1 === image.url && (
                        <CameraIcon className="h-6 w-6 text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-center invisible absolute inset-0 flex-wrap gap-1 bg-primary-50/25 group-hover:visible">
                      {!fixable[image.url] && listing.layout_data.main_image !== image.url && (
                        <Button
                          className="text-xs [&>svg]:h-4 [&>svg]:w-4"
                          PreIcon={StarIcon}
                          onClick={async () => {
                            updateLayoutData('main_image', image.url)
                          }}
                        >
                          Set as Main
                        </Button>
                      )}
                      {!fixable[image.url] && listing.layout_data.action_shot1 !== image.url && (
                        <Button
                          className="text-xs [&>svg]:h-4 [&>svg]:w-4"
                          PreIcon={CameraIcon}
                          onClick={async () => {
                            updateLayoutData('action_shot1', image.url)
                          }}
                        >
                          Set as Action Shot
                        </Button>
                      )}
                      {fixable[image.url] && (
                        <Button
                          className="text-xs [&>svg]:h-4 [&>svg]:w-4"
                          PreIcon={TrashIcon}
                          onClick={async () => {
                            const res = await nhost.graphql
                              .request(
                                graphql(`
                                  mutation fixImage($entityId: Int!, $src: String!) {
                                    uploadImage(entityId: $entityId, src: $src, fix: true) {
                                      success
                                      error
                                      fixed_url
                                    }
                                  }
                                `),
                                {
                                  entityId: id,
                                  src: image.original_url,
                                },
                              )
                              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                            if (res instanceof Error || res.data?.uploadImage.error) {
                              toast.error({
                                message: 'Fixing Image Failed',
                                description: res instanceof Error ? res.message : res.data?.uploadImage.error,
                              })
                              return console.error(res)
                            }

                            if (res.data?.uploadImage.fixed_url) {
                              toast.success({
                                message: 'Image Restored!',
                              })

                              updateImmediately(
                                'images',
                                listing.images.map((i) =>
                                  i.url === image.url ? { ...i, url: res.data.uploadImage.fixed_url } : i,
                                ),
                              ).then(() => {
                                setErroredImg((e) => ({ ...e, [image.url]: false }))
                                setFixable((f) => ({ ...f, [image.url]: false }))
                              })
                            }
                          }}
                        >
                          Fix Image
                        </Button>
                      )}
                      <Button
                        className="text-xs [&>svg]:h-4 [&>svg]:w-4"
                        variant="destructive"
                        PreIcon={TrashIcon}
                        onClick={async () => {
                          if (confirm('Deleting here does not remove from the Duda media manager.')) {
                            updateImmediately(
                              'images',
                              listing.images.filter((i) => i.url !== image.url),
                            )

                            if (listing.layout_data.main_image === image.url) {
                              updateLayoutData('main_image', '')
                            }

                            if (listing.layout_data.action_shot1 === image.url) {
                              updateLayoutData('action_shot1', '')
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label>Videos</label>
              <ul className="flex max-h-80 flex-wrap gap-2 overflow-y-auto p-2 shadow-inner">
                {listing.videos.map((video, i) => (
                  <div className="relative w-fit" key={video.id}>
                    <VideoPlayer videoDetails={video} />
                    <Button
                      className="!absolute bottom-1 right-1 !px-2 [&>svg]:m-0"
                      variant="destructive"
                      PostIcon={TrashIcon}
                      onClick={() =>
                        updateImmediately(
                          'videos',
                          listing.videos.filter((_, idx) => idx !== i),
                        )
                      }
                    ></Button>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (!newVidUrl) return

                    // parse id and type out of url
                    const { id, type } = parseVideoUrl(newVidUrl)

                    if (!id || !type) {
                      return toast.error({
                        message: 'Unable to parse url',
                        description: 'Try copying the url directly from the browser or share button.',
                      })
                    }

                    setNewVidUrl('')

                    update('videos', listing.videos.concat([{ url: newVidUrl, id, type }]))
                  }}
                >
                  <TextInput
                    label="Add Video by URL"
                    description="Enter a youtube, vimeo, or daily motion video url"
                    value={newVidUrl}
                    onChange={(e) => setNewVidUrl(e.target.value)}
                  />
                </form>
              </ul>
            </div>
            <hr className="!my-12" />
            <Button
              PreIcon={TrashIcon}
              variant="destructive"
              onClick={async (e) => {
                const res = await nhost.graphql
                  .request(DELETE_LISTING, { id: listing.id })
                  .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                if (res instanceof Error || res.error) {
                  return console.error(res)
                }

                goTo('..')
              }}
            >
              Delete Listing
            </Button>
            {/* <Button
              PreIcon={BeakerIcon}
              variant="secondary"
              onClick={async (e) => {
                const res = await nhost.functions
                  .call('test_endpoint')
                  .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                if (res instanceof Error || res.error) {
                  return console.error(res)
                }

                console.log(res)
              }}
            >
              Test
            </Button> */}
          </div>
        </>
      )}
      {openCreateBookingModal && (
        <Modal onClose={() => setOpenCreateBookingModal(false)}>
          <CreateBookingLink
            onCreate={(type) => {
              if (type === 'fareharbor-item') {
                updateImmediately(
                  'booking_links',
                  (listing.booking_links ?? []).concat([
                    {
                      type,
                      title: '',
                      description: '',
                      label: 'BOOK NOW',
                      shortname: '',
                      item: '',
                      sheet: '',
                      asn: 'fhdn',
                      'asn-ref': 'thisweekhawaii',
                      'full-item': 'yes',
                      flow: 'no',
                      branding: 'yes',
                      'bookable-only': 'yes',
                    },
                  ]),
                )
              }

              if (type === 'fareharbor-grid') {
                updateImmediately(
                  'booking_links',
                  (listing.booking_links ?? []).concat([
                    {
                      type,
                      script: '',
                    },
                  ]),
                )
              }

              if (type === 'external') {
                updateImmediately(
                  'booking_links',
                  (listing.booking_links ?? []).concat([
                    {
                      type,
                      title: '',
                      description: '',
                      label: 'BOOK NOW',
                      href: '',
                    },
                  ]),
                )
              }

              setOpenCreateBookingModal(false)
              setOpenBookingLink(listing.booking_links.length)
            }}
            onCancel={() => setOpenCreateBookingModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

const updateBookingLinks = (links: BookingLink[], index: number, key: keyof BookingLink, value: any) => {
  return links.map((bl, i) => {
    if (index === i) {
      return {
        ...bl,
        [key]: value,
      }
    }
    return bl
  })
}

const flowRegex = /[&?]flow=(\d+)/
const getFlowFromScript = (script: string) => {
  const matches = script.match(flowRegex)

  if (!matches) {
    return 'None'
  }

  return matches[1]
}

const parseVideoUrl = (url: string) => {
  if (!url) return { id: '', type: '' }

  // youtube in query param
  if (url.includes('youtube.com/watch?') || url.includes('youtu.be/watch?')) {
    const search = new URLSearchParams(url.split('?')[1])

    return {
      type: 'youtube',
      id: search.get('v') ?? '',
    }
  }

  // youtube in pathname
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    return {
      type: 'youtube',
      id: finalPathParam(url),
    }
  }

  // dailymotion
  if (url.includes('dai.ly') || url.includes('dailymotion.com')) {
    return {
      type: 'dailymotion',
      id: finalPathParam(url),
    }
  }

  // vimeo
  if (url.includes('vimeo.com')) {
    return {
      type: 'vimeo',
      id: finalPathParam(url),
    }
  }

  return { id: '', type: '' }
}

const finalPathParam = (url: string) => {
  return url.split('?')[0].split('/').pop()
}
