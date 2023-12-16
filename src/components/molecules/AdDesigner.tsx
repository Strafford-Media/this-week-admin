import { Button, Select, TextInput, Toggle, toast } from '@8thday/react'
import React, { ComponentProps, useState } from 'react'
import { AdPreview } from '../atoms/AdPreview'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthQuery } from '@nhost/react-apollo'
import { AD_BY_ID, CREATE_AD, DELETE_AD, UPDATE_AD } from '../../graphql'
import { useNhostClient } from '@nhost/react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { adSizes } from '../../utils/constants'
import { ImageUploader } from './ImageUploader'
import { GetAdByIdQuery } from '../../gql/graphql'

export interface AdDesignerProps extends ComponentProps<'div'> {}

export const AdDesigner = ({ className = '', ...props }: AdDesignerProps) => {
  const nhost = useNhostClient()
  const { id: rawId = '' } = useParams()
  const id = Number(rawId)

  const goTo = useNavigate()

  const [name, setName] = useState('')
  const [ctaLink, setCtaLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [size, setSize] = useState(adSizes[0].value)

  const [imageValid, setImageValid] = useState(false)

  const [width, height] = size.split('x').map(Number)

  const updateAdData = (ad?: GetAdByIdQuery['ad_by_pk']) => {
    if (ad) {
      setName(ad.name)
      setCtaLink(ad.link)
      setImageUrl(ad.image)
      setSize(ad.size)
    }
  }

  const { data, refetch } = useAuthQuery(AD_BY_ID, {
    variables: { id },
    skip: !id,
    onCompleted(data) {
      const ad = data.ad_by_pk
      updateAdData(ad)
    },
  })

  const disabled =
    !name ||
    !ctaLink ||
    !imageUrl ||
    !imageValid ||
    (name === data?.ad_by_pk?.name &&
      ctaLink === data?.ad_by_pk?.link &&
      imageUrl === data?.ad_by_pk?.image &&
      size === data?.ad_by_pk?.size)

  return (
    <div className="p-2 sm:p-4">
      <h2 className="my-4 text-center text-primary-900">Ad Designer</h2>
      <div className={`${className} flex flex-col md:flex-row`} {...props}>
        <form
          className="mx-auto flex w-full max-w-screen-sm flex-col items-stretch"
          onSubmit={async (e) => {
            e.preventDefault()

            if (disabled) return

            if (!id) {
              const res = await nhost.graphql
                .request(CREATE_AD, {
                  object: {
                    link: ctaLink,
                    image: imageUrl,
                    size,
                    name,
                  },
                })
                .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

              if (res instanceof Error) {
                return toast.error({ message: 'Could not create ad', description: res.message })
              }

              const createdId = res.data?.insert_ad_one?.id
              if (!createdId) {
                return toast.error({
                  message: 'Could not create ad',
                  description: 'Please check the form inputs and try again.',
                })
              }

              toast.success({ message: 'Ad Created!' })

              setName('')
              setCtaLink('')
              setImageUrl('')
              setSize('')

              goTo(`/ads/manage/${createdId}`)
            } else {
              const res = await nhost.graphql
                .request(UPDATE_AD, {
                  id,
                  set: {
                    link: ctaLink,
                    image: imageUrl,
                    name,
                    size,
                  },
                })
                .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

              if (res instanceof Error) {
                return toast.error({ message: 'Unable to update Ad' })
              }

              toast.success({ message: 'Ad updated!' })
              refetch()
            }
          }}
        >
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput label="CTA Link" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} required />
          <ImageUploader
            type={id ? 'ad' : 'library'}
            contentLabel="Creative Content"
            entityId={id}
            onSuccess={(newUrl) => {
              if (!id && newUrl) {
                setImageUrl(newUrl)
              }
            }}
          />
          <Select label="Size" items={adSizes} value={size} onValueChange={setSize} />
          <div className="mt-4 flex items-center gap-4">
            {!!id && (
              <Button
                type="button"
                variant="dismissive"
                className="text-red-500"
                PreIcon={TrashIcon}
                onClick={async () => {
                  if (!confirm('Deleting an Ad is irrevocable. Continue?')) return
                  const res = await nhost.graphql
                    .request(DELETE_AD, { id })
                    .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                  if (res instanceof Error) {
                    return toast.error({ message: 'Unable to delete ad' })
                  }

                  goTo('/ads')
                }}
              >
                Delete Ad
              </Button>
            )}
            {!disabled && (
              <>
                <Button
                  type="button"
                  variant="dismissive"
                  onClick={() => {
                    refetch().then(({ data }) => updateAdData(data.ad_by_pk))
                  }}
                >
                  Discard Changes
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
        <div className="flex-center max-h-content grow flex-col md:ml-4">
          <h3 className="mb-4 text-primary-900">Preview</h3>
          <AdPreview height={height} width={width} imageUrl={imageUrl} onValidate={setImageValid} />
        </div>
      </div>
    </div>
  )
}
