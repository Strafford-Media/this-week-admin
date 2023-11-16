import React, { ComponentProps, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthQuery } from '@nhost/react-apollo'
import { LISTING_BY_ID } from '../../graphql/queries'
import { LoadingScreen } from './LoadingScreen'
import { Button, Select, TextArea, TextInput, Toggle, toast } from '@8thday/react'
import { ArrowPathIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { BeakerIcon, CameraIcon, StarIcon } from '@heroicons/react/24/solid'
import { useNhostClient } from '@nhost/react'
import { DELETE_LISTING, UPDATE_LISTING } from '../../graphql/mutations'
import { ListingByIdSubQuery } from '../../gql/graphql'
import { useMapbox } from '../../hooks'
import { useMutation } from '@apollo/client'
import { ListingImageUploader } from './ListingImageUploader'
import { graphql } from '../../gql'
import clsx from 'clsx'

const tiers = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'basic', label: 'Basic' },
]

const islands = [
  { value: 'hawaii', label: 'Hawaii (Big Island)' },
  { value: 'oahu', label: 'Oahu' },
  { value: 'maui', label: 'Maui' },
  { value: 'kauai', label: 'Kauai' },
]

export interface ListingProps extends ComponentProps<'div'> {}

export const Listing = ({ className = '', ...props }: ListingProps) => {
  const nhost = useNhostClient()

  const { id: idFromParams } = useParams()
  const id = Number(idFromParams)

  const goTo = useNavigate()

  const [fixable, setFixable] = useState({})
  const [erroredImg, setErroredImg] = useState({})

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
    images: [],
    videos: [],
    booking_links: [],
    layout_data: {},
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

  if (called && !fetchLoading && !error && !data?.listing_by_pk) {
    goTo('..')
  }

  const [updateListing, { loading: saveLoading }] = useMutation(UPDATE_LISTING)

  const update = async (key: string, value: any) => {
    if (data?.listing_by_pk?.[key] === value) return

    const res = await updateListing({ variables: { id, set: { [key]: value } } }).catch((err) =>
      err instanceof Error ? err : new Error(JSON.stringify(err))
    )

    if (res instanceof Error) {
      return toast.error({
        message: "Couldn't save.",
        description: res.message,
      })
    }

    refetch().then(({ data }) => {
      if (data.listing_by_pk) {
        setListing(data.listing_by_pk)
      }
    })
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
        { id, layoutData: { [key]: value } }
      )
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      return toast.error({
        message: "Couldn't save.",
        description: res.message,
      })
    }

    refetch().then(({ data }) => {
      if (data.listing_by_pk) {
        setListing(data.listing_by_pk)
      }
    })
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
      update(key, value)
    }, 400)
  }

  const { setContainer, mapboxRef } = useMapbox()

  console.log(listing)

  return (
    <div className={`${className} shadow-inner px-4 pb-8 h-full max-h-content overflow-y-auto edit-view`} {...props}>
      {!listing ? (
        <LoadingScreen className="!min-h-0 !h-full" />
      ) : (
        <>
          <div className="sticky z-10 top-0 flex min-h-8 p-4 -mx-4 backdrop-blur-sm">
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
          <div className="max-w-3xl">
            <TextInput
              label="Business Name"
              value={listing.business_name}
              onChange={(e) => setAndDebounceUpdate('business_name', e.target.value)}
            />
            <Select
              label="Tier"
              value={listing.tier}
              onValueChange={(v) => updateImmediately('tier', v)}
              items={tiers}
            />
            <Select
              label="Island"
              value={listing.island ?? ''}
              onValueChange={(v) => updateImmediately('island', v)}
              items={islands}
            />
            <Toggle
              className="mb-4 !flex"
              checked={listing.live}
              setChecked={(c) => updateImmediately('live', c)}
              rightLabel="Live"
              rightDescription="Show this listing to the public"
            />
            <Toggle
              className="mb-4 !flex"
              checked={listing.this_week_recommended}
              setChecked={(c) => updateImmediately('this_week_recommended', c)}
              rightLabel="This Week Recommended"
              rightDescription="Publicly recommend this listing"
            />
            <div className="relative min-w-64 min-h-32">
              {listing.layout_data.logo && (
                <img src={listing.layout_data.logo} alt="Company Logo" className="absolute inset-0 h-full" />
              )}
              <ListingImageUploader
                type="logo"
                className={clsx('absolute inset-0 w-64 h-32', {
                  'opacity-100': !listing.layout_data.logo,
                  'opacity-0 hover:opacity-95 focus-within:opacity-95': listing.layout_data.logo,
                })}
                listingId={id}
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
              label="Short Slogan"
              value={listing.slogan ?? ''}
              onChange={(e) => setAndDebounceUpdate('slogan', e.target.value)}
            />
            <TextArea
              label="Description"
              value={listing.description ?? ''}
              onChange={(e) => setAndDebounceUpdate('description', e.target.value)}
            />
            <TextInput
              label="Primary Email"
              value={listing.primary_email ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_email', e.target.value)}
            />
            <TextInput
              label="Primary Phone"
              value={listing.primary_phone ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_phone', e.target.value)}
            />
            <TextInput
              label="Primary Website URL"
              value={listing.primary_web_url ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_web_url', e.target.value)}
            />
            <TextInput
              label="Primary Address"
              value={listing.primary_address ?? ''}
              onChange={(e) => setAndDebounceUpdate('primary_address', e.target.value)}
            />
            <div ref={setContainer} className="h-40"></div>
            <div>
              <h3>Images</h3>
              <ul className="flex flex-wrap gap-2 max-h-80 p-2 overflow-y-auto shadow-inner">
                <ListingImageUploader
                  className="w-64 h-32"
                  listingId={id}
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
                    className={clsx('relative group h-32', erroredImg[image.url] ? 'w-64' : 'w-auto')}
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
                    <div className="absolute top-0 right-0 flex-center gap-2">
                      {listing.layout_data.main_image === image.url && <StarIcon className="text-yellow-400 h-6 w-6" />}
                      {listing.layout_data.action_shot1 === image.url && (
                        <CameraIcon className="text-indigo-400 h-6 w-6" />
                      )}
                    </div>
                    <div className="absolute inset-0 group-hover:visible invisible bg-primary-50/25 flex-center flex-wrap gap-1">
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
                                  mutation fixImage($listingId: Int!, $src: String!) {
                                    uploadImageToListing(listingId: $listingId, src: $src, fix: true) {
                                      success
                                      error
                                      fixed_url
                                    }
                                  }
                                `),
                                {
                                  listingId: id,
                                  src: image.original_url,
                                }
                              )
                              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                            if (res instanceof Error || res.data?.uploadImageToListing.error) {
                              toast.error({
                                message: 'Fixing Image Failed',
                                description: res instanceof Error ? res.message : res.data?.uploadImageToListing.error,
                              })
                              return console.error(res)
                            }

                            if (res.data?.uploadImageToListing.fixed_url) {
                              toast.success({
                                message: 'Image Restored!',
                              })

                              updateImmediately(
                                'images',
                                listing.images.map((i) =>
                                  i.url === image.url ? { ...i, url: res.data.uploadImageToListing.fixed_url } : i
                                )
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
                              listing.images.filter((i) => i.url !== image.url)
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
              <h3>Videos</h3>
              <ul className="flex flex-wrap gap-2 max-h-80 p-2 overflow-y-auto shadow-inner">
                {listing.videos.map((video) => (
                  <iframe
                    key={video.url}
                    width="560"
                    height="315"
                    src={video.url}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (!newVidUrl) return

                    update('videos', listing.videos.concat([{ url: newVidUrl }]))
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
            <Button
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
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
