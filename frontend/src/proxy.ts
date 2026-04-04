import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']
const API_PROXY_PREFIX = '/proxy'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proxy: forward /proxy/* → backend API
  if (pathname.startsWith(API_PROXY_PREFIX)) {
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:4000'
    const apiPath = pathname.replace(API_PROXY_PREFIX, '/api')
    const target = new URL(apiPath + request.nextUrl.search, backendUrl)

    return NextResponse.rewrite(target)
  }

  // Auth guard: protect all non-public routes
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('token')?.value

  if (!token && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
