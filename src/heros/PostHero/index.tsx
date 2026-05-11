import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { calculateReadTime } from '@/utilities/calculateReadTime'
import { formatDateTime } from '@/utilities/formatDateTime'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, meta: { image: metaImage } = {}, title, content, publishedAt } = post

  const readTime = calculateReadTime(content as Record<string, any>)

  return (
    <div className="container max-w-[52rem] mx-auto pt-8 pb-10">
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Terug naar blog
      </Link>

      <h1 className="text-4xl md:text-5xl font-heading text-center mb-5 leading-tight">
        {title}
      </h1>

      <div className="flex items-center justify-center gap-4 mb-8">
        {categories && categories.length > 0 && (
          <div className="flex gap-2">
            {categories.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                return (
                  <span
                    key={index}
                    className="text-xs font-medium px-3 py-1 rounded-full border border-foreground/20 text-foreground/70"
                  >
                    {category.title ?? 'Untitled'}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-foreground/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{readTime} min. leestijd</span>
          {publishedAt && (
            <>
              <span className="text-foreground/30">·</span>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </>
          )}
        </div>
      </div>

      {metaImage && typeof metaImage !== 'string' && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
          <Media fill imgClassName="object-cover" resource={metaImage} />
        </div>
      )}
    </div>
  )
}
