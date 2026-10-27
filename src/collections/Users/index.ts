import type { CollectionConfig, TypedUser, Where } from 'payload'

import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { authenticated, isUser } from '../../access/authenticated'
import { isSuperAdmin } from '../../access/isSuperAdmin'
import { adminTenantIds } from '../../access/tenantAdmin'
import type { User } from '../../payload-types'
import { protectTenantMemberships } from './hooks/protectTenantMemberships'
import { setCookieBasedOnDomain } from './hooks/setCookieBasedOnDomain'

/** Super-admins, and tenant-admins for the tenants they administer. */
const canManageMemberships = ({ req: { user } }: { req: { user: TypedUser | null } }): boolean =>
  isSuperAdmin(user) || adminTenantIds(user).length > 0

/**
 * Users a tenant-admin may manage: members of the tenants they administer, never super-admins.
 * The multi-tenant plugin additionally limits non-super-admins to themselves and users that
 * share a tenant with them.
 */
const managedUsers = (user: User): Where | false => {
  const ids = adminTenantIds(user)
  if (!ids.length) return false
  return {
    and: [{ 'tenants.tenant': { in: ids } }, { roles: { not_in: ['super-admin'] } }],
  }
}

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  // Which tenants a tenant-admin may touch is enforced by protectTenantMemberships
  arrayFieldAccess: {
    create: canManageMemberships,
    update: canManageMemberships,
  },
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
      access: {
        update: ({ req }) => {
          const { user } = req
          if (!user) {
            return false
          }

          if (isSuperAdmin(user)) {
            return true
          }

          return false
        },
      },
    },
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: canManageMemberships,
    delete: ({ req: { user } }) => {
      if (!isUser(user)) return false
      if (isSuperAdmin(user)) return true
      return managedUsers(user)
    },
    read: authenticated,
    /** Everyone may edit their own account; tenant-admins also the users they manage. */
    update: ({ req: { user } }) => {
      if (!isUser(user)) return false
      if (isSuperAdmin(user)) return true
      const self: Where = { id: { equals: user.id } }
      const managed = managedUsers(user)
      return managed ? { or: [self, managed] } : self
    },
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        // Only super-admins hand out roles. The very first user (onboarding) has no session
        // yet and must be able to make themselves super-admin.
        create: async ({ req }) => {
          if (isSuperAdmin(req.user)) return true
          if (req.user) return false
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          return totalDocs === 0
        },
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
    beforeChange: [protectTenantMemberships],
  },
}
