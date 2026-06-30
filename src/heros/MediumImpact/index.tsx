import React from 'react'
import Link from 'next/link'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  heading,
  introText,
  links,
  images,
  eyebrow,
}) => {
  const visuals = (images ?? []).slice(0, 3)

  return (
    <section className="flex flex-col items-center py-28 w-full">
      <div className="flex flex-col items-center gap-20 w-full max-w-[1214px] px-4 lg:px-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-6 max-w-[800px] w-full">

          {/* Breadcrumb */}
          {eyebrow && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#274d49]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M5.47 0.53a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1-1.06 1.06L10 6.12V11a1 1 0 0 1-1 1H7.5a.5.5 0 0 1-.5-.5V9H5v2.5a.5.5 0 0 1-.5.5H3a1 1 0 0 1-1-1V6.12L1.28 6.84A.75.75 0 0 1 .22 5.78L5.47.53Z" fill="currentColor" />
              </svg>
              <Link href="/" className="hover:underline underline-offset-2">Home</Link>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <path d="M2.5 1.5 5 4 2.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-semibold">{eyebrow}</span>
            </nav>
          )}

          {/* Heading */}
          {heading && (
            <h1 className="text-5xl lg:text-[64px] leading-none text-[#274d49] text-center font-bold">
              {heading}
            </h1>
          )}

          {/* Paragraph */}
          {introText && (
            <p className="text-lg lg:text-[21px] leading-relaxed text-[#274d49] text-center max-w-[640px]">
              {introText}
            </p>
          )}

          {/* CTA Button */}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    {...link}
                    className="inline-flex items-center justify-center h-14 px-6 bg-[#2e7572] text-white text-[18px] font-semibold tracking-tight hover:bg-[#265e5b] transition-colors"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visuals */}
        {visuals.length > 0 && (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-16 w-full">
            {visuals.map((item, i) => {
              const resource = item.image
              if (!resource || typeof resource !== 'object') return null

              const isCenter = i === 1

              return (
                <div
                  key={item.id ?? i}
                  className={`w-full md:flex-1 min-w-0 relative rounded-2xl overflow-hidden ${isCenter ? 'aspect-[5/4] md:aspect-auto md:h-[420px] lg:h-[500px]' : 'aspect-[5/4]'}`}
                >
                  <Media
                    fill
                    resource={resource}
                    imgClassName="object-cover"
                    size="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
