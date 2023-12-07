import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps } from 'react'
import { ALL_ADS } from '../../graphql'
import { NavLink } from 'react-router-dom'
import { adSizeDisplayMap } from '../../utils/constants'

export interface AdListProps extends ComponentProps<'div'> {}

export const AdList = ({ className = '', ...props }: AdListProps) => {
  const { data } = useAuthQuery(ALL_ADS)
  return (
    <div className={`${className}`} {...props}>
      <h2 className="my-4 text-center text-primary-900">This Week Ads</h2>
      <div className="relative grid grid-cols-auto-4 gap-2">
        {data?.ad.map((ad) => (
          <NavLink
            key={ad.id}
            to={`edit/${ad.id}`}
            className="col-span-5 grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
          >
            <span className="text-primary-500">{ad.name}</span>
            <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
            <img src={ad.image} alt={ad.name} className="aspect-auto h-32 w-auto justify-self-end" />
          </NavLink>
        ))}
      </div>
    </div>
  )
}
