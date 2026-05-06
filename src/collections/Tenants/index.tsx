import type { CollectionConfig } from 'payload'

import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdmin'
import type { User } from '@/payload-types'

// ── Helpers ─────────────────────────────────────────────────────────────────

/** All tenant IDs the user belongs to (any role). */
const memberTenantIds = (user: User | null): number[] => {
  if (!user?.tenants?.length) return []
  return user.tenants
    .map((t) => (typeof t.tenant === 'number' ? t.tenant : t.tenant?.id))
    .filter((id): id is number => typeof id === 'number')
}

/** Tenant IDs where the user holds the tenant-admin role. */
const adminTenantIds = (user: User | null): number[] => {
  if (!user?.tenants?.length) return []
  return user.tenants
    .filter((t) => t.roles?.includes('tenant-admin'))
    .map((t) => (typeof t.tenant === 'number' ? t.tenant : t.tenant?.id))
    .filter((id): id is number => typeof id === 'number')
}

// ── Collection ───────────────────────────────────────────────────────────────

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    /**
     * Super-admins see all tenants.
     * Regular users see only the tenants they belong to.
     * Unauthenticated requests are denied.
     */
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      const ids = memberTenantIds(user)
      if (!ids.length) return false
      return { id: { in: ids } }
    },

    /** Only super-admins may create tenants. */
    create: isSuperAdminAccess,

    /**
     * Super-admins may update any tenant.
     * Tenant-admins may update only their own tenant(s).
     */
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      const ids = adminTenantIds(user)
      if (!ids.length) return false
      return { id: { in: ids } }
    },

    /** Only super-admins may delete tenants. */
    delete: isSuperAdminAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      index: true,
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text',
      admin: {
        description: 'Brand color as a hex value, e.g. #cc0000',
        position: 'sidebar',
      },
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}
