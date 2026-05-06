import React from 'react'

import type { USPBlock as USPBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const USPBlockComponent: React.FC<USPBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  text,
  gallery,
  columns,
}) => {
  const photos = (gallery ?? []).filter((g) => g.image && typeof g.image === 'object')

  return (
    <section className="px-4 md:px-8 bg-gray-100 pt-20 pb-16" id={`block-${id}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto">
          {eyebrow && (
            <p className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
              <span aria-hidden>•</span>
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              {heading}
            </h2>
          )}
          {text && (
            <p className="text-muted-foreground text-base leading-relaxed">{text}</p>
          )}
        </div>

        {/* ── Photo Gallery ───────────────────────────────────── */}
        {photos.length > 0 && (
          <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 h-[480px] rounded-3xl overflow-hidden">
            {/* Large left image — spans both rows */}
            <div className="row-span-2 relative overflow-hidden">
              <Media fill resource={photos[0]!.image} imgClassName="object-cover" />
            </div>

            {/* Top-right images (photos 2 & 3) */}
            {photos.slice(1, 3).map((photo, i) => (
              <div key={photo.id ?? i} className="relative overflow-hidden">
                <Media fill resource={photo.image} imgClassName="object-cover" />
              </div>
            ))}

            {/* Bottom-right images (photos 4 & 5) */}
            {photos.slice(3, 5).map((photo, i) => (
              <div key={photo.id ?? (i + 3)} className="relative overflow-hidden">
                <Media fill resource={photo.image} imgClassName="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* ── USP Columns ─────────────────────────────────────── */}
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((column, ci) => (
              <div
                key={column.id ?? ci}
                className="bg-white border border-border rounded-3xl p-8 flex flex-col gap-6"
              >
                {column.title && (
                  <h3 className="text-xl font-bold text-foreground">{column.title}</h3>
                )}

                {column.items && column.items.length > 0 && (
                  <ul className="flex flex-col divide-y divide-border">
                    {column.items.map((item, ii) => (
                      <li key={item.id ?? ii} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                        {item.icon && (
                          <span className="shrink-0 w-10 h-10 flex items-center justify-center text-primary text-base leading-none">
                            <i className={item.icon} aria-hidden="true" />
                          </span>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-sm text-foreground">
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
