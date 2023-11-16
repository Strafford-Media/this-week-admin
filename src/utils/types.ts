import HomeIcon from '@heroicons/react/24/outline/HomeIcon'

export type IconType = typeof HomeIcon

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface BookingLink {
  type: 'affiliate' | 'direct'
  provider: 'fareharbor'
  companyName: string
  items: string[]
}
