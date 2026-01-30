import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth"; // Assuming this is the auth path
import { validateWebhookConfig } from "@/lib/webhooks/security";

/**
 * GET: List all webhooks for the current user
 * POST: Create a new webhook
 */
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const webhooks = await prisma.webhookEndpoint.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    });

    return NextResponse.json(webhooks);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, events, secret } = await req.json();

    const validation = validateWebhookConfig(url, events, secret);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    const webhook = await prisma.webhookEndpoint.create({
      data: {
        userId: session.user.id,
        url,
        events: JSON.stringify(events),
        secret,
        isActive: true,
      },
    });

    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
