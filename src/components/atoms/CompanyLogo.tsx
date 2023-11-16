import React, { SVGProps } from 'react'
// @ts-ignore
import PrimeSightsSVG from '../../images/primesights.svg'
// @ts-ignore
import WavesSVG from '../../images/primesights-mountain-waves.svg'
// @ts-ignore
import SkySVG from '../../images/primesights-sky.svg'
import clsx from 'clsx'

export interface CompanyLogoProps extends SVGProps<SVGElement> {
  type?: 'full' | 'waves' | 'sky'
  colorClass?: string
}

export const CompanyLogo = ({
  className,
  colorClass = 'text-primary-300',
  type = 'full',
  ...props
}: CompanyLogoProps) => {
  const Component = getLogo(type)

  return <Component className={clsx(className, colorClass, 'fill-current')} {...props} />
}

function getLogo(type = 'full') {
  switch (type) {
    case 'waves':
      return WavesSVG
    case 'sky':
      return SkySVG
    case 'full':
    default:
      return PrimeSightsSVG
  }
}
