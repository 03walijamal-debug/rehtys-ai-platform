/* eslint-disable */
import type * as agents from "../agents.js";
import type * as analytics from "../analytics.js";
import type * as chat from "../chat.js";
import type * as documents from "../documents.js";
import type * as email from "../email.js";
import type * as embeddings from "../embeddings.js";
import type * as users from "../users.js";
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  analytics: typeof analytics;
  chat: typeof chat;
  documents: typeof documents;
  email: typeof email;
  embeddings: typeof embeddings;
  users: typeof users;
}>;
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;
export declare const components: {};
