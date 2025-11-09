import { inngest } from "./client";

export const testOnProd = inngest.createFunction(
  {
    id: "test-on-prod",
    name: "Test on prod",
    retries: 3,
  },
  { event: "test.on.prod" },
  async ({ event }) => {
    const payload = event.data;

    const email = payload.email as string;
    // Simulate sleeping for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { email };
  }
);
