import React from 'react'

import type { ImageTextBlock as ImageTextBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from 'src/utilities/cn'

export const ImageTextBlockComponent: React.FC<ImageTextBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  richText,
  image,
  mirrored,
}) => {
  const caption = image && typeof image === 'object' ? image.caption : null

  return (
    <section className="px-4 md:px-8" id={`block-imageTextBlock-${id}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Image + caption */}
        <div className={cn('flex flex-col gap-3', mirrored && 'md:order-2')}>
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden">
            {image && typeof image === 'object' && (
              <Media fill resource={image} imgClassName="object-cover" />
            )}
          </div>
          {caption && (
            <div className="text-muted-foreground">
              <RichText content={caption} enableGutter={false} className="text-xs" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn('flex flex-col gap-4', mirrored && 'md:order-1')}>
          {eyebrow && (
            <p className="flex items-center gap-2 text-primary font-semibold text-sm">
              <span aria-hidden>•</span>
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight">
              {heading}
            </h2>
          )}
          {richText && (
            <div className="text-muted-foreground leading-relaxed">
              <RichText content={richText} enableGutter={false} />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
