import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, fill, htmlElement, resource } = props
  // When fill is true the caller already provides a positioned container.
  // Wrapping in an extra <div> would make it the direct (unpositioned) parent
  // of <NextImage fill>, triggering the "parent must have position" warning.
  // Default to null (Fragment) for fill images, 'div' otherwise.
  const resolvedElement = htmlElement !== undefined ? htmlElement : fill ? null : 'div'

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = (resolvedElement as any) || Fragment

  return (
    <Tag
      {...(resolvedElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
