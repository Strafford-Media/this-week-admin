import { useNhostClient } from '@nhost/react'
import React, { ComponentProps, useState } from 'react'
import { graphql } from '../../gql'
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline'
import { TextInput, toast } from '@8thday/react'

export interface ListingImageUploaderProps extends ComponentProps<'div'> {
  listingId: number
  type?: 'logo' | 'gallery'
  onSuccess?(): void
}

export const ListingImageUploader = ({
  type = 'gallery',
  className = '',
  onSuccess,
  listingId,
  ...props
}: ListingImageUploaderProps) => {
  const nhost = useNhostClient()

  const [url, setUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  const uploadURL = async (src: string) => {
    setImageUploading(true)

    const res = await nhost.graphql
      .request(
        graphql(`
          mutation uploadImage($listingId: Int!, $src: String!, $destination: String) {
            uploadImageToListing(listingId: $listingId, src: $src, destination: $destination) {
              success
              error
            }
          }
        `),
        {
          listingId,
          src,
          destination: type,
        }
      )
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      setImageUploading(false)
      return console.error(res)
    }

    if (res.data?.uploadImageToListing.success) {
      onSuccess?.()
    } else {
      toast.error({ message: 'Unable to upload image', description: res.data?.uploadImageToListing.error })
    }

    setImageUploading(false)
  }

  const uploadFile = async (file: File) => {
    const { fileMetadata, error } = await nhost.storage.upload({ file, bucketId: 'temp' })

    if (error) {
      return toast.error({ message: 'Unable to upload image', description: error.message })
    }

    const src = nhost.storage.getPublicUrl({ fileId: fileMetadata.id })

    await uploadURL(src.replace('https://local.storage.nhost.run', 'https://thisweekstorage.loca.it'))

    // nhost.storage.delete({ fileId: fileMetadata.id })
  }

  return (
    <div
      className={`${className} flex-center bg-primary-100 p-2 rounded shadow`}
      {...props}
      role="button"
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.add('bg-primary-200', 'border', 'border-primary-500', 'border-dashed')
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('bg-primary-200', 'border', 'border-primary-500', 'border-dashed')
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.dataTransfer?.files?.[0]) {
          return uploadFile(e.dataTransfer.files[0])
        }

        for (const item of e.dataTransfer.items) {
          if (item.type === 'text/uri-list') {
            item.getAsString(async (s) => {
              if (s.startsWith('https://')) {
                uploadURL(s)
              } else {
                toast.error({ message: 'Cannot accept images from non-https sources' })
              }
            })
          }
        }

        e.currentTarget.classList.remove('bg-primary-200', 'border', 'border-primary-500', 'border-dashed')
      }}
    >
      <label className="h-full w-full flex-center flex-col cursor-pointer text-primary-800">
        <span>
          {imageUploading ? (
            <ArrowPathIcon className="inline align-text-bottom h-5 w-5 animate-spin" />
          ) : (
            <PlusIcon className="inline align-text-bottom h-5 w-5" />
          )}{' '}
          Drag or Click to Add {type === 'logo' ? 'Company Logo' : 'Images'}
        </span>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]

            if (!file) return

            setImageUploading(true)

            uploadFile(file)

            setImageUploading(false)
          }}
          multiple
        />
        <span>or</span>
        <form
          className="w-full self-stretch"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (!url) return

            uploadURL(url)
          }}
        >
          <TextInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            collapseDescriptionArea
            placeholder='paste url and hit "enter"'
          />
        </form>
      </label>
    </div>
  )
}
