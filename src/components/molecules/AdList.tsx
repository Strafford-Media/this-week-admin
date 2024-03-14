import { useAuthQuery } from '@nhost/react-apollo'
import React, { ComponentProps, useState } from 'react'
import { ALL_ADS } from '../../graphql'
import { NavLink } from 'react-router-dom'
import { adSizeDisplayMap } from '../../utils/constants'
import { Toggle, useClickLink, useRememberedState } from '@8thday/react'
import { IconButton } from '../atoms/IconButton'
import { CalendarDaysIcon, PencilSquareIcon } from '@heroicons/react/24/solid'

const onlyLive = {
  ad_cycles: { starts_at: { _lte: 'now()' }, ends_at: { _gte: 'now()' } },
}

export interface AdListProps extends ComponentProps<'div'> {}

export const AdList = ({ className = '', ...props }: AdListProps) => {
  const [checked, setChecked] = useRememberedState('ad-list-filter-checked', false)
  const { data } = useAuthQuery(ALL_ADS, { variables: { whereClause: checked ? onlyLive : null } })

  const goTo = useClickLink()

  return (
    <div className={`${className} flex max-h-full grow flex-col`} {...props}>
      <div className="flex-center py-4">
        <Toggle leftLabel="All Ads" rightLabel="Live Ads" checked={checked} setChecked={setChecked} />
      </div>
      <div className="h-full overflow-y-auto">
        <div className="grid max-h-full grid-cols-auto-5 gap-2">
          <div className="sticky top-0 z-10 col-span-full mx-4 grid grid-cols-sub border-b border-gray-500 bg-gray-50 py-2 text-gray-500">
            <span> </span>
            <span>Name</span>
            <span>Size</span>
            <span>Last Updated</span>
            <span className="text-right">Creative Content</span>
          </div>
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
          {data?.ad.map((ad) => (
            <NavLink
              key={ad.id}
              to={`manage/${ad.id}`}
              className="col-span-full grid cursor-pointer grid-cols-sub items-center px-4 py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
            >
              <div
                className="flex flex-col"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <IconButton
                  icon={CalendarDaysIcon}
                  onClick={(e) => goTo(`/ads/scheduler/${ad.id}`, e)}
                  srLabel="Schedule this Ad"
                />
                <IconButton
                  icon={PencilSquareIcon}
                  onClick={(e) => goTo(`/ads/manage/${ad.id}`, e)}
                  srLabel="Manage this Ad"
                />
              </div>
              <span className="max-w-80 text-primary-500">{ad.name}</span>
              <span className="text-gray-600">{adSizeDisplayMap[ad.size]}</span>
              <span>{new Date(ad.updated_at).toLocaleString()}</span>
              <img src={ad.image} alt={ad.name} className="aspect-auto max-h-32 justify-self-end" />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
