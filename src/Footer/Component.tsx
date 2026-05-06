import Link from 'next/link'
import React from 'react'
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { getTenantCachedGlobal } from '@/utilities/getTenantGlobals'

import type { Tenant, Footer } from '@/payload-types'

interface FooterProps {
  tenant: Tenant | null
}

// ── Social icon map ─────────────────────────────────────────────────────────
const socialIconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram size={18} />,
  facebook: <Facebook size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  youtube: <Youtube size={18} />,
  // TikTok — lucide doesn't include it, use a minimal SVG
  tiktok: (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={18}
      viewBox="0 0 24 24"
      width={18}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  ),
}

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
  youtube: 'YouTube',
}

// ── Component ───────────────────────────────────────────────────────────────
export async function Footer({ tenant }: FooterProps) {
  if (!tenant) return null
  const tenantId = tenant.id
  const footerData = (await getTenantCachedGlobal('footer', 1, tenantId)()) as Footer

  const menuItems = footerData?.menuItems || []
  const socialItems = footerData?.socialItems || []
  const legalItems = footerData?.legalItems || []
  const copyright = footerData?.copyright || null

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Column 1: Menu ────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Menu
            </p>
            {menuItems.length > 0 && (
              <nav className="flex flex-col gap-3">
                {menuItems.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  />
                ))}
              </nav>
            )}
          </div>

          {/* ── Column 2: Social ──────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Volg ons
            </p>
            {socialItems.length > 0 && (
              <div className="flex flex-col gap-3">
                {socialItems.map((item, i) => {
                  const platform = item.platform as string
                  const icon = socialIconMap[platform]
                  const label = platformLabel[platform] ?? platform

                  // Resolve the href from the link field
                  const href =
                    item.link?.type === 'reference' && item.link.reference
                      ? '#'
                      : (item.link?.url ?? '#')

                  const newTab = item.link?.newTab ?? false

                  return (
                    <Link
                      key={i}
                      href={href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noopener noreferrer' : undefined}
                      aria-label={label}
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                        {icon}
                      </span>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Column 3: Legal ───────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Juridisch
            </p>
            {legalItems.length > 0 && (
              <nav className="flex flex-col gap-3">
                {legalItems.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  />
                ))}
              </nav>
            )}
            {copyright && (
              <p className="text-sm text-muted-foreground mt-6">{copyright}</p>
            )}
          </div>

        </div>
      </div>
    </footer>
  )
}
