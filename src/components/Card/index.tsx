'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import { Clock } from 'lucide-react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt' | 'readTime'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, title: titleFromProps } = props

  const { slug, categories, meta, title, readTime } = doc || {}
  const { image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  // Use the first category title as the pill label, fallback to 'Artikel'
  const firstCategory = Array.isArray(categories) && categories.length > 0
    ? categories[0]
    : null
  const pillLabel = (firstCategory && typeof firstCategory === 'object' && firstCategory.title)
    ? firstCategory.title
    : 'Artikel'

  return (
    <article
      className={cn('hover:cursor-pointer group', className)}
      ref={card.ref}
    >
      {/* Image — fully rounded on all corners */}
      <div className="relative w-full h-72 overflow-hidden rounded-2xl mb-5">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            fill
            resource={metaImage}
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            size="33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-2xl" />
        )}
      </div>

      {/* Content */}
      <div>
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Category pill */}
          <span className="inline-flex items-center border border-border rounded-full px-3 py-1 text-xs font-medium text-foreground">
            {pillLabel}
          </span>

          {/* Read time */}
          {readTime && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              {readTime} min. leestijd
            </span>
          )}
        </div>

        {/* Title */}
        {titleToUse && (
          <h3 className="text-foreground font-bold text-xl leading-snug">
            <Link className="hover:underline" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
      </div>
    </article>
  )
}
