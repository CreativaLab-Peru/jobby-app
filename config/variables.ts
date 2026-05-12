type Environment = "development" | "production";

const ENV = process.env.NODE_ENV as Environment;

const VARIABLES = {
  development: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    VAPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "59548b18-cd77-419c-8ec9-70c26ba36c93",
    VAPI_ASSISTANT_ID: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "51811aaf-e707-4760-9b28-b483c9347e5c",
  },
  production: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "https://www.joinlevely.com",
    VAPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "59548b18-cd77-419c-8ec9-70c26ba36c93",
    VAPI_ASSISTANT_ID: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "51811aaf-e707-4760-9b28-b483c9347e5c",
  },
} as const;


export const VARS = VARIABLES[ENV ?? "development"];
