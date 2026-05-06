import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  params: Promise<{ tenant: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function Page({ params, searchParams: searchParamsPromise }: Args) {
  const { tenant: tenantDomain } = await params
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // Resolve tenant — memoised via React cache() so this hits the DB only once
  // per request even though the layout also calls fetchTenantByDomain.
  const tenant = await fetchTenantByDomain(tenantDomain)
  if (!tenant) return null

  const textConditions = query
    ? [
        { title: { like: query } },
        { 'meta.title': { like: query } },
        { 'meta.description': { like: query } },
        { slug: { like: query } },
      ]
    : []

  const results = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    pagination: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    where: {
      and: [
        // Always scope to this tenant
        { 'tenant.id': { equals: tenant.id } },
        // Add text search conditions when a query is present
        ...(textConditions.length ? [{ or: textConditions }] : []),
      ],
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="sr-only">Zoeken</h1>
          <Search />
        </div>
      </div>

      {results.docs.length > 0 ? (
        <CollectionArchive posts={results.docs as CardPostData[]} />
      ) : (
        <div className="container">
          {query ? 'Geen resultaten gevonden.' : 'Typ een zoekterm om te beginnen.'}
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Zoeken',
  }
}
