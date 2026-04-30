import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateHeader: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating header`)

  revalidateTag('Collection_header', 'max')

  return doc
}