'use client'
import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

// Fixed size and rotation for each of the 5 image slots
const IMAGE_CONFIGS = [
  { width: 290, height: 290, rotate: -6 },
  { width: 308, height: 308, rotate: 4 },
  { width: 300, height: 300, rotate: -2 },
  { width: 280, height: 280, rotate: 5 },
  { width: 320, height: 320, rotate: -4 },
] as const

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  images,
  eyebrow,
  heading,
  introText,
  socialProofText,
  socialProofAvatars,
}) => {

  return (
    <section className="relative -mt-[10.4rem] flex flex-col overflow-hidden">
      {/* Image strip — always a horizontal row, clipped (not scrollable) so no scrollbar appears */}
      {Array.isArray(images) && images.length > 0 && (
        <div className="flex flex-row items-center justify-center overflow-hidden pt-24 pb-8">
          {images.map((item, i) => {
            const resource = item.image
            if (!resource || typeof resource !== 'object') return null

            const { width, height, rotate } = IMAGE_CONFIGS[i] ?? IMAGE_CONFIGS[0]

            return (
              // Outer wrapper — padding gives the rotated corners room to breathe
              // without overlapping the neighbouring image
              <div key={item.id ?? i} className="shrink-0 p-6">
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{ width, height, transform: `rotate(${rotate}deg)` }}
                >
                  <Media
                    fill
                    resource={resource}
                    imgClassName="object-cover"
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    size={`${width}px`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Two-column content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — eyebrow + heading */}
          <div>
            {eyebrow && (
              <p className="flex items-center gap-2 text-primary text-4xl lg:text-5xl">
                <span aria-hidden>•</span>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h1 className="text-6xl lg:text-7xl text-foreground leading-18">
                {heading}
              </h1>
            )}
          </div>

          {/* Right — intro, buttons, social proof */}
          <div className="flex flex-col gap-6">
            {introText && (
              <p className="leading-relaxed">{introText}</p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex flex-wrap gap-4">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}

            {(socialProofAvatars?.length || socialProofText) && (
              <div className="flex items-center gap-3">
                {Array.isArray(socialProofAvatars) && socialProofAvatars.length > 0 && (
                  <div className="flex -space-x-2">
                    {socialProofAvatars.map((item, i) => {
                      const resource = item.avatar
                      if (!resource || typeof resource !== 'object') return null
                      return (
                        <div
                          key={item.id ?? i}
                          className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border-2 border-background"
                        >
                          <Media fill resource={resource} imgClassName="object-cover" size="36px" />
                        </div>
                      )
                    })}
                  </div>
                )}
                {socialProofText && (
                  <p className="text-sm text-muted-foreground">{socialProofText}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
