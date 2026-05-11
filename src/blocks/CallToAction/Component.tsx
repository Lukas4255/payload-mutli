import React from 'react'

import type { CallToActionBlock as CTABlockProps, Tenant } from '@/payload-types'
import { Media } from '@/components/Media'
import { PatternSVG } from '@/components/PatternSVG'
import { CTAButton } from './CTAButton'

export const CallToActionBlock: React.FC<CTABlockProps & { tenant?: Tenant }> = ({ image, heading, text, link, tenant }) => {
  return (
    /* Wrapper gives room above for the floating image */
    <div className="mx-4 md:mx-8 relative pt-14">
      {/* Image floating above the card — centered, half above the top edge */}
      {image && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-28 h-28 -rotate-8 rounded-2xl overflow-hidden shadow-xl">
          <Media fill imgClassName="object-cover" resource={image} />
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-foreground px-8 pt-20 pb-16 md:px-16 md:pt-36 md:pb-32">
        {/* Pattern — bottom right corner, desktop only, uses primary color via currentColor */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden">
          <PatternSVG className="absolute bottom-0 right-0 w-[330px] text-primary" />
        </div>

        {/* Centered content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {heading && (
            <h2 className="text-4xl md:text-5xl font-bold text-background leading-tight mb-6">
              {heading}
            </h2>
          )}
          {text && (
            <p className="text-background/70 text-base leading-relaxed mb-8">
              {text}
            </p>
          )}
          {link && (
            <CTAButton
              label={link.label ?? undefined}
              appearance={link.appearance ?? 'default'}
              tenant={tenant}
            />
          )}
        </div>
      </section>
    </div>
  )
}
