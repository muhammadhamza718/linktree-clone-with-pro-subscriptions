import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-me",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Add email & password authentication
  emailAndPassword: {
    enabled: true,
  },
  // Add social providers (Google, GitHub)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});
