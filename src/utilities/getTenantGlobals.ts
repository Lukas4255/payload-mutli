import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['collections']

async function getGlobal(collection: Global, depth = 0, tenantId: number) {
  const payload = await getPayload({ config: configPromise })

  if (!tenantId) return null

  const { docs } = await payload.find({
    collection,
    where: { 'tenant.id': { equals: tenantId } },
    overrideAccess: true,
    depth,
    limit: 1,
  })

  return docs[0] || null
}

/**
 * Returns an unstable_cache function scoped to both the collection and the tenant.
 *
 * The cache key includes `tenantId` so that different tenants never share a
 * cached entry. The tag follows the same pattern so that revalidate hooks can
 * bust only the affected tenant's cache instead of all tenants at once.
 */
export const getTenantCachedGlobal = (collection: Global, depth = 0, tenantId: number) =>
  unstable_cache(async () => getGlobal(collection, depth, tenantId), [collection, String(tenantId)], {
    tags: [`global_${collection}_${tenantId}`],
  })