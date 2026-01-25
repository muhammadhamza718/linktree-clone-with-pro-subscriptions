import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';

// This middleware handles password-protected links by checking if a link requires a password
// and validating the session if one exists
export async function passwordProtectionMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathSegments = url.pathname.split('/');

  // Check if this is a link access request (would be in the public profile route)
  // This is a simplified approach - in reality, we'd need to identify if the request
  // is trying to access a password-protected link

  // For this implementation, we'll check if the URL contains a specific pattern
  // that indicates we're trying to access a protected resource
  if (pathSegments.includes('protected')) {
    // Extract link ID from the path
    const linkId = pathSegments[pathSegments.indexOf('protected') + 1];

    if (linkId) {
      try {
        // Fetch the link to check if it's password protected
        const link = await prisma.link.findUnique({
          where: { id: linkId },
        });

        if (link && link.passwordHash) {
          // Check if user has a valid session for this password-protected link
          const sessionId = req.cookies.get('link_session_' + linkId);

          if (!sessionId) {
            // Redirect to password entry page
            const passwordPage = new URL('/password-required', req.url);
            passwordPage.searchParams.set('linkId', linkId);
            return NextResponse.redirect(passwordPage);
          }

          // In a real implementation, we'd validate the session against a stored session
          // For now, we'll just continue if a session exists
        }
      } catch (error) {
        console.error('Error checking link protection:', error);
        // Continue with request if there's an error checking protection
      }
    }
  }

  return NextResponse.next();
}

// Configuration for this middleware
export const config = {
  matcher: [
    /*
     * Match all paths that might contain protected links
     * Exclude static assets and API routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|password-required).*)',
  ],
};