import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { validateWebhookConfig } from "@/lib/webhooks/security";
import { WebhookEventEmitter } from "@/services/webhooks/event-emitter";

/**
 * GET: Fetch specific webhook and its deliveries
 * PATCH: Update webhook
 * DELETE: Remove webhook
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const webhook = await prisma.webhookEndpoint.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        deliveries: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!webhook)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(webhook);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, events, secret, isActive } = await req.json();

    // Only validate if present
    if (url || events || secret) {
      // Fetch current to fill gaps if partial update
      const current = await prisma.webhookEndpoint.findUnique({
        where: { id: params.id },
      });
      if (!current)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      const validation = validateWebhookConfig(
        url || current.url,
        events || JSON.parse(current.events),
        secret || current.secret,
      );
      if (!validation.isValid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400 },
        );
      }
    }

    const webhook = await prisma.webhookEndpoint.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        ...(url && { url }),
        ...(events && { events: JSON.stringify(events) }),
        ...(secret && { secret }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    if (webhook.count === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await prisma.webhookEndpoint.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (result.count === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Test the webhook manually
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;

    // Check if webhook belongs to user
    const webhook = await prisma.webhookEndpoint.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!webhook)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Trigger a test event
    await WebhookEventEmitter.emit(
      session.user.id,
      "profile_updated", // Test event
      {
        test: true,
        message: "This is a test webhook payload from Linktree Clone",
      },
      { ipHash: "test-ip", browser: "Linktree-Test" },
    );

    return NextResponse.json({ success: true, message: "Test event emitted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
