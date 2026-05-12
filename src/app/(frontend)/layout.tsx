import type { Metadata } from 'next'

import { cn } from '@/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import React from 'react'

const SourceSans3 = localFont({
  src: [
    {
      path: './fonts/SourceSans3-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SourceSans3-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-source-sans-3',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { headers } from 'next/headers'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { hexToHSL } from '@/utilities/hexToHSL'
import type { Media } from '@/payload-types'
import { notFound } from 'next/navigation'

import Script from 'next/script'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const headersList = await headers()
  const host = headersList.get('host') || ''
  console.log('Host:', host)
  const tenant = await fetchTenantByDomain(host)

  if (!tenant) {
    return notFound()
  }

  const primaryHSL = tenant.primaryColor ? hexToHSL(tenant.primaryColor) : null
  const faviconUrl = (tenant.favicon as Media | null)?.url

  return (
    <html
      className={cn(SourceSans3.variable, GeistMono.variable)}
      lang="nl"
      suppressHydrationWarning
      style={primaryHSL ? ({ '--primary': primaryHSL } as React.CSSProperties) : undefined}
    >
      <head>
        {faviconUrl ? (
          <link href={faviconUrl} rel="icon" />
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/svl1xde.css" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header tenant={tenant} />
          {children}
          <Footer tenant={tenant} />
        </Providers>
        <Script
          src="https://kit.fontawesome.com/c3d92da085.js"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}