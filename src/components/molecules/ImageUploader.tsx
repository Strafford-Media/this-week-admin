import { useNhostClient } from '@nhost/react'
import React, { ComponentProps, useState } from 'react'
import { graphql } from '../../gql'
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline'
import { TextInput, toast } from '@8thday/react'

export interface ImageUploaderProps extends ComponentProps<'div'> {
  contentLabel?: string
  entityId: number
  type?: 'logo' | 'gallery' | 'ad' | 'library'
  onSuccess?(newUrl?: string | null): void
}

export const ImageUploader = ({
  type = 'gallery',
  contentLabel = 'Images',
  className = '',
  onSuccess,
  entityId,
  ...props
}: ImageUploaderProps) => {
  const nhost = useNhostClient()

  const [url, setUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  const uploadURL = async (src: string) => {
    setImageUploading(true)

    // check if image exists in duda already
    const checkRes = await nhost.graphql
      .request(
        graphql(`
          query checkImage($url: String!) {
            checkImage(url: $url) {
              success
              error
              existing_url
            }
          }
        `),
        {
          url: src,
        },
      )
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (checkRes instanceof Error || checkRes.error || checkRes.data.checkImage.error) {
      console.error(checkRes)
    }

    // if exists, use the existing url to upload
    const uploadSrc =
      !(checkRes instanceof Error) && checkRes?.data?.checkImage?.success && checkRes.data.checkImage.existing_url
        ? checkRes.data.checkImage.existing_url
        : src

    const res = await nhost.graphql
      .request(
        graphql(`
          mutation uploadImage($entityId: Int!, $src: String!, $destination: String) {
            uploadImage(entityId: $entityId, src: $src, destination: $destination) {
              success
              error
              new_url
            }
          }
        `),
        {
          entityId,
          src: uploadSrc,
          destination: type,
        },
      )
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      setImageUploading(false)
      return console.error(res)
    }

    if (res.data?.uploadImage.success) {
      onSuccess?.(res.data.uploadImage.new_url)
    } else {
      toast.error({ message: 'Unable to upload image', description: res.data?.uploadImage.error })
    }

    setImageUploading(false)
  }

  const uploadFile = async (file: File) => {
    const { fileMetadata, error } = await nhost.storage.upload({ file, bucketId: 'temp' })

    if (error) {
      return toast.error({ message: 'Unable to upload image', description: error.message })
    }

    const src =
      fileMetadata.mimeType === 'image/png'
        ? `${nhost.functions.url}/file.png?id=${fileMetadata.id}`
        : fileMetadata.mimeType === 'image/gif'
          ? `${nhost.functions.url}/file.gif?id=${fileMetadata.id}`
          : nhost.storage.getPublicUrl({ fileId: fileMetadata.id })

    await uploadURL(src)

    nhost.storage.delete({ fileId: fileMetadata.id })
  }

  return (
    <div
      className={`${className} flex-center rounded bg-primary-100 p-2 shadow`}
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
      <label className="flex-center h-full w-full cursor-pointer flex-col text-primary-800">
        <span className="flex-center gap-1 text-xs">
          {imageUploading ? (
            <ArrowPathIcon className="inline h-4 w-4 animate-spin align-text-bottom" />
          ) : (
            <PlusIcon className="inline h-4 w-4 align-text-bottom" />
          )}{' '}
          <span>Drag or Click to Add</span>
          <span className="font-bold">{contentLabel}</span>
        </span>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          className="hidden text-sm placeholder:text-center"
          onChange={async (e) => {
            const file = e.target.files?.[0]

            if (!file) return

            setImageUploading(true)

            uploadFile(file)

            setImageUploading(false)
          }}
          multiple
        />
        <span className="mb-2 text-xs">or</span>
        <TextInput
          className="self-stretch"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          collapseDescriptionArea
          placeholder='paste url and hit "enter"'
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || !url) return

            e.preventDefault()
            e.stopPropagation()

            uploadURL(url)
          }}
        />
      </label>
    </div>
  )
}
