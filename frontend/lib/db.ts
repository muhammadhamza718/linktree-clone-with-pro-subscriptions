import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * Prevents multiple instances of Prisma Client in development
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

// Verify connection in development
if (process.env.NODE_ENV !== "production") {
  prisma
    .$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) =>
      console.error("❌ Database connection failed:", err.message),
    );

  globalForPrisma.prisma = prisma;
}

export default prisma;
