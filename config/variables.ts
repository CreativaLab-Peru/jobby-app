type Environment = "development" | "production";

const ENV = process.env.NODE_ENV as Environment;

const VARIABLES = {
  development: {
    BETTER_AUTH_URL: "http://localhost:3000",
  },
  production: {
    BETTER_AUTH_URL: "https://www.joinlevely.com",
  },
} as const;

export const VARS = VARIABLES[ENV ?? "development"];
