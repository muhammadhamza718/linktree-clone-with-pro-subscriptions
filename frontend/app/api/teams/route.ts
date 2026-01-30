import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { RBAC } from "@/middleware/rbac";

/**
 * GET: List all team members for a profile
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
    // Check if user has at least viewer access
    const hasAccess = await RBAC.checkAccess(
      session.user.id,
      profileId,
      "viewer",
    );
    if (!hasAccess)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const members = await prisma.teamMember.findMany({
      where: { profileId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
