import { Button, TextInput } from '@8thday/react'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { CREATE_LISTING_SHELL } from '../../graphql'
import { useNhostClient } from '@nhost/react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

export interface NewListingModalProps extends ComponentProps<'div'> {
  onClose(): void
}

export const NewListingModal = ({ className = '', onClose, ...props }: NewListingModalProps) => {
  const nhost = useNhostClient()
  const ref = useRef<HTMLInputElement>(null)

  const [newBusinessName, setNewBusinessName] = useState('')

  const goTo = useNavigate()

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <div className={clsx(className, 'p-4 fixed inset-0 z-50 bg-white/80 flex-center')} {...props}>
      <form
        className="max-w-full min-w-md p-4 space-y-4 shadow-xl rounded-md"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()

          if (!newBusinessName) return

          const res = await nhost.graphql
            .request(CREATE_LISTING_SHELL, { businessName: newBusinessName })
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
          onChange={(e) => setNewBusinessName(e.target.value)}
        />
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
