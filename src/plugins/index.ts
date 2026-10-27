import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import type { Config, Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdmin'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    skipSync: ({ req }) =>
      process.env.DISABLE_SEARCH_SYNC === 'true' || Boolean(req.context.disableSearchSync),
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  multiTenantPlugin<Config>({
    collections: {
      // ── Content ─────────────────────────────────────────────────
      pages: {
        tenantFieldOverrides: {
          admin: { disableListColumn: false, disableListFilter: false },
        },
      },
      posts: {
        tenantFieldOverrides: {
          admin: { disableListColumn: false, disableListFilter: false },
        },
      },
      vacancies: {
        tenantFieldOverrides: {
          admin: { disableListColumn: false, disableListFilter: false },
        },
      },

      // ── Globals (per-tenant singletons) ─────────────────────────
      header: { isGlobal: true },
      footer: { isGlobal: true },

      // ── Supporting collections ───────────────────────────────────
      media: {},

      // Search index — scoped so each tenant only sees their own results
      search: {},

      // Redirects — scoped so editors only manage their own tenant's redirects
      redirects: {},

      // Forms and submissions — scoped per tenant
      forms: {},
      'form-submissions': {},
    },
    tenantsArrayField: {
      includeDefaultField: false,
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
  }),
  // MCP server at /api/mcp. Requests run as the API key's owner, so the owner's normal
  // collection access and tenant scoping still apply. Deletes are not exposed.
  mcpPlugin({
    collections: {
      pages: {
        enabled: { find: true, create: true, update: true, delete: false },
        description: 'Website pages per tenant, built from layout blocks.',
      },
      posts: {
        enabled: { find: true, create: true, update: true, delete: false },
        description: 'Blog posts per tenant with rich text content, categories and authors.',
      },
      vacancies: {
        enabled: { find: true, create: true, update: true, delete: false },
        description: 'Job vacancies per tenant.',
      },
      categories: {
        enabled: { find: true, create: true, update: true, delete: false },
        description: 'Nested post categories.',
      },
      media: {
        enabled: { find: true, create: false, update: true, delete: false },
        description: 'Uploaded images and files per tenant (alt text and captions can be updated).',
      },
      comments: {
        enabled: { find: true, create: false, update: true, delete: false },
        description: 'Post comments awaiting or having received admin approval.',
      },
      header: {
        enabled: { find: true, create: false, update: true, delete: false },
        description: 'Header navigation, one document per tenant.',
      },
      footer: {
        enabled: { find: true, create: false, update: true, delete: false },
        description: 'Footer navigation, one document per tenant.',
      },
      tenants: {
        enabled: { find: true, create: false, update: false, delete: false },
        description: 'Tenants (sites) and their domains.',
      },
    },
    // Without this the keys collection falls back to "any logged-in user", which would let
    // anyone mint a key owned by a super-admin. A key itself may never open the admin panel.
    overrideApiKeyCollection: (collection) => ({
      ...collection,
      access: {
        admin: () => false,
        create: isSuperAdminAccess,
        read: isSuperAdminAccess,
        update: isSuperAdminAccess,
        delete: isSuperAdminAccess,
        unlock: isSuperAdminAccess,
      },
    }),
  }),
]
