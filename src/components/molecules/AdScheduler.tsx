import FullCalendar from '@fullcalendar/react'
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import React, { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { useAuthQuery } from '@nhost/react-apollo'
import { ALL_AD_CYCLES, CREATE_AD_CYCLE, DELETE_AD_CYCLE, UPDATE_AD_CYCLE } from '../../graphql'
import { EventInput, formatDate } from '@fullcalendar/core'
import { useParams } from 'react-router-dom'
import { Button, Select, TextInput, toast, useClickLink, useEventListener } from '@8thday/react'
import { AdPreview } from '../atoms/AdPreview'
import { GetAdCyclesQuery } from '../../gql/graphql'
import { adSizeDisplayMap } from '../../utils/constants'
import { NavLink } from 'react-router-dom'
import { CheckIcon, PencilSquareIcon, RocketLaunchIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useNhostClient } from '@nhost/react'

const getDimensions = () => {
  const width = window.innerWidth - 392
  const height = window.innerHeight - (122 + Math.sqrt(window.innerWidth) * 2)
  const aspectRatio = width / height

  return { width, height, aspectRatio }
}

const baseEventClasses = 'border-none text-white'

const createNewCycle = [
  {
    value: 'new',
    label: 'Create New Ad Cycle',
  },
]

export interface AdSchedulerProps extends ComponentProps<'div'> {}

export const AdScheduler = ({ className = '', ...props }: AdSchedulerProps) => {
  const nhost = useNhostClient()
  const calRef = useRef<FullCalendar>(null)

  const goTo = useClickLink()

  const { adId, cycleId } = useParams()
  const createCycleMode = cycleId === 'new'

  const [dimensions, setDimensions] = useState(() => getDimensions())

  useEffect(() => {
    setDimensions(getDimensions())
  }, [])

  useEventListener('resize', (e) => {
    setDimensions(getDimensions())
  })

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, refetch, loading } = useAuthQuery(ALL_AD_CYCLES)

  const { ad, cycle, allCycles, adSelectList, cycleSelectList } = useMemo(() => {
    const ad = data?.ad.find((a) => `${a.id}` === adId)
    const cycle = ad?.ad_cycles.find((a) => `${a.id}` === cycleId)

    const newCycle: EventInput[] = createCycleMode
      ? [
          {
            start: startDate,
            end: endDate,
            title: `(New Ad Cycle) ${ad?.name}`,
            classNames: `bg-green-500 ${baseEventClasses}`,
            id: 'new',
          },
        ]
      : []

    const allCycles: EventInput[] = newCycle.concat(
      data?.ad.flatMap((ad) =>
        ad.ad_cycles.map<EventInput>((ac) => ({
          title: `${ad.name} (${adSizeDisplayMap[ad.size]})`,
          ...eventStyles(ad, ac, adId, cycleId),
          start: cycleId === `${ac.id}` ? startDate : ac.starts_at,
          end: cycleId === `${ac.id}` ? endDate : ac.ends_at,
          id: `${ad.id}/${ac.id}`,
          isSelected: true,
        })),
      ) ?? [],
    )

    const adSelectList =
      data?.ad.map((a) => ({ value: `${a.id}`, label: `${a.name} (${adSizeDisplayMap[a.size]})` })) ?? []
    const cycleSelectList = createNewCycle.concat(
      ad?.ad_cycles.map((a) => ({
        value: `${a.id}`,
        label: `${formatDate(a.starts_at, { dateStyle: 'medium' })} – ${formatDate(a.ends_at, {
          dateStyle: 'medium',
        })}`,
      })) ?? [],
    )

    return {
      allCycles,
      ad,
      cycle,
      adSelectList,
      cycleSelectList,
    }
  }, [adId, cycleId, data, endDate, startDate])

  useEffect(() => {
    if (!cycle) {
      setStartDate('')
      setEndDate('')

      if (cycleId !== 'new' && !loading) {
        goTo(`/ads/scheduler/${adId || ''}`)
      }
    } else {
      setStartDate(convertToDisplayableDate(cycle.starts_at))
      setEndDate(convertToDisplayableDate(cycle.ends_at))
    }
  }, [cycle, loading])

  useEffect(() => {
    if (ad && !ad.ad_cycles.length) {
      goTo(`/ads/scheduler/${ad.id}/new`)
    }
  }, [ad])

  // const { data: cycleStatsData } = useAuthQuery()

  const [adWidth, adHeight] = ad?.size.split('x').map(Number) ?? []

  const onSave = async (start: string, end: string, id?: string, revert?: () => void) => {
    const res = await (id === 'new'
      ? nhost.graphql.request(CREATE_AD_CYCLE, {
          object: {
            ad_id: Number(adId),
            starts_at: convertToSavableDate(start),
            ends_at: convertToSavableDate(end),
          },
        })
      : nhost.graphql.request(UPDATE_AD_CYCLE, {
          id: Number(id),
          set: {
            starts_at: convertToSavableDate(start),
            ends_at: convertToSavableDate(end),
          },
        })
    ).catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (
      res instanceof Error ||
      (res.error && !['constraint-violation', 'permission-error'].includes(res.error[0]?.extensions?.code))
    ) {
      toast.error({ message: 'An unexpected Error occurred.' })
      revert?.()
      return console.error(res)
    }

    if (res.error?.[0].extensions.code === 'constraint-violation') {
      revert?.()
      return toast.warn({
        message: 'Cycle Conflict',
        description: 'Two cycles for the same ad cannot overlap.',
      })
    }

    if (res.error?.[0].extensions.code === 'permission-error') {
      revert?.()
      return toast.warn({
        message: 'Dates Out of Order',
        description: 'End Date must follow Start Date.',
      })
    }

    toast.success({ message: id === 'new' ? 'Advertising Cycle Scheduled!' : 'Changes Saved!' })

    refetch()
    if (id === 'new') {
      goTo(`/ads/scheduler/${adId}/${(res as any).data.insert_ad_cycle_one.id}`)
    }
  }

  return (
    <div className={`${className} grid h-[calc(100vh-122px)] md:grid-cols-[24rem_auto]`} {...props}>
      <div className="h-full w-full overflow-y-auto px-2 py-8">
        <div className="mx-auto flex max-w-96 flex-col justify-center pb-4">
          <Select items={adSelectList} value={adId} label="Ad" onValueChange={(v) => goTo(`/ads/scheduler/${v}`)} />
          {ad && (
            <>
              <Select
                label="Advertising Cycle"
                items={cycleSelectList}
                value={cycleId}
                onValueChange={(v) => {
                  goTo(`/ads/scheduler/${adId}/${v}`)
                  const startDate = ad.ad_cycles.find((c) => `${c.id}` === v)?.starts_at
                  if (v !== 'new' && startDate) {
                    calRef.current?.getApi().gotoDate(startDate)
                  }
                }}
              />
              <div className="flex w-full flex-col gap-4">
                <p className="text-sm text-gray-600">
                  Click on the calendar or select dates below. Precise start and end times are at midnight HST.
                </p>
                <TextInput
                  type="date"
                  max={endDate}
                  label="Start"
                  value={startDate}
                  collapseDescriptionArea
                  onChange={(e) => {
                    const val = e.target.value
                    setStartDate(val)

                    if (val) {
                      calRef.current?.getApi().gotoDate(val)
                    }
                  }}
                />
                <TextInput
                  type="date"
                  min={startDate}
                  label="End"
                  description="End date is exclusive, meaning the cycle ends at the beginning of this day."
                  value={endDate}
                  onChange={(e) => {
                    const val = e.target.value
                    setEndDate(val)

                    if (val) {
                      calRef.current?.getApi().gotoDate(val)
                    }
                  }}
                />
                <div className="flex justify-center">
                  {!createCycleMode && (
                    <Button
                      variant="dismissive"
                      className="mr-auto text-red-500"
                      PreIcon={TrashIcon}
                      onClick={async (e) => {
                        if (
                          cycle?.starts_at > new Date().toISOString() ||
                          confirm(
                            'This will permanently delete this cycle and all of the statistics from the period the ad ran. Are you sure you want to continue?',
                          )
                        ) {
                          const res = await nhost.graphql
                            .request(DELETE_AD_CYCLE, { id: Number(cycleId) })
                            .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                          if (res instanceof Error || res.error) {
                            console.error(res)
                            return toast.error({ message: 'An unexpected Error occurred' })
                          }

                          toast.success({ message: 'Advertising Cycle Removed' })
                          refetch()
                        }
                      }}
                    >
                      Remove Cycle
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    disabled={
                      !endDate ||
                      !startDate ||
                      startDate >= endDate ||
                      (!createCycleMode &&
                        startDate === convertToDisplayableDate(cycle?.starts_at) &&
                        endDate === convertToDisplayableDate(cycle?.ends_at))
                    }
                    onClick={async (e) => {
                      onSave(startDate, endDate, cycleId)
                    }}
                    PreIcon={createCycleMode ? RocketLaunchIcon : CheckIcon}
                  >
                    {createCycleMode ? 'Create' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        {cycle && cycle.starts_at < new Date().toISOString() && (
          <>
            <hr className="mx-4 my-8 border-gray-300" />
            <div className="flex-center flex-col">
              <h4>Stats</h4>
              <p>Impressions: {cycle.loads}</p>
            </div>
          </>
        )}
        {ad && (
          <>
            <hr className="mx-4 my-8 border-gray-300" />
            <div className="flex-center flex-col gap-2">
              <p>
                Links to:{' '}
                <NavLink
                  className="text-blue-500 hover:text-blue-400 focus:underline focus:outline-none"
                  to={ad.link}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ad.link}
                </NavLink>
              </p>
              <span>{adSizeDisplayMap[ad.size]}</span>
              <AdPreview imageUrl={ad?.image} width={adWidth} height={adHeight} />
              <NavLink to={`/ads/manage/${adId}`} tabIndex={-1}>
                <Button PreIcon={PencilSquareIcon}>Edit Ad Content</Button>
              </NavLink>
            </div>
          </>
        )}
      </div>
      <div className="hidden h-full p-1 md:block" style={{ width: dimensions.width, height: dimensions.height }}>
        <FullCalendar
          ref={calRef}
          plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridYear"
          aspectRatio={dimensions.aspectRatio}
          events={allCycles}
          defaultAllDay
          timeZone="UTC"
          editable
          selectable
          eventResizableFromStart
          eventClick={(e) => {
            if (e.event.id === 'new') return
            goTo(`/ads/scheduler/${e.event.id}`, e.jsEvent as any)
          }}
          eventChange={async (e) => {
            const newStart = convertToDisplayableDate(e.event.start)
            const newEnd = convertToDisplayableDate(e.event.end)

            if (e.event.id === 'new') {
              if (newStart) setStartDate(newStart)
              if (newEnd) setEndDate(newEnd)
              return
            }

            onSave(newStart, newEnd, e.event.id.split('/')[1], e.revert)
          }}
          eventClassNames={(e) => {
            return e.isResizing ? '[&>.fc-event-main]:bg-green-500' : ''
          }}
          dateClick={(e) => {
            if (createCycleMode) {
              const newDate = convertToDisplayableDate(e.date)

              if (!startDate) {
                return setStartDate(newDate)
              }

              const beforeStart = startDate > newDate

              if (beforeStart && !endDate) {
                setEndDate(startDate)
                setStartDate(newDate)
              } else if (beforeStart) {
                setStartDate(newDate)
              } else {
                setEndDate(convertToDisplayableDate(new Date(new Date(newDate).valueOf() + 1000 * 60 * 60 * 24)))
              }
            }
          }}
        />
      </div>
    </div>
  )
}

function eventStyles(
  ad: GetAdCyclesQuery['ad'][number],
  adCycle: GetAdCyclesQuery['ad'][number]['ad_cycles'][number],
  adId?: string,
  cycleId?: string,
) {
  let bgClass = 'bg-gray-400'
  let opacityClass = 'opacity-100'

  if (!adId || `${ad.id}` === adId) {
    bgClass = 'bg-primary-500'
  }

  if (cycleId && `${adCycle.id}` !== cycleId) {
    opacityClass = 'opacity-50'
  }

  return { classNames: `${baseEventClasses} ${bgClass} ${opacityClass}` }
}

function convertToDisplayableDate(d: string | Date | null) {
  if (!d) {
    return ''
  }

  const strD = typeof d === 'string' ? d : d.toISOString()

  return strD.split('T')[0]
}

function convertToSavableDate(d: string) {
  return `${d}T10:00:00.000+00:00`
}
