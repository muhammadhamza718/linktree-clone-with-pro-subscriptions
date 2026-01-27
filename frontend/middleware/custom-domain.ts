import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';

// Custom domain middleware to handle routing for custom domains
export async function customDomainMiddleware(req: NextRequest) {
  const host = req.headers.get('host');

  if (!host) {
    return NextResponse.next();
  }

  // Skip middleware for standard routes (localhost, default domain)
  if (host.includes('localhost') || host.includes('.vercel.app') || host.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  try {
    // Look up the custom domain in the database
    const customDomain = await prisma.customDomain.findUnique({
      where: { domain: host },
      include: {
        profile: {
          include: {
            user: true,
            links: {
              where: { isVisible: true },
              orderBy: { order: 'asc' },
            },
            theme: true,
          },
        },
      },
    });

    if (!customDomain || !customDomain.isVerified || !customDomain.profile) {
      // If custom domain is not found or not verified, proceed with normal routing
      return NextResponse.next();
    }

    // If the custom domain is valid and verified, rewrite the URL to use the profile username
    // This allows the same profile rendering logic to work for both custom domains and standard URLs
    const profileUsername = customDomain.profile.username;

    // Create a rewrite URL to the standard profile route
    const rewritePath = `/@/${profileUsername}`;
    const rewriteUrl = new URL(rewritePath, req.url);

    return NextResponse.rewrite(rewriteUrl);
  } catch (error) {
    console.error('Error in custom domain middleware:', error);
    // If there's an error looking up the domain, proceed with normal routing
    return NextResponse.next();
  }
}

// Export the middleware function
export default customDomainMiddleware;