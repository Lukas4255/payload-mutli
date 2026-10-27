import type { Access, TypedUser } from 'payload'

import { isUser } from './authenticated'

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}

export const isSuperAdmin = (user: TypedUser | null): boolean => {
  return isUser(user) && Boolean(user.roles?.includes('super-admin'))
}
