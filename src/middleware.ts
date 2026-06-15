import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.TENANT_SLUG_OVERRIDE_ENABLED !== 'true') {
    return NextResponse.next()
  }

  const { pathname, searchParams } = request.nextUrl
  const tenantSlug = searchParams.get('tenant')

  if (!tenantSlug) {
    return NextResponse.next()
  }

  // Rewrite /{path}?tenant=slug → /{slug}/{path} and forward the slug as a
  // request header so server components can resolve the tenant by slug instead
  // of by domain (layout, blocks, etc. all read x-tenant-slug).
  const url = request.nextUrl.clone()
  url.pathname = `/${tenantSlug}${pathname === '/' ? '' : pathname}`
  url.searchParams.delete('tenant')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', tenantSlug)

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/|admin/).*)'],
}
