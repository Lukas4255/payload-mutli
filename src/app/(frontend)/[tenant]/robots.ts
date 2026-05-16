import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await fetchTenantByDomain(host)
  if (!tenant) {
    return { rules: { disallow: '/' } }
  }

  const baseUrl = `https://${tenant.domain}`

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
