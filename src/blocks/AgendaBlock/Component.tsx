import React from 'react'

import type { AgendaBlock as AgendaBlockProps } from '@/payload-types'

export const AgendaBlockComponent: React.FC<AgendaBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  events,
}) => {
  const hasEvents = events && events.length > 0

  return (
    <section className="px-4 md:px-8" id={`block-${id}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* ── Header ─────────────────────────────────────────── */}
        {(eyebrow || heading) && (
          <div className="text-center max-w-2xl mx-auto">
            {eyebrow && (
              <p className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
                <span aria-hidden>•</span>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* ── Events list ─────────────────────────────────────── */}
        {hasEvents && (
          <div className="flex flex-col divide-y divide-border border border-border rounded-3xl overflow-hidden bg-white">
            {events.map((event, i) => (
              <div
                key={event.id ?? i}
                className="flex items-center gap-5 px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                {/* Icon */}
                <span className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">
                  {event.icon ? (
                    <i className={event.icon} aria-hidden="true" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )}
                </span>

                {/* Title + date */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-base leading-snug">
                    {event.title}
                  </p>
                </div>

                {/* Date badge */}
                <span className="shrink-0 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {event.date}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
