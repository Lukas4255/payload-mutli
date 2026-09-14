import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { resolveTenant } from '@/utilities/fetchTenantByDomain'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await resolveTenant(host)
  if (!tenant) {
    return { rules: { disallow: '/' } }
  }

  const baseUrl = `https://${tenant.domain}`

  return {
    rules: {
      userAgent: '*',
      // Allow /api/media/ so Google can fetch the tenant favicon (served at
      // /api/media/file/...). Without this, Google falls back to the root
      // /favicon.ico (the Payload default) in search results.
      allow: ['/', '/api/media/'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
