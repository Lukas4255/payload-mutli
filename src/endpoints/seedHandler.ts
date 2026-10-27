import { type PayloadHandler } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { seed as seedScript } from '@/endpoints/seed'

export const seedHandler: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSuperAdmin(user)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const tenantDomain = req.headers.get('host')?.split(':')[0]

  if (!tenantDomain) {
    return Response.json({ error: 'Unable to determine the host to seed' }, { status: 400 })
  }

  try {
    await seedScript({ payload, req, tenantDomain })
    return Response.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    return Response.json({ error: message }, { status: 500 })
  }
}
