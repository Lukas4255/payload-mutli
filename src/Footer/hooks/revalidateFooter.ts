import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating footer`)

  revalidateTag('Collection_footer', 'max')

  return doc
}
