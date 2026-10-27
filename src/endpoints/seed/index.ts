import type { CollectionSlug, Payload, PayloadRequest, File, Where } from 'payload'
import type { Tenant } from '@/payload-types'
import path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { image3 } from './image-3'
import { image4 } from './image-4'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { post4 } from './post-4'

// The seed only ever touches the demo tenant, so it can't wipe content belonging to real tenants.
const demoTenantSlug = 'demo'

// Tenant-scoped collections that are cleared for the demo tenant before seeding.
// Categories are shared between tenants, so they are reused by title instead of deleted.
const tenantCollections: CollectionSlug[] = [
  'search',
  'posts',
  'pages',
  'form-submissions',
  'forms',
  'media',
  'header',
  'footer'
]

const seedDirectory = path.dirname(fileURLToPath(import.meta.url))

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.webp': 'image/webp',
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const ext = path.extname(new URL(url).pathname).toLowerCase()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: mimeTypes[ext] || 'application/octet-stream',
    size: data.byteLength,
  }
}

async function loadSeedFile(filename: string, outputName = filename): Promise<File> {
  const filePath = path.join(seedDirectory, filename)
  const data = await fs.readFile(filePath)
  const ext = path.extname(filename).toLowerCase()

  return {
    name: outputName,
    data,
    mimetype: mimeTypes[ext] || 'application/octet-stream',
    size: data.byteLength,
  }
}

// Finds or creates the demo tenant and points it at `domain`, refusing to take over a domain
// that already belongs to another tenant.
async function getDemoTenant(payload: Payload, domain: string): Promise<Tenant> {
  const {
    docs: [domainOwner]
  } = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domain } },
    depth: 0,
    limit: 1
  })

  if (domainOwner && domainOwner.slug !== demoTenantSlug) {
    throw new Error(
      `Refusing to seed: domain "${domain}" belongs to tenant "${domainOwner.name}". Seed from a host that is not in use by a real tenant.`
    )
  }

  const {
    docs: [demoTenant]
  } = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: demoTenantSlug } },
    depth: 0,
    limit: 1
  })

  if (!demoTenant) {
    return payload.create({
      collection: 'tenants',
      data: { name: 'Demo', slug: demoTenantSlug, domain }
    })
  }

  if (demoTenant.domain !== domain) {
    return payload.update({
      id: demoTenant.id,
      collection: 'tenants',
      data: { domain }
    })
  }

  return demoTenant
}

async function clearDocs(payload: Payload, collection: CollectionSlug, where: Where) {
  // Bulk deletes report per-document failures instead of throwing
  const { errors } = await payload.delete({ collection, where })

  if (errors.length) {
    throw new Error(
      `Failed to clear ${collection}: ${errors.map((error) => error.message).join(', ')}`
    )
  }
}

async function findOrCreateCategory(payload: Payload, title: string) {
  const {
    docs: [existing]
  } = await payload.find({
    collection: 'categories',
    where: { title: { equals: title } },
    depth: 0,
    limit: 1
  })

  return existing ?? payload.create({ collection: 'categories', data: { title } })
}

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
  tenantDomain,
}: {
  payload: Payload
  req: PayloadRequest
  // Domain the demo tenant is served from, usually the host the seed was triggered on
  tenantDomain: string
}): Promise<void> => {
  const previousDisableSearchSync = process.env.DISABLE_SEARCH_SYNC

  try {
    const useLocalSeedMedia = process.env.USE_LOCAL_SEED_MEDIA === 'true'
    process.env.DISABLE_SEARCH_SYNC = 'true'
    req.context.disableSearchSync = true
    payload.logger.info('Seeding database...')

    payload.logger.info(`- Resolving demo tenant for ${tenantDomain}...`)

    const tenant = await getDemoTenant(payload, tenantDomain)
    const tenantID = tenant.id

    // Clear the demo tenant's previous seed content, including its media files
    payload.logger.info(`- Clearing demo tenant content...`)

    // Comments require their post, so the ones on demo posts have to go before the posts do
    await clearDocs(payload, 'comments', { 'post.tenant': { equals: tenantID } })

    for (const collection of tenantCollections) {
      await clearDocs(payload, collection, { tenant: { equals: tenantID } })
    }

    payload.logger.info(`- Seeding demo author and user...`)

    await payload.delete({
      collection: 'users',
      where: {
        email: {
          equals: 'demo-author@payloadcms.com'
        }
      }
    })

    const demoAuthor = await payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@payloadcms.com',
        password: 'password'
      }
    })

    let demoAuthorID: number | string = demoAuthor.id

    payload.logger.info(`- Seeding media...`)

    // Load all files first
    const [image1File, image2File, image3File, hero1File, vendureFile] = useLocalSeedMedia
      ? await Promise.all([
          loadSeedFile('image-post1.webp'),
          loadSeedFile('image-post2.webp'),
          loadSeedFile('image-post3.webp'),
          loadSeedFile('image-hero1.webp'),
          loadSeedFile('image-post3.webp', 'image-post4.webp'),
        ])
      : await Promise.all([
          fetchFileByURL(
            'https://res.cloudinary.com/hczpmiapo/image/upload/v1732740471/Static%20assets/graphics/payload%203/payload-cover_ygdcoq.png',
          ),
          fetchFileByURL(
            'https://res.cloudinary.com/hczpmiapo/image/upload/v1732740471/Static%20assets/graphics/payload%203/payload-2-cover_ortrhb.png',
          ),
          fetchFileByURL(
            'https://res.cloudinary.com/hczpmiapo/image/upload/v1732743964/Medusa-2.0-official-release-deploy-on-railway-cover_a7knvp.png',
          ),
          fetchFileByURL(
            'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
          ),
          fetchFileByURL(
            'https://res-1.cloudinary.com/hczpmiapo/image/upload/q_auto/v1/ghost-blog-images/vendure-cover.png',
          ),
        ])

    payload.logger.info(`- Creating media documents...`)

    // Create media documents
    const [image1Doc, image2Doc, image3Doc, imageHomeDoc, image4Doc] = await Promise.all([
      payload.create({
        collection: 'media',
        data: { ...image1, tenant: tenantID },
        file: image1File
      }),
      payload.create({
        collection: 'media',
        data: { ...image2, tenant: tenantID },
        file: image2File
      }),
      payload.create({
        collection: 'media',
        data: { ...image3, tenant: tenantID },
        file: image3File
      }),
      payload.create({
        collection: 'media',
        data: { ...image2, tenant: tenantID },
        file: hero1File
      }),
      payload.create({
        collection: 'media',
        data: { ...image4, tenant: tenantID },
        file: vendureFile
      })
    ])

    let image1ID: number | string = image1Doc.id
    let image2ID: number | string = image2Doc.id
    let image3ID: number | string = image3Doc.id
    let image4ID: number | string = image4Doc.id
    let imageHomeID: number | string = imageHomeDoc.id

    if (payload.db.defaultIDType === 'text') {
      image1ID = `"${image1Doc.id}"`
      image2ID = `"${image2Doc.id}"`
      image3ID = `"${image3Doc.id}"`
      image4ID = `"${image4Doc.id}"`
      imageHomeID = `"${imageHomeDoc.id}"`
      demoAuthorID = `"${demoAuthorID}"`
    }

    // Categories are shared between tenants, so reuse existing ones
    payload.logger.info(`- Seeding categories...`)
    const [technologyCategory, newsCategory, financeCategory] = await Promise.all([
      findOrCreateCategory(payload, 'Technology'),
      findOrCreateCategory(payload, 'News'),
      findOrCreateCategory(payload, 'Finance')
    ])

    await Promise.all([
      findOrCreateCategory(payload, 'Design'),
      findOrCreateCategory(payload, 'Software'),
      findOrCreateCategory(payload, 'Engineering')
    ])

    // Create posts
    payload.logger.info(`- Seeding posts...`)

    // Create posts without related posts first.
    // Keep this sequential to avoid race conditions in search sync hooks.
    const post1Doc = await payload.create({
      collection: 'posts',
      data: JSON.parse(
        JSON.stringify({ ...post1, categories: [technologyCategory.id], tenant: tenantID })
          .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
          .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
      )
    })

    const post2Doc = await payload.create({
      collection: 'posts',
      data: JSON.parse(
        JSON.stringify({ ...post2, categories: [newsCategory.id], tenant: tenantID })
          .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
          .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
      )
    })

    const post3Doc = await payload.create({
      collection: 'posts',
      data: JSON.parse(
        JSON.stringify({ ...post3, categories: [financeCategory.id], tenant: tenantID })
          .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
          .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
      )
    })

    const post4Doc = await payload.create({
      collection: 'posts',
      data: JSON.parse(
        JSON.stringify({ ...post4, categories: [technologyCategory.id], tenant: tenantID })
          .replace(/"\{\{IMAGE_1\}\}"/g, String(image4ID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
          .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
      )
    })

    // Clear any search documents synced for the demo tenant's new posts
    await payload.delete({
      collection: 'search',
      where: {
        tenant: {
          equals: tenantID
        }
      }
    })
    // Update related posts in order.
    // This is non-critical seed data, so do not fail the entire seed if it errors.
    payload.logger.info(`- Updating related posts...`)
    try {
      await payload.update({
        id: post1Doc.id,
        collection: 'posts',
        data: {
          relatedPosts: [post2Doc.id, post3Doc.id, post4Doc.id]
        }
      })

      await payload.update({
        id: post2Doc.id,
        collection: 'posts',
        data: {
          relatedPosts: [post1Doc.id, post3Doc.id, post4Doc.id]
        }
      })

      await payload.update({
        id: post3Doc.id,
        collection: 'posts',
        data: {
          relatedPosts: [post1Doc.id, post2Doc.id, post4Doc.id]
        }
      })

      await payload.update({
        id: post4Doc.id,
        collection: 'posts',
        data: {
          relatedPosts: [post1Doc.id, post2Doc.id, post3Doc.id]
        }
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown related posts seed error'
      payload.logger.error(`Related posts seed step failed, continuing: ${message}`)
    }
    // Create home page
    payload.logger.info(`- Seeding home page...`)

    await payload.create({
      collection: 'pages',
      data: JSON.parse(
        JSON.stringify({ ...home, tenant: tenantID })
          .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
      )
    })

    // Create contact form
    payload.logger.info(`- Seeding contact form...`)

    const contactForm = await payload.create({
      collection: 'forms',
      data: JSON.parse(JSON.stringify({ ...contactFormData, tenant: tenantID }))
    })

    let contactFormID: number | string = contactForm.id

    if (payload.db.defaultIDType === 'text') {
      contactFormID = `"${contactFormID}"`
    }

    // Create contact page
    payload.logger.info(`- Seeding contact page...`)

    const contactPage = await payload.create({
      collection: 'pages',
      data: JSON.parse(
        JSON.stringify({ ...contactPageData, tenant: tenantID }).replace(/"\{\{CONTACT_FORM_ID\}\}"/g, String(contactFormID))
      )
    })

    // Header and footer are per-tenant collections in this multi-tenant setup
    payload.logger.info(`- Seeding header...`)

    await payload.create({
      collection: 'header',
      data: {
        tenant: tenantID,
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts'
            }
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id
              }
            }
          }
        ]
      }
    })

    payload.logger.info(`- Seeding footer...`)

    await payload.create({
      collection: 'footer',
      data: {
        tenant: tenantID,
        menuItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin'
            }
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website'
            }
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/'
            }
          }
        ]
      }
    })

    payload.logger.info(' Database seeded successfully!')
  } catch (error) {
    payload.logger.error('Error seeding database:')
    payload.logger.error(error)
    throw error
  } finally {
    req.context.disableSearchSync = false

    if (previousDisableSearchSync === undefined) {
      delete process.env.DISABLE_SEARCH_SYNC
    } else {
      process.env.DISABLE_SEARCH_SYNC = previousDisableSearchSync
    }
  }
}

