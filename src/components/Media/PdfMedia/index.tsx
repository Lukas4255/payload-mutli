'use client'

import React from 'react'

import type { Props as MediaProps } from '../types'

import { cn } from 'src/utilities/cn'
import { getClientSideURL } from '@/utilities/getURL'

export const PdfMedia: React.FC<MediaProps> = (props) => {
  const { className, resource } = props

  if (!resource || typeof resource !== 'object') return null

  const { url, filename } = resource

  const src = url?.startsWith('/') ? url : `${getClientSideURL()}${url}`

  return (
    <div className={cn('w-full', className)}>
      <iframe
        src={src}
        title={filename || 'PDF document'}
        className="w-full rounded-[0.8rem] border border-border"
        style={{ minHeight: '80vh' }}
      />
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm underline opacity-70 hover:opacity-100"
      >
        Open PDF in new tab
      </a>
    </div>
  )
}
