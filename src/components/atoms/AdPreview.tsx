import { toast, useEventListener } from '@8thday/react'
import React, { ComponentProps, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface AdPreviewProps extends ComponentProps<'div'> {
  width: number
  height: number
  imageUrl: string
  onValidate?(valid: boolean): void
}

const boxes = Array(8).fill(1)

export const AdPreview = ({ className = '', width, height, imageUrl, onValidate, ...props }: AdPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const rescaler = () => {
    if (!containerRef.current) return

    containerRef.current.style.transform = `scale(1)`
    const { width } = containerRef.current.getBoundingClientRect()
    const parentWidth = containerRef.current.parentElement?.getBoundingClientRect().width ?? 0

    if (width > parentWidth) {
      const updatedScale = parentWidth / (width + 50)
      setScale(updatedScale)
      containerRef.current.style.transform = `scale(${updatedScale})`
    } else {
      setScale(1)
    }
  }

  useEventListener('resize', rescaler)

  useEffect(() => {
    setTimeout(() => {
      rescaler()
    }, 0)
  }, [width])

  return (
    <div
      ref={containerRef}
      className={`${className} relative flex items-center`}
      style={{ width, minHeight: height, transform: `scale(${scale})` }}
      {...props}
    >
      <div className="flex-center h-full w-full">
        {imageUrl && (
          <img
            className="w-full max-w-full"
            src={imageUrl}
            onError={() => imageUrl && onValidate?.(false)}
            onLoad={() => onValidate?.(true)}
            alt="Ad Content"
          />
        )}
      </div>
      <div className="ad-preview-grid absolute inset-0">
        <div style={{ height, width }} className="ad-preview-ad border border-primary-500 text-sm text-white">
          {scale < 1 && (
            <span className="absolute left-0 top-0 bg-gray-500/50" style={{ padding: 4 / scale, fontSize: 14 / scale }}>
              Scale: {scale.toFixed(2).replace('0.', '')}%
            </span>
          )}
        </div>
        {boxes.map((_, i) => (
          <div key={i} className="bg-gray-400/60"></div>
        ))}
      </div>
    </div>
  )
}
