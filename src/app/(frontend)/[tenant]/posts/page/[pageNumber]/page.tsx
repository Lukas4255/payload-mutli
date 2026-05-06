import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export const revalidate = 600

const POSTS_PER_PAGE = 12

type Args = {
  params: Promise<{
    tenant: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { tenant: tenantDomain, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) notFound()

  const tenant = await fetchTenantByDomain(tenantDomain)
  if (!tenant) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: sanitizedPageNumber,
    overrideAccess: false,
    where: {
      'tenant.id': {
        equals: tenant!.id,
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

  if (!posts.docs.length) notFound()

  return (
    <div className="pb-24">
      <PageClient />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-32 pb-16 text-center">
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

      {/* ── Post count ───────────────────────────────────────── */}
      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={POSTS_PER_PAGE}
          totalDocs={posts.totalDocs}
        />
      </div>

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
  const { pageNumber } = await paramsPromise
  return {
    title: `Artikelen — pagina ${pageNumber}`,
    description: 'Lees de laatste berichten, nieuws en verhalen.',
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

  const pages: { pageNumber: string }[] = []
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
