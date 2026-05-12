'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  type?: 'custom' | 'reference' | 'block' | null
  url?: string | null
  blockType?: string | null
  blockIndex?: number | null
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
    blockType,
    blockIndex,
  } = props

  const pathname = usePathname()
  const router = useRouter()

  if (type === 'block') {
    const scrollId = `block-${blockType}-${blockIndex ?? 0}`

    const handleBlockClick = (e: React.MouseEvent) => {
      e.preventDefault()
      const el = document.getElementById(scrollId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(null, '', pathname)
      } else {
        router.push(`/?scrollTo=${scrollId}`)
      }
    }

    const content = label ?? children

    if (appearance === 'inline') {
      return (
        <a href="/" className={cn(className)} onClick={handleBlockClick}>
          {content}
        </a>
      )
    }

    const size = appearance === 'link' ? 'clear' : sizeFromProps

    return (
      <Button asChild className={className} size={size} variant={appearance}>
        <a href="/" onClick={handleBlockClick}>
          {content}
        </a>
      </Button>
    )
  }

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
