import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminUser || !adminPass) {
    return new NextResponse('Admin not configured', { status: 503 })
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.replace('Basic ', '')
    // Edge Runtime 対応: Buffer の代わりに atob を使用
    const decoded = atob(base64)
    const colonIndex = decoded.indexOf(':')
    const user = decoded.slice(0, colonIndex)
    const pass = decoded.slice(colonIndex + 1)

    if (user === adminUser && pass === adminPass) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}

export const config = {
  matcher: '/admin/:path*',
}
