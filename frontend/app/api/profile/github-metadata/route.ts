import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/better-auth";
import prisma from "@/lib/db";
import { syncLinkGitHubMetadata } from "@/lib/github";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    // Ensure the link belongs to the user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        profile: {
          userId: session.user.id,
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await syncLinkGitHubMetadata(linkId, prisma);

    return NextResponse.json({
      success: true,
      message: "GitHub metadata synced successfully",
    });
  } catch (error) {
    console.error("GitHub sync error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
