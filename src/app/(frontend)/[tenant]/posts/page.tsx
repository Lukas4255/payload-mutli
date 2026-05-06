import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export const revalidate = 600

type Args = {
  params: Promise<{
    tenant: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { tenant: tenantDomain } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const tenant = await fetchTenantByDomain(tenantDomain)
  if (!tenant) return null

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      'tenant.id': {
        equals: tenant.id,
      },
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      readTime: true,
      publishedAt: true,
    },
  })

  return (
    <div className="pb-24">
      <PageClient />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-12 pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
            <span aria-hidden>•</span>
            Nieuws &amp; Verhalen
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Alle artikelen
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Lees de laatste berichten, nieuws en verhalen van ons.
          </p>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <CollectionArchive posts={posts.docs} />

      {/* ── Pagination ───────────────────────────────────────── */}
      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  return {
    title: `Artikelen`,
    description: 'Lees de laatste berichten, nieuws en verhalen.',
  }
}
