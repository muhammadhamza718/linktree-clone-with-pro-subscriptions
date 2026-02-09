import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "./lib/db";

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;

  // Skip middleware for internal Next.js paths and static assets
  if (
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Handle custom domain routing
  if (
    host &&
    !host.includes("localhost") &&
    !host.includes(".vercel.app") &&
    !host.includes("127.0.0.1")
  ) {
    try {
      const customDomain = await prisma.customDomain.findUnique({
        where: { domain: host },
        include: {
          profile: {
            select: { username: true },
          },
        },
      });

      if (customDomain && customDomain.isVerified && customDomain.profile) {
        const rewritePath = `/@/${customDomain.profile.username}`;
        return NextResponse.rewrite(new URL(rewritePath, request.url));
      }
    } catch (error) {
      console.error("Error in custom domain middleware:", error);
    }
  }

  // Protect dashboard routes
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  if (isDashboardRoute) {
    const authCookie = request.cookies.get("__better_auth_session_token");
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
