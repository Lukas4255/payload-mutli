import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Link from 'next/link'

import type { Vacancy } from '@/payload-types'

import RichText from '@/components/RichText'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { formatDateTime } from '@/utilities/formatDateTime'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const tenants = await payload.find({
    collection: 'tenants',
    limit: 1000,
    pagination: false,
  })

  const params = await Promise.all(
    tenants.docs.map(async (tenant) => {
      const vacancies = await payload.find({
        collection: 'vacancies',
        draft: false,
        limit: 1000,
        pagination: false,
        select: { slug: true },
        where: { 'tenant.id': { equals: tenant.id } },
      })

      return vacancies.docs.map(({ slug }) => ({
        tenant: tenant.domain,
        slug: slug ?? '',
      }))
    }),
  )

  return params.flat()
}

type Args = {
  params: Promise<{ tenant: string; slug: string }>
}

export default async function VacancyPage({ params }: Args) {
  const { tenant: tenantDomain, slug } = await params
  const url = '/vacatures/' + slug
  const vacancy = await queryVacancyBySlug({ tenantDomain, slug })

  if (!vacancy) return <PayloadRedirects url={url} />

  const { title, vacancyType, excerpt, description, applyUrl, applyEmail, publishedAt } = vacancy

  return (
    <article className="pb-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {/* Header */}
      <div className="container max-w-[52rem] mx-auto pt-8 pb-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Terug naar vacatures
        </Link>

        {vacancyType && (
          <span className="inline-flex items-center bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold mb-4">
            {vacancyType}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl font-heading leading-tight mb-4">{title}</h1>
        
      </div>

      {/* Body */}
      <div className="container max-w-[52rem] mx-auto">
        <RichText className="mx-auto" content={description} enableGutter={false} />

        {/* Apply section */}
        {(applyUrl || applyEmail) && (
          <div className="mt-12 rounded-2xl bg-primary/10 p-8">
            <h2 className="text-2xl font-bold mb-4">Solliciteren</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {applyUrl && (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  Solliciteer nu
                </a>
              )}
              {applyEmail && (
                <a
                  href={`mailto:${applyEmail}`}
                  className="inline-flex items-center justify-center rounded-full border border-primary text-primary font-semibold px-6 py-3 hover:bg-primary/10 transition-colors"
                >
                  {applyEmail}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { tenant: tenantDomain, slug } = await params
  const vacancy = await queryVacancyBySlug({ tenantDomain, slug })

  return {
    title: vacancy?.title ?? 'Vacature',
    description: vacancy?.excerpt ?? undefined,
  }
}

const queryVacancyBySlug = cache(
  async ({ tenantDomain, slug }: { tenantDomain: string; slug: string }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const tenant = await fetchTenantByDomain(tenantDomain)
    if (!tenant) return null

    const result = await payload.find({
      collection: 'vacancies',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        and: [{ slug: { equals: slug } }, { 'tenant.id': { equals: tenant.id } }],
      },
    })

    return result.docs?.[0] || null
  },
)
