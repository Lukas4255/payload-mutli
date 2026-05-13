import type { VacanciesBlock as VacanciesBlockProps, Vacancy } from '@/payload-types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export const VacanciesBlockComponent: React.FC<VacanciesBlockProps & { id?: string }> = async (
  props,
) => {
  const { id, eyebrow, heading, limit: limitFromProps, viewAllLink } = props
  const limit = limitFromProps || 3

  // Resolve the current tenant from the request host. fetchTenantByDomain is
  // memoised via React cache() so this shares the DB result with the layout.
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await fetchTenantByDomain(host)

  const payload = await getPayload({ config: configPromise })

  const whereConditions: Where[] = [{ _status: { equals: 'published' } }]
  if (tenant) whereConditions.push({ 'tenant.id': { equals: tenant.id } })

  const { docs: vacancies } = await payload.find({
    collection: 'vacancies',
    depth: 0,
    limit,
    where: { and: whereConditions },
    sort: '-publishedAt',
    overrideAccess: true,
  })

  return (
    <section
      className="mx-4 md:mx-8 rounded-3xl bg-primary/10 px-6 py-16 md:px-16 md:py-20"
      id={`block-${id}`}
    >
      {/* Header */}
      <div className="text-center mb-12">
        {eyebrow && (
          <p className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
            <span aria-hidden>•</span>
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-2xl mx-auto">
            {heading}
          </h2>
        )}
      </div>

      {/* Vacancy cards */}
      {vacancies.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className="w-full md:w-[calc(33.333%-1rem)]">
              <VacancyCard vacancy={vacancy as Vacancy} />
            </div>
          ))}
        </div>
      )}

      {/* View all button */}
      {viewAllLink && vacancies.length > 3 && (
        <div className="flex justify-center">
          <CMSLink
            {...viewAllLink}
            appearance="secondary"
          />
        </div>
      )}
    </section>
  )
}

const VacancyCard: React.FC<{ vacancy: Vacancy }> = ({ vacancy }) => {
  const { title, slug, excerpt, vacancyType } = vacancy
  const href = `/vacatures/${slug}`

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Type pill */}
      {vacancyType && (
        <span className="self-start inline-flex items-center bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold mb-4">
          {vacancyType}
        </span>
      )}

      {/* Title */}
      <h3 className="text-foreground font-bold text-lg leading-snug mb-3">{title}</h3>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {excerpt}
        </p>
      )}

      {/* CTA */}
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-auto">
        Bekijk vacature
        <ArrowUpRight size={15} />
      </span>
    </Link>
  )
}
