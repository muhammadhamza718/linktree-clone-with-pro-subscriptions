import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { RBAC } from "@/middleware/rbac";

/**
 * GET: List all brand kit assets for a profile
 */
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profileId");

  if (!profileId)
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });

  try {
    const hasAccess = await RBAC.checkAccess(
      session.user.id,
      profileId,
      "viewer",
    );
    if (!hasAccess)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const assets = await prisma.brandKitAsset.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Record a new asset (Upload logic usually handled by a separate signed URL or multipart route)
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { profileId, assetType, assetUrl, assetName } = await req.json();

    const canEdit = await RBAC.checkAccess(
      session.user.id,
      profileId,
      "editor",
    );
    if (!canEdit)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const asset = await prisma.brandKitAsset.create({
      data: {
        profileId,
        assetType,
        assetUrl,
        assetName,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
