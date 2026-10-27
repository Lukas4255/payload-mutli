import type { Access } from 'payload'

import { isUser } from './authenticated'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (isUser(user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
