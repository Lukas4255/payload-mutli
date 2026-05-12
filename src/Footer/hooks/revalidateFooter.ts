import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  // doc.tenant is either the numeric ID (not populated) or the full Tenant object
  const tenantId = typeof doc.tenant === 'number' ? doc.tenant : doc.tenant?.id

  if (tenantId) {
    payload.logger.info(`Revalidating footer for tenant ${tenantId}`)
    revalidateTag(`global_footer_${tenantId}`, 'max')
  } else {
    payload.logger.warn('revalidateFooter: could not determine tenant ID from doc')
  }

  return doc
}
