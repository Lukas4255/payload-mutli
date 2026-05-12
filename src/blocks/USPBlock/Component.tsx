'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [photos.length])

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null))
  }, [photos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  return (
    <section className="px-4 md:px-8 bg-gray-100 pt-20 pb-16" id={`block-${id} USP`}>
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
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
              {heading}
            </h2>
          )}
          {text && (
            <p className="text-muted-foreground text-base leading-relaxed">{text}</p>
          )}
        </div>

        {/* ── Photo Gallery ───────────────────────────────────── */}
        {photos.length > 0 && (
          <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 h-120 rounded-3xl overflow-hidden">
            {/* Large left image — spans both rows */}
            <div
              className="row-span-2 relative overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxIndex(0)}
            >
              <Media fill resource={photos[0]!.image} imgClassName="object-cover transition-transform duration-300 hover:scale-105" />
            </div>

            {/* Top-right images (photos 2 & 3) */}
            {photos.slice(1, 3).map((photo, i) => (
              <div
                key={photo.id ?? i}
                className="relative overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Media fill resource={photo.image} imgClassName="object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            ))}

            {/* Bottom-right images (photos 4 & 5) */}
            {photos.slice(3, 5).map((photo, i) => (
              <div
                key={photo.id ?? (i + 3)}
                className="relative overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(i + 3)}
              >
                <Media fill resource={photo.image} imgClassName="object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            ))}
          </div>
        )}

        {/* ── Lightbox (portal) ───────────────────────────────── */}
        {mounted && lightboxIndex !== null && createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Image container — stop propagation so clicking the image doesn't close */}
            <div
              className="relative w-full max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                <Media
                  fill
                  resource={photos[lightboxIndex]!.image}
                  imgClassName="object-contain"
                  loading="eager"
                />
              </div>

              {/* Counter */}
              <p className="mt-3 text-center text-sm text-white/70">
                {lightboxIndex + 1} / {photos.length}
              </p>
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev button */}
            {photos.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); showPrev() }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {photos.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); showNext() }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>,
          document.body,
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
