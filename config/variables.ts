type Environment = "development" | "production";

const ENV = process.env.NODE_ENV as Environment;

const VARIABLES = {
  development: {
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
    VAPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "",
    VAPI_ASSISTANT_ID: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "",
  },
  production: {
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "https://www.joinlevely.com",
    VAPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "",
    VAPI_ASSISTANT_ID: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "",
  },
} as const;

export const VARS = VARIABLES[ENV ?? "development"];
