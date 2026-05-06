import type { Tenant } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Resolves a Tenant document from a host header value.
 *
 * Uses React `cache()` so multiple calls within the same server render
 * (e.g. layout + page component) share a single DB round-trip.
 *
 * `overrideAccess: true` is intentional — this is an internal infrastructure
 * lookup used for routing, not a user-facing query. The Tenants collection
 * access control intentionally restricts unauthenticated REST API reads, but
 * server-side routing must always be able to resolve the current tenant.
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

  return docs[0] || null
})
