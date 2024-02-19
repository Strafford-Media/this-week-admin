import { Modal, TextInput } from '@8thday/react'
import clsx from 'clsx'
import React, { ComponentProps, useState } from 'react'

const socialAccountsInputs = [
  {
    key: 'twitter',
    label: 'Twitter',
    prefix: 'https://twitter.com/',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    prefix: 'https://facebook.com/',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    prefix: 'https://instagram.com/',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    prefix: 'https://youtube.com/',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    prefix: 'https://www.linkedin.com/',
  },
  {
    key: 'google_my_business',
    label: 'Google My Business',
    prefix: 'https://google.com/maps/place/',
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    prefix: 'https://pinterest.com/',
  },
  {
    key: 'snapchat',
    label: 'Snapchat',
    prefix: 'https://www.snapchat.com/',
  },
  {
    key: 'tiktok',
    label: 'Tiktok',
    prefix: 'https://tiktok.com/@',
  },
  {
    key: 'vimeo',
    label: 'Vimeo',
    prefix: 'https://vimeo.com/',
  },
  {
    key: 'reddit',
    label: 'Reddit',
    prefix: 'https://www.reddit.com/',
  },
  {
    key: 'whatsapp',
    label: 'Whatsapp',
    prefix: 'https://wa.me/',
  },
  {
    key: 'foursquare',
    label: 'Foursquare',
    prefix: 'https://foursquare.com/',
  },
  {
    key: 'yelp',
    label: 'Yelp',
    prefix: 'http://www.yelp.com/biz/',
  },
  {
    key: 'tripadvisor',
    label: 'TripAdvisor',
    prefix: 'https://www.tripadvisor.com/',
  },
  {
    key: 'rss',
    label: 'RSS Feed',
    prefix: '',
  },
]

export interface SocialAccountsProps extends ComponentProps<'div'> {
  socialAccounts: Record<string, string>
  setSocialAccounts(sa: Record<string, string>): void
}

export const SocialAccounts = ({
  className = '',
  socialAccounts,
  setSocialAccounts,
  ...props
}: SocialAccountsProps) => {
  const [edit, setEdit] = useState(false)

  return (
    <div className={`${className}`} {...props}>
      <label className="mb-2 block">Social Media Links</label>
      <ul
        role="button"
        className="group flex w-fit flex-wrap gap-4 ring-primary-200 focus:outline-none focus:ring-2"
        onClick={() => setEdit(true)}
        // onKeyDown={(e) => e.key === 'Enter' && setEdit(true)}
      >
        {socialAccountsInputs.map((sa) => (
          <li
            key={sa.key}
            onClick={() => {
              setTimeout(() => {
                document.querySelector<HTMLInputElement>(`#social-input-${sa.key}`)?.focus()
              }, 10)
            }}
          >
            <svg
              className={clsx(
                'h-6 w-6 transition-opacity duration-300',
                socialAccounts[sa.key] ? 'text-primary-500' : 'text-gray-400 group-hover:opacity-70',
              )}
            >
              <use xlinkHref={`#svg_icon_${sa.key}`}></use>
            </svg>
          </li>
        ))}
      </ul>
      {edit && (
        <Modal portal className="w-2xl" onClose={() => setEdit(false)}>
          <h3 className="mb-4">Social Media Links</h3>
          {socialAccountsInputs.map((sa) => (
            <TextInput
              key={sa.key}
              id={`social-input-${sa.key}`}
              className="mb-2"
              label={sa.label}
              value={socialAccounts[sa.key]}
              onChange={(e) => setSocialAccounts({ ...socialAccounts, [sa.key]: e.target.value })}
              PreText={sa.prefix}
              collapseDescriptionArea
            />
          ))}
        </Modal>
      )}
    </div>
  )
}
