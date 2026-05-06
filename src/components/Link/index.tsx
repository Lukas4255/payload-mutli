'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  openInPopup?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    openInPopup,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps

  // openInPopup takes precedence over newTab
  const newTabProps = newTab && !openInPopup ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const handlePopupClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!openInPopup) return
    e.preventDefault()
    const width = 900
    const height = 700
    const left = Math.round((window.screen.width - width) / 2)
    const top = Math.round((window.screen.height - height) / 2)
    window.open(
      href,
      'cms-popup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,popup=1`,
    )
  }

  const linkProps = {
    href: href || url || '',
    onClick: openInPopup ? handlePopupClick : undefined,
    ...newTabProps,
  }

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} {...linkProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} {...linkProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
