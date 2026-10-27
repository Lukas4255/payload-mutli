import type { AccessArgs, TypedUser } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

/**
 * Whether the request is made by a real account from the `users` collection. MCP API keys
 * are an auth collection too (`payload-mcp-api-keys API-Key ...`), but must never count as a
 * signed-in user outside the MCP endpoint.
 */
export const isUser = (user: TypedUser | null | undefined): user is User =>
  user?.collection === 'users'

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return isUser(user)
}
