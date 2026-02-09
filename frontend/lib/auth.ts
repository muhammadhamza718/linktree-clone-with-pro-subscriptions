import { createAuthClient } from "better-auth/react";

/**
 * Authentication Client Configuration
 * Uses Better Auth for handling user sessions and authentication flows.
 */

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
});

/**
 * Sign in a user
 * @see https://better-auth.com/docs/concepts/client#sign-in
 */
export const signIn = authClient.signIn;

/**
 * Sign out the current user
 * @see https://better-auth.com/docs/concepts/client#sign-out
 */
export const signOut = authClient.signOut;

/**
 * Get the current user session
 * @see https://better-auth.com/docs/concepts/client#get-session
 */
export const useSession = authClient.useSession;

// Direct session access (non-hook)
export const getSession = authClient.getSession;

export type { Session } from "better-auth/react";
