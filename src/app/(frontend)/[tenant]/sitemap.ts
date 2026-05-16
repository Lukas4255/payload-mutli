import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await fetchTenantByDomain(host)
  if (!tenant) return []

  const baseUrl = `https://${tenant.domain}`
  const payload = await getPayload({ config: configPromise })

  const tenantFilter = { 'tenant.id': { equals: tenant.id } }

  const [pagesResult, postsResult, vacanciesResult] = await Promise.all([
    payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      select: { slug: true, updatedAt: true },
      where: tenantFilter,
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      select: { slug: true, updatedAt: true },
      where: tenantFilter,
    }),
    payload.find({
      collection: 'vacancies',
      draft: false,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      select: { slug: true, updatedAt: true },
      where: tenantFilter,
    }),
  ])

  const entries: MetadataRoute.Sitemap = []

  // Home page
  const homePage = pagesResult.docs.find((p) => p.slug === 'home')
  entries.push({
    url: baseUrl,
    lastModified: homePage?.updatedAt ? new Date(homePage.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  // Other pages (exclude home — already added as root URL)
  for (const page of pagesResult.docs) {
    if (page.slug === 'home') continue
    entries.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Posts listing page (only if there are posts)
  if (postsResult.docs.length > 0) {
    entries.push({
      url: `${baseUrl}/posts`,
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  // Individual posts
  for (const post of postsResult.docs) {
    if (!post.slug) continue
    entries.push({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  // Vacancies
  for (const vacancy of vacanciesResult.docs) {
    if (!vacancy.slug) continue
    entries.push({
      url: `${baseUrl}/vacatures/${vacancy.slug}`,
      lastModified: new Date(vacancy.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return entries
}
