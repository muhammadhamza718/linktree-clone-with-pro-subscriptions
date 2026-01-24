import { auth } from './auth/better-auth'
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Protect dashboard routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/settings');

  if (isDashboardRoute) {
    // For API routes we'll check the session
    // Better Auth provides middleware that can protect routes
    // We'll implement the protection based on Better Auth's API

    // Get the auth cookie from the request
    const authCookie = request.cookies.get("__better_auth_session_token");

    if (!authCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Specific protected routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
}