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
 * When TENANT_SLUG_OVERRIDE_ENABLED=true and the domain lookup finds nothing,
 * the function checks the x-tenant-slug request header (injected by middleware
 * from the ?tenant= query param) and retries by slug. This lets staging work
 * without owning the real domains — params.tenant stays as the staging hostname
 * but the tenant is resolved via the header fallback.
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

  // Staging slug fallback: when domain lookup fails and the override is enabled,
  // check the x-tenant-slug header set by middleware from ?tenant=.
  // Try/catch guards against calling headers() outside request context (build time).
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED === 'true') {
    try {
      const slugOverride = (await headers()).get('x-tenant-slug')
      if (slugOverride) {
        const { docs: slugDocs } = await payload.find({
          collection: 'tenants',
          where: { slug: { equals: slugOverride } },
          overrideAccess: true,
          depth: 1,
          limit: 1,
        })
        return slugDocs[0] || null
      }
    } catch {
      // headers() throws outside of a request context — no-op
    }
  }

  return null
})

/**
 * Resolves a Tenant document by its slug field.
 *
 * Used by resolveTenant() when the x-tenant-slug header is present.
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
 * Resolves the current tenant for a server component that reads the host
 * header directly (layout, sitemap, robots, content blocks). Checks the
 * x-tenant-slug header first when TENANT_SLUG_OVERRIDE_ENABLED=true so
 * staging requests with ?tenant= are resolved by slug rather than domain.
 *
 * Page components that receive params.tenant don't need this — the slug
 * fallback inside fetchTenantByDomain handles them automatically.
 */
export const resolveTenant = async (host: string): Promise<Tenant | null> => {
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED === 'true') {
    try {
      const slugOverride = (await headers()).get('x-tenant-slug')
      if (slugOverride) {
        return fetchTenantBySlug(slugOverride)
      }
    } catch {
      // Outside request context — fall through to domain lookup
    }
  }
  return fetchTenantByDomain(host)
}
