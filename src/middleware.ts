import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Basic Auth gate ────────────────────────────────────────────────────────
  // Protects the entire staging site (including /admin and /api) when
  // STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASS are set.
  // Uses btoa() — safe in Edge Runtime (no Buffer dependency).
  const basicUser = process.env.STAGING_BASIC_AUTH_USER
  const basicPass = process.env.STAGING_BASIC_AUTH_PASS

  if (basicUser && basicPass) {
    const authorization = request.headers.get('authorization')
    const expected = 'Basic ' + btoa(`${basicUser}:${basicPass}`)
    if (authorization !== expected) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Staging"' },
      })
    }
  }

  // ── Tenant slug override ───────────────────────────────────────────────────
  // Skipped for /admin and /api routes — only relevant for the frontend.
  // Requires TENANT_SLUG_OVERRIDE_ENABLED=true. When STAGING_PREVIEW_SECRET is
  // set, the ?secret= param must also match before the override activates.
  if (
    process.env.TENANT_SLUG_OVERRIDE_ENABLED === 'true' &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api')
  ) {
    const tenantSlug = request.nextUrl.searchParams.get('tenant')
    const secret = request.nextUrl.searchParams.get('secret')
    const stagingSecret = process.env.STAGING_PREVIEW_SECRET

    if (tenantSlug && (!stagingSecret || secret === stagingSecret)) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-tenant-slug', tenantSlug)

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  // Expanded from before to include /admin and /api so Basic Auth covers them.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
