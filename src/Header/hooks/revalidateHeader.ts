import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateHeader: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  // doc.tenant is either the numeric ID (not populated) or the full Tenant object
  const tenantId = typeof doc.tenant === 'number' ? doc.tenant : doc.tenant?.id

  if (tenantId) {
    payload.logger.info(`Revalidating header for tenant ${tenantId}`)
    revalidateTag(`global_header_${tenantId}`, 'max')
  } else {
    payload.logger.warn('revalidateHeader: could not determine tenant ID from doc')
  }

  return doc
}
