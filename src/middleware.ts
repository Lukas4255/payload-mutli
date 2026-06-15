import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED !== 'true') {
    return NextResponse.next()
  }

  const tenantSlug = request.nextUrl.searchParams.get('tenant')
  if (!tenantSlug) {
    return NextResponse.next()
  }

  // Forward the slug as a request header so server components can resolve the
  // tenant by slug instead of by domain (layout, blocks, page components).
  // We deliberately do NOT rewrite the URL — the hostname-based rewrite in
  // next.config.js continues to run normally, and fetchTenantByDomain reads
  // this header as a fallback when its domain lookup returns nothing.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/|admin/).*)'],
}
