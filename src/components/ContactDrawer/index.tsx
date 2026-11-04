'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Phone } from 'lucide-react'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import type { Tenant } from '@/payload-types'

type Department = NonNullable<NonNullable<Tenant['contactInfo']>['departments']>[number]

/** Up to two initials, skipping words that don't start with a letter (so "&" is ignored). */
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const DepartmentAvatar: React.FC<{ department: Department }> = ({ department }) => {
  const { photo } = department

  if (photo && typeof photo === 'object' && photo.url) {
    return (
      <span className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden">
        <Media fill imgClassName="object-cover" resource={photo} size="48px" />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold"
    >
      {getInitials(department.name)}
    </span>
  )
}

interface ContactDrawerProps {
  open: boolean
  onClose: () => void
  tenant?: Tenant
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({ open, onClose, tenant }) => {
  const contact = tenant?.contactInfo
  const departments = (contact?.departments ?? []).filter((d) => d.name?.trim() && d.email?.trim())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={[
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
        className={[
          'fixed top-0 right-0 z-50 h-full w-full max-w-[560px] bg-background shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Close button */}
        <div className="flex justify-end px-6 pt-6">
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="cursor-pointer rounded p-1 hover:bg-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between px-8 pb-10">
          <div>
            {/* Welcome heading */}
            <h2 className="text-3xl font-bold mt-4 mb-2">Welkom! 👋</h2>
            <p className="text-neutral-600 text-sm mb-8">
              Wij staan voor je klaar op werkdagen van 09:00 tot 17:00
            </p>

            {/* Contact items */}
            <div className="flex flex-col">
              {/* Email */}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 py-5 border-t border-border group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base group-hover:underline">{contact.email}</p>
                    <p className="text-neutral-600 text-sm mt-0.5">We reageren meestal binnen 48 uur</p>
                  </div>
                </a>
              )}

              {/* Phone */}
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 py-5 border-t border-border group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base group-hover:underline">{contact.phone}</p>
                    <p className="text-neutral-600 text-sm mt-0.5">Van ma-vr van 09:00 tot 17:00</p>
                  </div>
                </a>
              )}

              <div className="border-t border-border" />
            </div>

            {/* Departments */}
            {departments.length > 0 && (
              <ul className="flex flex-col mt-8">
                {departments.map((department, i) => (
                  <li
                    key={department.id ?? i}
                    className={cn(
                      'flex items-center gap-4',
                      i > 0 && 'pt-6',
                      i < departments.length - 1 && 'pb-6 border-b border-dashed border-border',
                    )}
                  >
                    <DepartmentAvatar department={department} />
                    <div className="min-w-0">
                      <p className="font-semibold text-base">{department.name}</p>
                      <a
                        href={`mailto:${department.email}`}
                        className="flex items-center gap-2 text-neutral-600 mt-0.5 hover:underline"
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="break-all">{department.email}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Logo tenant={tenant} className="h-12 w-auto max-w-24 mb-6" />
            <div className="grid grid-cols-2 gap-y-1.5 text-sm">
              {contact?.address && (
                <>
                  <span className="text-neutral-600">Adres</span>
                  <span>{contact.address}</span>
                </>
              )}
              {contact?.kvk && (
                <>
                  <span className="text-neutral-600">KVK-nummer</span>
                  <span>{contact.kvk}</span>
                </>
              )}
              {contact?.btw && (
                <>
                  <span className="text-neutral-600">BTW-nummer</span>
                  <span>{contact.btw}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
