import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { CMSLink } from '@/components/Link'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string }> = async (props) => {
  const {
    id,
    categories,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    eyebrow,
    heading,
    link,
  } = props

  const limit = limitFromProps || 3

  // Resolve the current tenant from the request host. fetchTenantByDomain is
  // memoised via React cache() so this shares the DB result with the layout.
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await fetchTenantByDomain(host)

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const whereConditions: Where[] = []
    if (tenant) whereConditions.push({ 'tenant.id': { equals: tenant.id } })
    if (flattenedCategories?.length) {
      whereConditions.push({ categories: { in: flattenedCategories } })
    }

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      overrideAccess: false,
      ...(whereConditions.length ? { where: { and: whereConditions } } : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      posts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]
    }
  }

  return (
    <section className="py-16" id={`block-${id}`}>
      <div className="container mb-10">
        {/* Header row */}
        <div className="flex items-end justify-between">
          <div>
            {eyebrow && (
              <p className="flex items-center gap-2 text-primary font-semibold mb-3">
                <span aria-hidden>•</span>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-5xl font-semibold text-foreground">{heading}</h2>
            )}
          </div>

          {link && posts.length > 3 && (
            <CMSLink
              {...link}
              appearance="inline"
              className="inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            />
          )}
        </div>
      </div>

      <CollectionArchive posts={posts} />
    </section>
  )
}
