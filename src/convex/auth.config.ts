import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Tumhara Clerk issuer URL (Clerk Dashboard → API keys se milta hai)
      domain: "https://improved-raven-2941.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
