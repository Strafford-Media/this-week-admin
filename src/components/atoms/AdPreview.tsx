import { toast } from '@8thday/react'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'

export interface AdPreviewProps extends ComponentProps<'div'> {
  width: number
  height: number
  imageUrl: string
  onValidate?(valid: boolean): void
}

const boxes = Array(8).fill(1)

export const AdPreview = ({ className = '', width, height, imageUrl, onValidate, ...props }: AdPreviewProps) => {
  return (
    <div className={`${className} relative flex`} style={{ width, minHeight: height }} {...props}>
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
        <div style={{ height, width }} className="ad-preview-ad border border-primary-500"></div>
        {boxes.map((_, i) => (
          <div key={i} className="bg-gray-400/60"></div>
        ))}
      </div>
    </div>
  )
}
