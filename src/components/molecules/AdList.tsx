import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps, useState } from 'react'
import { ALL_ADS } from '../../graphql'
import { NavLink } from 'react-router-dom'
import { adSizeDisplayMap } from '../../utils/constants'
import { Toggle, useRememberedState } from '@8thday/react'

const onlyLive = {
  live: { _eq: true },
}

export interface AdListProps extends ComponentProps<'div'> {}

export const AdList = ({ className = '', ...props }: AdListProps) => {
  const [checked, setChecked] = useRememberedState('ad-list-filter-checked', false)
  const { data } = useAuthQuery(ALL_ADS, { variables: { whereClause: checked ? onlyLive : null } })

  return (
    <div className={`${className}`} {...props}>
      <div className="flex-center py-4">
        <Toggle leftLabel="All Ads" rightLabel="Live Ads" checked={checked} setChecked={setChecked} />
      </div>
      <div className="relative grid grid-cols-auto-5 gap-2">
        <div className="col-span-full mx-4 grid grid-cols-sub border-b border-gray-500 py-2 text-gray-500">
          <span>Name</span>
          <span>Size</span>
          <span>Live</span>
          <span>Last Updated</span>
          <span className="text-right">Creative Content</span>
        </div>
        {data?.ad.map((ad) => (
          <NavLink
            key={ad.id}
            to={`edit/${ad.id}`}
            className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
          >
            <span className="max-w-80 text-primary-500">{ad.name}</span>
            <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
            <span className={ad.live ? 'text-green-500' : 'text-gray-400'}>{ad.live ? 'Live' : 'Inactive'}</span>
            <span>{new Date(ad.updated_at).toLocaleString()}</span>
            <img src={ad.image} alt={ad.name} className="aspect-auto h-32 w-auto justify-self-end" />
          </NavLink>
        ))}
      </div>
    </div>
  )
}
