import React, { ComponentProps } from 'react'

const sources = {
  youtube: 'https://youtube.com/embed/',
  vimeo: 'https://player.vimeo.com/video/',
  dailymotion: 'https://www.dailymotion.com/embed/video/',
}

export interface VideoPlayerProps extends ComponentProps<'iframe'> {
  videoDetails: {
    url?: string
    id: string
    type: 'youtube' | 'vimeo' | 'dailymotion'
  }
}

export const VideoPlayer = ({ className = '', videoDetails, ...props }: VideoPlayerProps) => {
  const { id, type } = videoDetails

  return (
    <iframe
      key={id}
      width="560"
      height="315"
      src={`${sources[type]}${id}`}
      title={`${type} video player`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  )
}
