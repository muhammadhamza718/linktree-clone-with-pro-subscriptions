import { createAuthClient } from "better-auth/react";

// Initialize Better Auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  // Additional configuration options can be added here
});

// Export authentication functions
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const getSession = authClient.getSession;

// Re-export types for convenience
export type { Session } from "better-auth/react";
