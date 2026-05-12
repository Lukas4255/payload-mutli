'use client'

import { useAuth } from '@payloadcms/ui'
import { useEffect } from 'react'
import type { Media, Tenant } from '@/payload-types'

export const AdminFavicon = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.tenants?.length) return

    const tenantRef = user.tenants[0]?.tenant
    const tenantId = typeof tenantRef === 'number' ? tenantRef : tenantRef?.id
    if (!tenantId) return

    fetch(`/api/tenants/${tenantId}?depth=1`)
      .then((res) => res.json())
      .then((tenant: Tenant) => {
        const faviconUrl = (tenant.favicon as Media)?.url
        if (!faviconUrl) return

        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = faviconUrl
      })
  }, [user])

  return null
}
