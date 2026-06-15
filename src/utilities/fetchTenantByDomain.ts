import type { Tenant } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { headers } from 'next/headers'

/**
 * Resolves a Tenant document from a host header value.
 *
 * Uses React `cache()` so multiple calls within the same server render
 * (e.g. layout + page component) share a single DB round-trip.
 *
 * When TENANT_SLUG_OVERRIDE_ENABLED=true and domain lookup fails for a value
 * that contains no dots (i.e. it looks like a slug, not a hostname), a second
 * lookup by the `slug` field is attempted. This makes page components work
 * transparently when params.tenant is a slug injected by the staging override
 * middleware instead of the real domain.
 *
 * `overrideAccess: true` is intentional — this is an internal infrastructure
 * lookup used for routing, not a user-facing query.
 */
export const fetchTenantByDomain = cache(async (domain: string): Promise<Tenant | null> => {
  const payload = await getPayload({ config: configPromise })
  const domainClean = domain.split(':')[0]

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domainClean } },
    overrideAccess: true,
    depth: 1,
    limit: 1,
  })

  if (docs[0]) return docs[0]

  // Staging slug fallback: if the value has no dots it can't be a real domain,
  // so try matching by slug (set by the ?tenant= override middleware).
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED === 'true' && !domainClean.includes('.')) {
    const { docs: slugDocs } = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: domainClean } },
      overrideAccess: true,
      depth: 1,
      limit: 1,
    })
    return slugDocs[0] || null
  }

  return null
})

/**
 * Resolves a Tenant document by its slug field.
 *
 * Used by the staging tenant-slug override flow when `x-tenant-slug` header
 * is present on the request (set by middleware from the `?tenant=` query param).
 */
export const fetchTenantBySlug = cache(async (slug: string): Promise<Tenant | null> => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    overrideAccess: true,
    depth: 1,
    limit: 1,
  })

  return docs[0] || null
})

/**
 * Resolves the current tenant for a server component, with staging override
 * support. When TENANT_SLUG_OVERRIDE_ENABLED=true and the request carries an
 * `x-tenant-slug` header (injected by middleware from `?tenant=`), lookup is
 * done by slug. Otherwise falls back to the standard domain lookup.
 *
 * Use this wherever the caller reads the host header itself and passes it to
 * fetchTenantByDomain — layout, sitemap, robots, and content blocks.
 * Page components that use params.tenant can keep using fetchTenantByDomain
 * directly; the slug fallback in that function handles them.
 */
export const resolveTenant = async (host: string): Promise<Tenant | null> => {
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED === 'true') {
    const headersList = await headers()
    const slugOverride = headersList.get('x-tenant-slug')
    if (slugOverride) {
      return fetchTenantBySlug(slugOverride)
    }
  }
  return fetchTenantByDomain(host)
}
