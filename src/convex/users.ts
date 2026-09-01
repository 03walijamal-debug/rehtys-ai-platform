import { query, QueryCtx } from "./_generated/server";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Clerk handles authentication - this is a database-only query.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return null;
    }
    return user;
  },
});

/**
 * Use this function internally to get the current user data.
 * With Clerk auth, you should use the Clerk userId to look up users.
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  // Clerk auth - look up user by clerkId if needed
  // For now, return null until Clerk-Convex sync is set up
  return null;
};
