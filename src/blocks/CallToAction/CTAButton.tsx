'use client'

import React, { useState } from 'react'
import { ContactDrawer } from '@/components/ContactDrawer'
import type { Tenant } from '@/payload-types'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

interface CTAButtonProps {
  label?: string
  appearance?: 'default' | 'outline' | 'secondary'
  tenant?: Tenant
}

export const CTAButton: React.FC<CTAButtonProps> = ({ label = 'Contact', appearance = 'default', tenant }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: appearance, size: 'default' }), 'cursor-pointer')}
      >
        {label}
      </button>
      <ContactDrawer open={open} onClose={() => setOpen(false)} tenant={tenant} />
    </>
  )
}
