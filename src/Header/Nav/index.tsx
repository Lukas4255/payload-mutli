'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ContactDrawer } from '@/components/ContactDrawer'
import type { Tenant } from '@/payload-types'

export const HeaderNav: React.FC<{ header: HeaderType; tenant?: Tenant }> = ({ header, tenant }) => {
  const navItems = header?.navItems || []
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <button
        onClick={() => setDrawerOpen(true)}
        className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline transition-colors"
      >
        Contact
      </button>
      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} tenant={tenant} />
    </nav>
  )
}
