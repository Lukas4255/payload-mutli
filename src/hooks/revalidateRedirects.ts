import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  revalidateTag('redirects')

  if (doc.from) {
    const path = doc.from.startsWith('/') ? doc.from : `/${doc.from}`
    payload.logger.info(`Revalidating path: ${path}`)
    revalidatePath(path)
  }

  return doc
}
