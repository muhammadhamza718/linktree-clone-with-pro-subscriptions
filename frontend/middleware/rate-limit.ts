import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple rate limiting middleware logic
 * Limits to 100 requests per minute per IP/UserID
 */
export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000,
) {
  const now = Date.now();
  const userData = rateLimitMap.get(key);

  if (!userData || now > userData.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (userData.count >= limit) {
    return { success: false, remaining: 0 };
  }

  userData.count += 1;
  return { success: true, remaining: limit - userData.count };
}

export async function webhookRateLimitMiddleware(req: NextRequest) {
  // Use IP address or UserID for rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const { success, remaining } = rateLimit(`webhook:${ip}`);

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "0" },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", "100");
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  return response;
}
