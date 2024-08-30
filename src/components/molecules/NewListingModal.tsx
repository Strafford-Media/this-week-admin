import { Button, TextInput } from '@8thday/react'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { CREATE_LISTING_SHELL } from '../../graphql'
import { useNhostClient } from '@nhost/react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'

export interface NewListingModalProps extends ComponentProps<'div'> {
  onClose(): void
}

export const NewListingModal = ({ className = '', onClose, ...props }: NewListingModalProps) => {
  const nhost = useNhostClient()
  const ref = useRef<HTMLInputElement>(null)

  const [newBusinessName, setNewBusinessName] = useState('')
  const [slug, setSlug] = useState('')

  const [synced, setSynced] = useState(true)

  const goTo = useNavigate()

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <div className={clsx(className, 'flex-center fixed inset-0 z-50 bg-white/80 p-4')} {...props}>
      <form
        className="min-w-md max-w-full space-y-4 rounded-md bg-white p-4 shadow-xl"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()

          if (!newBusinessName || !slug) return

          const res = await nhost.graphql
            .request(CREATE_LISTING_SHELL, { businessName: newBusinessName, slug })
            .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

          if (res instanceof Error || res.error || !res.data.insert_listing_one?.id) {
            return console.error(res)
          }

          onClose()
          setNewBusinessName('')

          goTo(`/listings/${res.data.insert_listing_one.id}`)
        }}
      >
        <TextInput
          ref={ref}
          label="Business Name"
          value={newBusinessName}
          onChange={(e) => {
            const newName = e.target.value
            setNewBusinessName(newName)

            if (synced) {
              setSlug(
                newName
                  .replace(/[^A-Za-z0-9 ]+/g, '')
                  .replace(' ', '-')
                  .toLowerCase(),
              )
            }
          }}
          collapseDescriptionArea
        />
        <div className="flex">
          <TextInput
            className="grow"
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)

              if (synced) {
                setSynced(false)
              }
            }}
            description={
              <span>
                <em className="text-gray-500">https://www.thisweekhawaii.com/listing/</em>
                <span className="text-gray-800">{slug}</span>
              </span>
            }
          />
          {!synced && (
            <Button
              PreIcon={ArrowsUpDownIcon}
              variant="dismissive"
              className="mb-6 ml-1 self-end"
              onClick={() => {
                setSynced(true)
                setSlug(
                  newBusinessName
                    .replace(/[^A-Za-z0-9 ]+/g, '')
                    .replace(' ', '-')
                    .toLowerCase(),
                )
              }}
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={!newBusinessName}>
            Create Listing
          </Button>
          <Button
            type="button"
            variant="dismissive"
            onClick={() => {
              onClose()
              setNewBusinessName('')
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
