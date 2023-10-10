// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // ここに処理の内容を書く。
  if (request.nextUrl.pathname === '/puiSto') {
    if (request.cookies.get('token')) {
      const tokenValue = request.cookies.get('token')?.value
      return NextResponse.redirect(new URL('/puiSto', request.url))

    }

  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/puiSto/:path*']
}