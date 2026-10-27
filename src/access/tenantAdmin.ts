import type { User } from '@/payload-types'

type TenantRow = NonNullable<User['tenants']>[number]

/** The tenant ID of a `tenants` array row, whether the relationship is populated or not. */
export const tenantIdOf = (row: Pick<TenantRow, 'tenant'>): number | undefined => {
  return typeof row.tenant === 'number' ? row.tenant : row.tenant?.id
}

/** Tenant IDs where the user holds the tenant-admin role. */
export const adminTenantIds = (user: User | null): number[] => {
  if (!user?.tenants?.length) return []
  return user.tenants
    .filter((t) => t.roles?.includes('tenant-admin'))
    .map(tenantIdOf)
    .filter((id): id is number => typeof id === 'number')
}
