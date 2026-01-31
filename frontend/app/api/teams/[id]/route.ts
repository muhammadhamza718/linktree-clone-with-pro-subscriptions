import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { RBAC } from "@/middleware/rbac";
import { ActivityLogger } from "@/services/audit/activity-logger";

/**
 * PATCH: Update team member role
 * DELETE: Remove team member
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { role } = await req.json();
    const memberId = params.id;

    // Find the member to get the profileId
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Only owners can change roles
    const isOwner = await RBAC.checkAccess(
      session.user.id,
      member.profileId,
      "owner",
    );
    if (!isOwner)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Cannot change role of the owner (direct profile user) - safety check
    const profile = await prisma.profile.findUnique({
      where: { id: member.profileId },
    });
    if (profile && member.userId === profile.userId) {
      return NextResponse.json(
        { error: "Cannot change owner role" },
        { status: 400 },
      );
    }

    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    });

    // Log action
    await ActivityLogger.log(
      member.profileId,
      session.user.id,
      "update",
      "team_member",
      memberId,
      { role },
    );

    return NextResponse.json(updated);
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
    const memberId = params.id;

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    // Only owners can remove members, or members can remove themselves
    const isOwner = await RBAC.checkAccess(
      session.user.id,
      member.profileId,
      "owner",
    );
    const isSelf = member.userId === session.user.id;

    if (!isOwner && !isSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot remove the primary owner
    const profile = await prisma.profile.findUnique({
      where: { id: member.profileId },
    });
    if (profile && member.userId === profile.userId) {
      return NextResponse.json(
        { error: "Cannot remove primary profile owner" },
        { status: 400 },
      );
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    // Log action
    await ActivityLogger.log(
      member.profileId,
      session.user.id,
      "remove",
      "team_member",
      memberId,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
