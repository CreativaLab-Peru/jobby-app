# AGENTS.md

## Key Facts

- **App name in `package.json`:** `levely-app` (repo folder is `jobby-app` — legacy name, ignore it)
- **Package manager:** `bun` v1.3.3 (Node 20.x). Never use `npm`/`yarn`/`pnpm`.
- **No tests, no typecheck script, no formatter config.** TypeScript strict mode is fully off.

## Developer Commands

### First-time setup
```bash
bash setup.sh
# Starts PostgreSQL in Docker (port 5555), runs prisma migrate dev, seeds DB
```

### Dev (requires TWO processes)
```bash
bash start_dev.sh
# Runs bun dev (Next.js + Turbopack) AND npx inngest-cli@latest dev concurrently.
# Both are required — background jobs (CV eval, roadmaps, email) will silently fail without Inngest.
```

Or manually in separate terminals:
```bash
bun run dev                  # Next.js with Turbopack
npx inngest-cli@latest dev   # Inngest local dev server
```

### Build
```bash
bun run build
# Expands to: prisma generate && prisma migrate deploy && next build
```

### Lint
```bash
bun run lint   # next lint — ESLint 9, extends next/core-web-vitals + next/typescript
```

## Database

- **PostgreSQL 16** via Docker Compose: `dev-tools/levely-db/docker-compose.yml`
- Local port is **5555** (not 5432): `postgresql://postgres:postgres@localhost:5555/jobby-db`
- ORM: **Prisma 6**

```bash
bunx prisma migrate dev --name <name>   # new migration
bunx prisma migrate deploy              # deploy to prod (also runs in `bun run build`)
bunx prisma generate                    # regenerate client (also runs on postinstall)
bunx prisma migrate status
```

Seed scripts (run manually after migrations when needed):
```bash
node prisma/seed/0-app-configuration.ts                          # main seed (called by setup.sh)
bunx ts-node prisma/seed/3-conf-cv-sections-configuration.ts      # CV section config — re-run per schema version
```

## Architecture

- **Framework:** Next.js 16 / React 19. Turbopack in dev. `viewTransition: true` experimental flag enabled.
- **Route groups in `app/`:**
  - `(auth)` — login, register, forgot-password
  - `(authenticated)` — all app pages (dashboard, cv, routes, opportunities, etc.)
  - `(onboarding)` — onboarding flow
  - `(public)` — marketing/landing pages
  - `(selling)`, `(system)` — misc
- **Auth:** `better-auth` v1.4.5 — NOT next-auth or Clerk. Server config: `lib/auth.ts`. Client: `lib/auth-client.ts`. API route: `app/api/auth/[...all]/route.ts`. Magic link is custom via Inngest (`inngest/functions/send-magic-link-to-email.ts`).
- **No active `middleware.ts`.** `proxy.ts` at root is a decommissioned auth-guard draft — not wired as Next.js middleware and has no runtime effect.
- **Background jobs:** Inngest (`inngest/functions/`). Client ID: `"jobby-app-inngest-v1"`. Key functions: `evaluate-cv`, `upload-new-cv`, `get-and-save-opportunities`, `generate-roadmap`, `send-magic-link-to-email`, `process-temp-cv-evaluation`, `process-temp-cv-migration`. Served at `app/api/inngest/route.ts`.
- **Prisma singleton** at `lib/prisma.ts` (uses `global.prisma` for hot-reload safety). A separate `PrismaClient` instance lives in `lib/auth.ts` for better-auth.
- **UI:** shadcn/ui (stone base, lucide icons) + Tailwind CSS v4. Path alias: `@/` → repo root.
- **State:** Zustand v5. Forms: react-hook-form + Zod v4.
- **External services:** Gemini AI (CV eval/roadmaps), Vapi AI (interviews), MercadoPago + Paddle (payments), Resend (email from `contacto@joinlevely.com`), Vercel Blob + Cloudinary (file storage), Sentry (monitoring, tunnel at `/monitoring`).

## Required Environment Variables

Copy from `.env`. Non-obvious ones:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Local: `postgresql://postgres:postgres@localhost:5555/jobby-db` |
| `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` | better-auth config; URL = `http://localhost:3000` in dev |
| `GEMINI_API_KEY` | Google Gemini — CV evaluation and roadmap generation |
| `INNGEST_API_KEY` | Inngest signing key |
| `JOBBY_MATCH_URL` | External opportunities API: `https://opportunities.joinlevely.com` |
| `RESEND_API_KEY` | Email delivery |
| `FIRST_PASSWORD` | Default password assigned to magic-link-registered users |
| `MP_ACCESS_TOKEN` | MercadoPago |
| `PADDLE_API_KEY` + `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` + `PADDLE_WEBHOOK_SECRET` | Paddle |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (CV PDFs) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry |

## CI / Deployment

- **Trigger:** push a git tag matching `v*`
- **Flow:** Vercel CLI pulls env, injects `APP_VERSION` from tag, runs `vercel build --prod`, then `vercel deploy --prebuilt --prod`
- CI does NOT run `bun install` or `prisma` directly — Vercel handles it via `bun run build`
- Required GitHub secret: `VERCEL_TOKEN`

## CHANGELOG Convention

- File: `CHANGELOG.MD` (uppercase `.MD`)
- Version header format: `# vX.Y.Z - YYYY-MM-DD` (no dot after `v`)
- Section headings are `##`: `## Features`, `## Enhancements`, `## Fixes`, `## System`, `## Technical`
- Ticket links: `[LV-XXXXXX](https://app.clickup.com/t/XXXXXX)` — `LV-` prefix is required
- Newest version at top; oldest at bottom

## Gotchas

- `bun run dev` alone is insufficient — the Inngest CLI must also run or all background processing silently fails
- `@libsql/client` and `@prisma/adapter-libsql` are installed as dependencies but **not active** — the Prisma schema uses plain PostgreSQL only
- Prisma client is auto-generated on `postinstall` and at build time; never commit generated files
- `app/api/tests/` contains manual HTTP routes for ad-hoc live-service testing, not a test runner
- TypeScript strict is fully disabled — type errors will not block builds or CI
