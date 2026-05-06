import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: 'http',
        hostname: '*.next',
        port: '3000',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  allowedDevOrigins: ['dorpshuistavenu.nl'],
  reactStrictMode: true,
  redirects,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },

      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },

      {
        source: '/:path*',
        destination: '/:tenant/:path*',

        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
    ]
  },
}

const payloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })
payloadConfig.images = { ...payloadConfig.images, qualities: [75, 100] }
export default payloadConfig