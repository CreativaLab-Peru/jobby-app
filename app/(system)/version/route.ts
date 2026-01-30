export async function GET() {
  return Response.json({
    version: process.env.APP_VERSION || "v.1.0.0",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    environment: process.env.NODE_ENV,
  });
}
