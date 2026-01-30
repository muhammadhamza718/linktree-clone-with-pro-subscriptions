import prisma from "@/lib/db";

export type Role = "owner" | "editor" | "viewer";

/**
 * RBAC Helper to check if a user has specific permissions on a profile
 */
export class RBAC {
  /**
   * Checks if user has specific access level to a profile
   */
  static async checkAccess(
    userId: string,
    profileId: string,
    requiredRole: Role,
  ): Promise<boolean> {
    try {
      // 1. Check if user is the direct owner of the profile
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      });

      if (profile && profile.userId === userId) {
        return true; // Owner always has access
      }

      // 2. Check team membership
      const membership = await prisma.teamMember.findFirst({
        where: {
          profileId,
          userId,
          isActive: true,
          acceptedAt: { not: null },
        },
      });

      if (!membership) return false;

      // 3. Validate role hierarchy
      const roleHierarchy: Record<Role, number> = {
        owner: 3,
        editor: 2,
        viewer: 1,
      };

      const userRole = membership.role as Role;

      return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    } catch (error) {
      console.error("Error checking RBAC access:", error);
      return false;
    }
  }

  /**
   * Middleware-ready check that throws or returns boolean
   */
  static async authorize(
    userId: string,
    profileId: string,
    requiredRole: Role = "viewer",
  ) {
    const hasAccess = await this.checkAccess(userId, profileId, requiredRole);
    if (!hasAccess) {
      throw new Error("Forbidden: You do not have sufficient permissions.");
    }
    return true;
  }
}
