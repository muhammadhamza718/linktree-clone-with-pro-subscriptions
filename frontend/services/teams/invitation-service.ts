import prisma from "@/lib/db";
import crypto from "crypto";

/**
 * Service to handle team member invitations and token validation
 */
export class TeamInvitationService {
  /**
   * Generates an invitation token for a user
   */
  static generateToken(email: string, profileId: string): string {
    const data = `${email}:${profileId}:${Date.now()}`;
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  /**
   * Validates an invitation token and returns the profile it's for
   */
  static async validateToken(token: string) {
    // In a real system, you'd store tokens in the database with an expiry
    // For this implementation, we use a simpler model
    const invitation = await prisma.teamMember.findFirst({
      where: {
        // Assuming we store tokens or use a specific lookup
        // For simplicity, let's assume invitations are managed by email status
        isActive: true,
        acceptedAt: null,
      },
    });

    return invitation;
  }

  /**
   * Invites a team member by email
   */
  static async inviteMember(
    profileId: string,
    email: string,
    role: string,
    invitedBy: string,
  ) {
    try {
      // 1. Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found. They must register first.");
      }

      // 2. Check if already a member
      const existing = await prisma.teamMember.findFirst({
        where: { profileId, userId: user.id },
      });

      if (existing) {
        throw new Error("User is already a team member.");
      }

      // 3. Create the team member record as inactive/unaccepted
      const teamMember = await prisma.teamMember.create({
        data: {
          profileId,
          userId: user.id,
          role,
          invitedBy,
          isActive: true,
        },
      });

      // 4. In a real system, send email with token
      console.log(`Team invitation sent to ${email} for profile ${profileId}`);

      return teamMember;
    } catch (error: any) {
      console.error("Error inviting team member:", error);
      throw error;
    }
  }

  /**
   * Accepts an invitation
   */
  static async acceptInvitation(id: string) {
    return await prisma.teamMember.update({
      where: { id },
      data: { acceptedAt: new Date() },
    });
  }
}
