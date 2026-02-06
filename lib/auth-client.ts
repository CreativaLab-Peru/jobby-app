import { createAuthClient } from "better-auth/client";
import { VARS } from "@/config/variables";

export const authClient = createAuthClient({
  baseURL: VARS.BETTER_AUTH_URL,
});
