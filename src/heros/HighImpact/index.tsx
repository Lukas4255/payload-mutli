'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// Fixed size and rotation for each of the 5 image slots
const IMAGE_CONFIGS = [
  { width: 320, height: 320, rotate: -6 },
  { width: 308, height: 308, rotate: 4 },
  { width: 340, height: 340, rotate: -2 },
  { width: 308, height: 308, rotate: 5 },
  { width: 320, height: 320, rotate: -4 },
] as const

export const HighImpactHero: React.FC<Page['hero']> = ({ links, images, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section
      className="relative -mt-[10.4rem] flex flex-col items-center justify-center text-white pb-24 pt-40"
      data-theme="dark"
    >
      {/* Image strip — horizontal on desktop, vertical stack on mobile */}
      {Array.isArray(images) && images.length > 0 && (
        <div className="flex flex-col md:flex-row items-center gap-6 px-8">
          {images.map((item, i) => {
            const resource = item.image
            if (!resource || typeof resource !== 'object') return null

            const { width, height, rotate } = IMAGE_CONFIGS[i] ?? IMAGE_CONFIGS[0]

            return (
              <div
                key={item.id ?? i}
                className="relative shrink-0 overflow-hidden rounded-2xl"
                style={{
                  width,
                  height,
                  transform: `rotate(${rotate}deg)`,
                }}
              >
                <Media
                  fill
                  resource={resource}
                  imgClassName="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Text + links */}
      <div className="container z-10 relative flex items-center justify-center mb-16">
        <div className="max-w-[36.5rem] text-center">
          {richText && <RichText className="mb-6" content={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
