import prisma from "@/lib/db";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "invite"
  | "accept"
  | "remove";
export type EntityType =
  | "link"
  | "profile"
  | "theme"
  | "webhook"
  | "ab_test"
  | "team_member";

/**
 * Service to record audit logs for all security-relevant actions
 */
export class ActivityLogger {
  /**
   * Records an audit log entry
   */
  static async log(
    profileId: string,
    userId: string | null,
    action: AuditAction,
    entityType: EntityType,
    entityId: string,
    changes: any = null,
    metadata: { ip?: string; userAgent?: string } = {},
  ) {
    try {
      await prisma.activityLog.create({
        data: {
          profileId,
          userId,
          action,
          entityType,
          entityId,
          changes: changes ? JSON.stringify(changes) : null,
          ipAddress: metadata.ip || null,
          userAgent: metadata.userAgent || null,
        },
      });
    } catch (error) {
      console.error("Error recording audit log:", error);
    }
  }

  /**
   * Fetches audit logs for a specific profile
   */
  static async getLogs(profileId: string, limit: number = 50) {
    return await prisma.activityLog.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }
}
