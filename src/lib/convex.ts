import { ConvexReactClient } from "convex/react";

// Convex client — connects the app to your Convex deployment.
// The URL comes from VITE_CONVEX_URL (set in Vercel environment variables).
export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string
);
