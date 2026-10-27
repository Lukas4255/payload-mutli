import type { CollectionBeforeChangeHook } from 'payload'
import { Forbidden } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'
import { adminTenantIds, tenantIdOf } from '@/access/tenantAdmin'
import type { User } from '@/payload-types'

type TenantRow = NonNullable<User['tenants']>[number]

/**
 * Non-super-admins may only add, change or remove `tenants` rows for the tenants they
 * administer, so nobody can join another tenant or change their membership there.
 */
export const protectTenantMemberships: CollectionBeforeChangeHook<User> = ({
  data,
  originalDoc,
  req,
}) => {
  const { user } = req
  if (!user || isSuperAdmin(user) || !Array.isArray(data.tenants)) {
    return data
  }

  const managed = new Set(adminTenantIds(user))
  const unmanagedRows = (rows: TenantRow[]) =>
    rows
      .filter((row) => !managed.has(tenantIdOf(row) as number))
      .map((row) => `${tenantIdOf(row)}:${[...(row.roles ?? [])].sort().join(',')}`)
      .sort()
      .join('|')

  if (unmanagedRows(data.tenants) !== unmanagedRows(originalDoc?.tenants ?? [])) {
    throw new Forbidden(req.t)
  }

  return data
}
