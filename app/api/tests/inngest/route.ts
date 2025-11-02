import { inngest } from "@/inngest/functions/client";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const email = query.get("email");
    await inngest.send({
      name: "test.on.prod",
      data: { email }
    });
    return new Response("Processed", { status: 200 });
  } catch (error) {
    console.error("[ERROR_TEST_ON_PROD]", error);
    return new Response("Error", { status: 500 });
  }
}
