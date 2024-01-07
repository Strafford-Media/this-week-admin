import React, { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { NewCategoryForm } from './NewCategoryForm'
import { Tag, useCategoryTags } from '../../hooks/useCategoryTags'
import { IconButton } from '../atoms/IconButton'
import { ChevronUpIcon, MinusCircleIcon, TrashIcon, StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthQuery } from '@nhost/react-apollo'
import {
  ALL_LISTINGS_WITH_CATEGORIES,
  CREATE_CATEGORY_LISTINGS,
  DELETE_CATEGORY_BY_ID,
  DELETE_CATEGORY_LISTING_BY_ID,
  LISTINGS_BY_CATEGORY,
  REMOVE_CATEGORY_LISTINGS,
  UPDATE_CATEGORY_BY_ID,
} from '../../graphql'
import { CheckIcon, PlusIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { prevDefAndNoProp } from '../../utils/general'
import { useNhostClient } from '@nhost/react'
import { Toggle, toast } from '@8thday/react'

export interface CategoryManagerProps extends ComponentProps<'div'> {}

export const CategoryManager = ({ className = '', ...props }: CategoryManagerProps) => {
  const { tags, refetch } = useCategoryTags()

  const setSearchParams = useSearchParams()[1]

  return (
    <div
      className={`${className} relative flex h-[calc(95vh-1rem)] w-[95vw] max-w-full flex-col sm:h-[calc(95vh-2rem)]`}
      {...props}
    >
      <IconButton
        className="absolute right-0 top-0 z-10"
        srLabel="Close"
        icon={XMarkIcon}
        onClick={() => setSearchParams((s) => (s.delete('manage-categories'), s))}
      />
      <h2 className="mb-8 shrink-0 text-center">Category Tags for Listings</h2>
      <div className="relative flex grow flex-col gap-2 overflow-y-auto overflow-x-visible md:flex-row-reverse md:justify-between md:gap-4">
        <NewCategoryForm
          className="mx-auto border-2 border-primary-50 md:sticky md:top-0 md:mx-0 md:self-start"
          onCreate={(id) => {
            refetch().then(() => {
              setTimeout(() => {
                document.getElementById(`category-tag-${id}`)?.scrollIntoView({ behavior: 'smooth' })
              }, 4)
            })
          }}
        />
        <ul className="max-w-lg grow space-y-0.5">
          {tags.map((tag) => (
            <TagListItem
              key={tag.id}
              tag={tag}
              onUpdate={(id) => {
                refetch().then(() => {
                  setTimeout(() => {
                    document.getElementById(`category-tag-${id}`)?.scrollIntoView({ behavior: 'smooth' })
                  }, 4)
                })
              }}
            />
          ))}
          {!tags.length && <p>Create a category to get started!</p>}
        </ul>
      </div>
    </div>
  )
}

interface TagListItemProps extends ComponentProps<'li'> {
  tag: Tag
  onUpdate?(id: number): void
}

const TagListItem = ({ tag, onUpdate }: TagListItemProps) => {
  const nhost = useNhostClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const tagIdString = `${tag.id}`
  const [searchParams, setSearchParams] = useSearchParams()

  const [label, setLabel] = useState(tag.label)
  const [isPrimary, setIsPrimary] = useState(tag.is_primary)

  const isOpen = searchParams.getAll('openTags').includes(tagIdString)

  const isDirty = isPrimary !== tag.is_primary || label !== tag.label

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <li
      id={`category-tag-${tag.id}`}
      className={clsx('p-1', { 'hover:bg-primary-50': !isOpen, 'bg-gray-100': isOpen })}
      onClick={() => {
        if (!isOpen) {
          setSearchParams((s) => (s.append('openTags', tagIdString), s))
        }
      }}
    >
      <div className="flex cursor-pointer items-center">
        <div className="mr-1 h-5 w-5">
          {isOpen ? (
            <IconButton
              className="!h-5 !w-5 p-0 !text-yellow-500 focus:ring-0"
              srLabel="toggle primary status of category"
              icon={isPrimary ? StarIcon : OutlineStarIcon}
              onClick={prevDefAndNoProp(() => setIsPrimary((p) => !p))}
            />
          ) : (
            <StarIcon className={clsx(isPrimary ? 'text-yellow-500' : 'text-transparent')} />
          )}
        </div>
        <span className="mr-auto capitalize">
          {isOpen ? (
            <input
              ref={inputRef}
              className="inline w-fit border-x-0 border-b border-t-0 border-b-gray-800 p-0 capitalize focus:outline-none focus:ring-0"
              value={label}
              size={label.length}
              onChange={(e) => setLabel(e.target.value)}
            />
          ) : (
            tag.label
          )}{' '}
          <em className="">({tag.listing_category_tags_aggregate.aggregate?.count})</em>
        </span>
        {isOpen && (
          <div className={clsx(`ml-auto`)}>
            {isDirty && (
              <IconButton
                className="text-green-500"
                icon={CheckIcon}
                onClick={async () => {
                  const res = await nhost.graphql
                    .request(UPDATE_CATEGORY_BY_ID, {
                      id: tag.id,
                      set: { label: label.trim().toLowerCase(), is_primary: isPrimary },
                    })
                    .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                  if (res instanceof Error || res.error) {
                    return toast.error({ message: 'Unable to update category' })
                  }

                  onUpdate?.(tag.id)
                }}
                srLabel="Save Changes"
              />
            )}
            <IconButton
              icon={ChevronUpIcon}
              onClick={prevDefAndNoProp(() => {
                setSearchParams((s) => (s.delete('openTags', tagIdString), s))
              })}
              srLabel={`close category ${tag.label}`}
            />
            <IconButton
              icon={TrashIcon}
              onClick={async () => {
                if (
                  !(tag.listing_category_tags_aggregate.aggregate?.count ?? 1) ||
                  confirm('Deleting this Category will irrevocably remove it from all listings. Proceed?')
                ) {
                  const res = await nhost.graphql
                    .request(DELETE_CATEGORY_BY_ID, { id: tag.id })
                    .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                  if (res instanceof Error || res.error) {
                    return toast.error({ message: 'Unable to delete category' })
                  }

                  setSearchParams((s) => (s.delete('openTags', tagIdString), s))
                  onUpdate?.(tag.id)
                }
              }}
              srLabel={`delete category ${tag.label}`}
            />
          </div>
        )}
      </div>
      {isOpen && (
        <div>
          <Toggle className="my-2 flex" checked={isPrimary} setChecked={setIsPrimary} rightLabel="Primary Category" />
          <CategoryListingList tag={tag} onUpdate={onUpdate} />
        </div>
      )}
    </li>
  )
}

interface CategoryListingListProps extends ComponentProps<'div'> {
  tag: Tag
  onUpdate?(id: number): void
}

const CategoryListingList = ({ tag, onUpdate }: CategoryListingListProps) => {
  const nhost = useNhostClient()

  const updateNeededRef = useRef({ all: false, filtered: false })

  const [addingListings, setAddingListings] = useState(false)
  const [listingsToAdd, setListingsToAdd] = useState({})
  const [listingsToRemove, setListingsToRemove] = useState({})

  const { data, refetch } = useAuthQuery(LISTINGS_BY_CATEGORY, {
    variables: { categoryId: tag.id },
    skip: addingListings,
  })
  const { data: allListingsData, refetch: refetchAll } = useAuthQuery(ALL_LISTINGS_WITH_CATEGORIES, {
    skip: !addingListings,
  })

  const allListings =
    allListingsData?.listing.map((l) => ({
      ...l,
      listingCategoryId: l.listing_category_tags.find((ct) => ct.category_tag_id === tag.id)?.id,
    })) ?? []

  const disabled = useMemo(() => {
    if (Object.keys(listingsToAdd).length) return false
    if (Object.keys(listingsToRemove).length) return false
    return true
  }, [listingsToAdd, listingsToRemove])

  return (
    <div className="py-2">
      <h5 className="flex items-center border-b border-b-gray-300">
        Listings
        {addingListings && (
          <IconButton
            disabled={disabled}
            className="ml-auto text-gray-400 enabled:text-green-500"
            icon={CheckIcon}
            srLabel="Save Listing Changes"
            onClick={async () => {
              const removeIds = Object.keys(listingsToRemove)
                .filter((k) => listingsToRemove[k])
                .map(Number)
              const addIds = Object.keys(listingsToAdd)
                .filter((k) => listingsToAdd[k])
                .map(Number)

              let errored = false
              if (removeIds.length) {
                const res = await nhost.graphql
                  .request(REMOVE_CATEGORY_LISTINGS, { ids: removeIds })
                  .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                if (res instanceof Error || res.error) {
                  console.error(res)
                  errored = true
                  toast.error({ message: `There was an error removing listings from category "${tag.label}"` })
                }

                setListingsToRemove({})
              }

              if (addIds.length) {
                const res = await nhost.graphql
                  .request(CREATE_CATEGORY_LISTINGS, {
                    objects: addIds.map((listing_id) => ({ listing_id, category_tag_id: tag.id })),
                  })
                  .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                if (res instanceof Error || res.error) {
                  console.error(res)
                  errored = true
                  toast.error({ message: `There was an error adding listings to category "${tag.label}"` })
                }

                setListingsToAdd({})
              }

              refetchAll().then(() => {
                updateNeededRef.current.all = false
              })

              if (!errored) {
                refetch().then(() => {
                  updateNeededRef.current.filtered = false
                })
                setAddingListings(false)
                onUpdate?.(tag.id)
              }
            }}
          />
        )}
        <IconButton
          className={addingListings ? 'ml-2' : 'ml-auto'}
          iconClass={clsx('transition-all duration-300', addingListings ? 'rotate-45' : 'rotate-0')}
          icon={PlusIcon}
          srLabel="Add Listing to Category"
          onClick={() => {
            if (addingListings && updateNeededRef.current.filtered)
              refetch().then(() => {
                updateNeededRef.current.filtered = false
              })
            if (!addingListings && updateNeededRef.current.all)
              refetchAll().then(() => {
                updateNeededRef.current.all = false
              })
            setAddingListings((a) => !a)
          }}
        />
      </h5>
      {!addingListings ? (
        <ul>
          {data?.listing.map((listing) => (
            <li key={listing.id} className="group flex items-center justify-between py-0.5">
              {listing.business_name}
              <IconButton
                className="invisible group-hover:visible"
                icon={MinusCircleIcon}
                srLabel="Remove Listing from Category"
                onClick={async () => {
                  const categoryListingId = listing.listing_category_tags?.[0]?.id

                  if (!categoryListingId)
                    return toast.error({
                      message: 'Unable to remove listing from category',
                      description: 'Data is in a bad state',
                    })

                  const res = await nhost.graphql
                    .request(DELETE_CATEGORY_LISTING_BY_ID, { id: categoryListingId })
                    .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                  if (res instanceof Error || res.error) {
                    return toast.error({ message: 'Unable to remove listing from category' })
                  }

                  refetch().then(() => {
                    updateNeededRef.current.all = true
                    updateNeededRef.current.filtered = false
                  })
                  onUpdate?.(tag.id)
                }}
              />
            </li>
          ))}
          {!data?.listing.length && <p>No Listings in this Category yet.</p>}
        </ul>
      ) : (
        <ul className="p-1">
          {allListings.map((listing) => {
            const checked = listing.listingCategoryId
              ? !listingsToRemove[listing.listingCategoryId]
              : !!listingsToAdd[listing.id]
            return (
              <li key={listing.id} className="flex items-center py-0.5">
                <Toggle
                  checked={checked}
                  setChecked={(c) =>
                    listing.listingCategoryId
                      ? setListingsToRemove((r) => ({ ...r, [listing.listingCategoryId!]: !c }))
                      : setListingsToAdd((a) => ({ ...a, [listing.id]: c }))
                  }
                  rightLabel={listing.business_name}
                  className={clsx({ '[&>span>span]:text-primary-500': checked !== !!listing.listingCategoryId })}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
