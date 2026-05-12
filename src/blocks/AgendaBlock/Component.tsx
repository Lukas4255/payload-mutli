import React from 'react'

import type { AgendaBlock as AgendaBlockProps } from '@/payload-types'

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline strokeLinecap="round" strokeLinejoin="round" points="15 3 21 3 21 9" />
    <line strokeLinecap="round" strokeLinejoin="round" x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export const AgendaBlockComponent: React.FC<AgendaBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  events,
}) => {
  const hasEvents = events && events.length > 0

  return (
    <section className="px-4 pb-8 md:px-8" id={`block-${id}`}>
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
            {events.map((event, i) => {
              const inner = (
                <>
                  {/* Icon */}
                  <span className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 text-foreground text-xl">
                    {event.icon ? (
                      <i className={event.icon} aria-hidden="true" />
                    ) : (
                      <CalendarIcon />
                    )}
                  </span>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-base leading-snug">
                      {event.title}
                    </p>
                  </div>

                  {/* Date badge */}
                  <span className="shrink-0 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {event.date}
                  </span>

                  {/* External link indicator */}
                  {event.url && <ExternalLinkIcon />}
                </>
              )

              const rowClass = 'group flex items-center gap-5 px-6 py-5 transition-colors'

              return event.url ? (
                <a
                  key={event.id ?? i}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${rowClass} hover:bg-gray-50 cursor-pointer`}
                  aria-label={`${event.title} — opens in new tab`}
                >
                  {inner}
                </a>
              ) : (
                <div key={event.id ?? i} className={rowClass}>
                  {inner}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
