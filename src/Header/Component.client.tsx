'use client'
import Link from 'next/link'
import React from 'react'

import type { Header, Tenant } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  tenant: Tenant
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ tenant, data }) => {
  return (
    <header className="container relative z-20">
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo tenant={tenant} loading="eager" priority="high" className="" />
        </Link>
        <HeaderNav header={data} tenant={tenant} />
      </div>
    </header>
  )
}