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
    <nav className="flex gap-5 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link"/>
      })}
      <button
        onClick={() => setDrawerOpen(true)}
        className="inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-4 py-2 bg-white text-secondary-foreground hover:bg-secondary/80"
      >
       👋 Contact
      </button>
      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} tenant={tenant} />
    </nav>
  )
}
