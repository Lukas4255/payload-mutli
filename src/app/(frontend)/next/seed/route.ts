import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import config from '@payload-config'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

export async function POST(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  // Seeding creates and resets a tenant, so only super-admins may run it
  if (!user || !isSuperAdmin(user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  // The demo tenant is served from the host the seed was triggered on
  const tenantDomain = requestHeaders.get('host')?.split(':')[0]

  if (!tenantDomain) {
    return new Response('Unable to determine the host to seed.', { status: 400 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq, tenantDomain })

    return Response.json({ success: true })
  } catch {
    return new Response('Error seeding data.', { status: 500 })
  }
}
