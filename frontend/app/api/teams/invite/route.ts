import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { RBAC } from "@/middleware/rbac";
import { TeamInvitationService } from "@/services/teams/invitation-service";
import { ActivityLogger } from "@/services/audit/activity-logger";

/**
 * POST: Invite a member to a team
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { profileId, email, role } = await req.json();

    if (!profileId || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Only owners can invite members
    const isOwner = await RBAC.checkAccess(session.user.id, profileId, "owner");
    if (!isOwner)
      return NextResponse.json(
        { error: "Only owners can invite team members" },
        { status: 403 },
      );

    // Use invitation service
    const invitation = await TeamInvitationService.inviteMember(
      profileId,
      email,
      role,
      session.user.id,
    );

    // Log the action
    await ActivityLogger.log(
      profileId,
      session.user.id,
      "invite",
      "team_member",
      invitation.id,
      { email, role },
    );

    return NextResponse.json(invitation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
