import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import prisma from './lib/db';

export async function middleware(request: NextRequest) {
  // Check for password-protected links in public profiles
  const pathname = request.nextUrl.pathname;

  // If this is a public profile route (format: /@/username), check for password-protected links
  if (pathname.startsWith('/@/')) {
    const pathSegments = pathname.split('/');
    if (pathSegments.length >= 3) { // Format: /@/username[/linkId]
      const username = pathSegments[2];

      // In a real implementation, we'd check if the user has access to password-protected links
      // For now, we'll allow the request to proceed and handle password protection at the component level
    }
  }

  // Protect dashboard routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/settings');

  if (isDashboardRoute) {
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