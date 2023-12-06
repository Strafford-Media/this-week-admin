import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps } from 'react'
import { ALL_ADS } from '../../graphql'
import { NavLink } from 'react-router-dom'

export interface AdListProps extends ComponentProps<'div'> {}

export const AdList = ({ className = '', ...props }: AdListProps) => {
  const { data } = useAuthQuery(ALL_ADS)
  return (
    <div className={`${className}`} {...props}>
      <h2 className="my-4 text-center text-primary-900">This Week Ads</h2>
      <div className="flex flex-col">
        {data?.ad.map((ad) => (
          <NavLink
            key={ad.id}
            to={`edit/${ad.id}`}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
          >
            <span>{ad.name}</span>
            <img src={ad.image} alt={ad.name} className="aspect-auto h-32 w-auto" />
          </NavLink>
        ))}
      </div>
    </div>
  )
}
