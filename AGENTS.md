# Project: jobby-app (Levely)

A Next.js 16 (React 19) job-matching platform with AI-powered CV evaluation, interview preparation, opportunity matching, and career roadmap generation. Uses better-auth for authentication, Inngest for background jobs, and integrates with Vapi AI (interviews), Gemini AI (CV/roadmap analysis), MercadoPago + Paddle (payments), and Vercel Blob + Cloudinary (file storage).

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.7 + React 19.2.1, Turbopack in dev |
| Language | TypeScript 5.9 (strict mode OFF) |
| Database | PostgreSQL 16 via Prisma 6 |
| Auth | better-auth v1.4.5 (NOT next-auth or Clerk) |
| Background Jobs | Inngest v3.54.0 |
| UI | shadcn/ui (stone base), Tailwind CSS v4, lucide-react |
| Forms | react-hook-form + Zod v4 |
| State | Zustand v5 |
| Payments | MercadoPago + Paddle |
| AI | Gemini (CV eval/roadmaps), Vapi AI (interviews) |
| Email | Resend |
| Storage | Vercel Blob + Cloudinary |
| Monitoring | Sentry (tunnel at `/monitoring`) |
| Package Manager | bun v1.3.3 |

**References:**
- Next.js docs: https://nextjs.org/docs
- better-auth: https://www.better-auth.com/docs
- Inngest: https://www.inngest.com/docs
- Prisma: https://www.prisma.io/docs

---

## Project Structure

Tree is a curated subset; not all source files are shown.

```
jobby-app/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth group (login, register, forgot-password, logout)
│   ├── (authenticated)/         # All authenticated app pages
│   │   ├── admin/              # Admin panel (companies, CV, evaluations, payments, etc.)
│   │   ├── billing/            # Billing page
│   │   ├── booking/            # Booking system
│   │   ├── cv/                 # CV management (root, detail, edit, preview)
│   │   ├── complaints/         # User complaints
│   │   ├── credits/           # Credits balance
│   │   ├── dashboard/         # Main dashboard
│   │   ├── evaluations/        # CV evaluations list
│   │   ├── interviews/        # Interview sessions
│   │   ├── my-cv/             # User's CV
│   │   ├── my-cvs/            # Multiple CVs list
│   │   ├── my-evaluation/     # User's evaluation results
│   │   ├── my-opportunities/  # Matched opportunities
│   │   ├── my-roadmaps/       # User's career roadmaps
│   │   ├── opportunities/      # Browse opportunities
│   │   ├── preferences/       # User preferences
│   │   ├── profile/           # User profile
│   │   ├── routes/           # Career route management
│   │   ├── settings/         # App settings
│   │   ├── transactions/      # Payment transactions
│   │   └── users/            # User management
│   ├── (onboarding)/          # Onboarding flow
│   ├── (public)/              # Marketing/landing pages (home, companies, experts, etc.)
│   ├── (selling)/             # Selling/marketing content
│   ├── (system)/              # System pages
│   ├── (companies)/           # Company-related public pages
│   ├── api/                   # API routes
│   │   ├── auth/             # better-auth endpoints
│   │   ├── cv/               # CV-related API
│   │   ├── credits/          # Credits API
│   │   ├── inngest/          # Inngest webhook handler
│   │   ├── opportunities/     # Opportunities API
│   │   ├── payments/          # Payment webhooks (MercadoPago, Paddle)
│   │   ├── roadmap/          # Roadmap API
│   │   └── webhooks/         # External webhooks
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Error boundary
│   ├── global-error.tsx     # Global error handler
│   └── not-found.tsx        # 404 page
├── components/               # Shared React components
│   ├── ui/                   # shadcn/ui components + custom
│   ├── form/                 # Form-related components
│   ├── public/               # Public-facing components
│   ├── rich-text/            # Rich text editor components
│   ├── sidebar/              # Sidebar components
│   ├── tasks/                # Floating task panel components
│   ├── upload/               # Upload components
│   ├── pdf-preview/          # PDF preview components
│   └── shared/               # Shared components
├── features/                 # Feature-based modules
│   ├── admin-configs/        # Admin configuration management
│   ├── analysis/             # CV/analysis features
│   ├── authentication/       # Auth components, actions, schemas
│   ├── billing/              # Payment integration (MercadoPago, Paddle)
│   ├── booking/              # Booking system
│   ├── company/              # Company management
│   ├── complaints/           # Complaint system
│   ├── credits/              # Credits system
│   ├── cv/                   # CV builder, evaluation, processing
│   ├── cv-config/            # CV configuration
│   ├── cv-preview/           # CV preview components
│   ├── dashboard/            # Dashboard components
│   ├── diagnostico-cv/       # CV diagnostic feature
│   ├── emails/               # Email templates
│   ├── home/                 # Landing page sections
│   ├── interview/            # AI interview preparation (Vapi)
│   ├── jobs/                 # Job-related features
│   ├── newletter/            # Newsletter
│   ├── onboarding/           # User onboarding flow
│   ├── opportunities/        # Job opportunities matching
│   ├── processors/           # Inngest job processors
│   ├── roadmap/              # Career roadmap generation
│   ├── routes/               # Career route management
│   ├── selling/              # Selling features
│   ├── settings/             # Settings screens
│   ├── share/                # Sharing features
│   ├── temp-evaluation/      # Temporary evaluation feature
│   ├── upload-cv/            # CV upload feature
│   └── user/                 # User-related features
├── inngest/                  # Inngest background jobs
│   ├── functions/            # Inngest function definitions
│   │   ├── evaluate-cv.ts    # CV evaluation job
│   │   ├── evaluate-diagnostic-cv.ts # Diagnostic CV evaluation
│   │   ├── generate-roadmap.ts # Roadmap generation
│   │   ├── get-and-save-opportunities.ts # Opportunity matching
│   │   ├── send-magic-link-to-email.ts # Magic link auth email
│   │   ├── upload-new-cv.ts  # CV upload processing
│   │   └── ...               # Other background jobs
│   └── utils/               # Inngest utilities
├── lib/                      # Core libraries
│   ├── auth.ts              # better-auth server config
│   ├── auth-client.ts       # better-auth client config
│   ├── axios-client.ts      # Axios instance
│   ├── cloudinary.ts        # Cloudinary config
│   ├── prisma.ts            # Prisma singleton
│   ├── resend.ts            # Resend email client
│   ├── routes.ts            # Route definitions
│   └── utils/               # Utility functions
├── store/                    # Zustand stores
│   ├── use-cookie-store.ts
│   ├── use-credits-store.ts
│   ├── use-route-store.ts
│   ├── use-sidebar-store.ts
│   └── use-task-store.ts
├── providers/                # React context providers
│   └── credits-provider.tsx
├── hooks/                    # Custom React hooks
│   ├── use-analysis-store.ts
│   ├── use-auth-cta-redirect.ts
│   ├── use-background-tasks.ts
│   ├── use-debug.ts
│   ├── use-mobile.tsx
│   └── use-payment-success.ts
├── enums/                    # TypeScript enums
│   └── index.ts             # JobStatus, RouteStatus, OpportunityType, TaskType
├── types/                    # TypeScript types
│   ├── i18n/
│   └── index.ts
├── const/                    # Constants
│   ├── analysis.ts
│   └── cv.ts
├── config/
│   └── variables.ts         # Environment-specific config (dev/prod)
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Full database schema
│   ├── migrations/          # Prisma migrations
│   ├── seed/                # Database seed scripts
│   └── auth.ts              # Prisma adapter for better-auth
└── package.json
```

---

## Architecture

### Navigation Structure

**Route Groups** in `app/`:
```
(app)/
├── (auth)           → Login, register, forgot-password, logout
├── (authenticated)  → All authenticated app pages (dashboard, CV, routes, etc.)
├── (onboarding)     → Onboarding flow
├── (public)         → Marketing/landing pages
├── (selling)        → Selling/marketing content
├── (system)         → System pages
└── (companies)      → Company-related public pages
```

**Auth Flow** (`app/(auth)/layout.tsx`):
- Redirects authenticated users to dashboard
- Session check via `getSession()` action

**Authenticated Layout** (`app/(authenticated)/layout.tsx`):
- Sidebar navigation (AppSidebar)
- NavbarWrapper for mobile
- CreditsProvider, PaddleProvider, RouteProvider, ThemeSync
- FloatingTaskPanel and TaskHydrator for background tasks

### State Management

**Zustand** (client state):

| Store | Purpose |
|-------|---------|
| `use-credits-store.ts` | User credit balance, refreshCredits |
| `use-route-store.ts` | Career route state |
| `use-sidebar-store.ts` | Sidebar UI state |
| `use-task-store.ts` | Background task state |
| `use-cookie-store.ts` | Cookie state |

**Server State**: React Query patterns in hooks + direct Prisma queries in server components

### Auth System

**better-auth v1.4.5** (NOT next-auth or Clerk):
- Server config: `lib/auth.ts`
- Client config: `lib/auth-client.ts`
- Prisma adapter for PostgreSQL
- Magic link via Inngest (`send-magic-link-to-email.ts`)
- Session: 7 days expiry, 1-day update age, 5-minute cookie cache
- Email verification on signup with auto-sign-in after verification
- Password reset via email

**Key Auth Files**:
- `lib/auth.ts` — better-auth server configuration
- `lib/auth-client.ts` — better-auth client configuration
- `prisma/auth.ts` — Prisma adapter for better-auth
- `app/api/auth/[...all]/route.ts` — Auth API route handler

### Background Jobs (Inngest)

**Client ID**: `jobby-app-inngest-v1`

**Key Functions**:
| Function | Purpose |
|----------|---------|
| `evaluate-cv` | AI-powered CV evaluation using Gemini |
| `evaluate-diagnostic-cv` | Diagnostic CV evaluation |
| `generate-roadmap` | Career roadmap generation using Gemini |
| `get-and-save-opportunities` | Fetch and match external opportunities |
| `send-magic-link-to-email` | Magic link authentication email |
| `upload-new-cv` | Process newly uploaded CV |
| `process-temp-cv-evaluation` | Temporary CV evaluation processing |
| `process-temp-cv-migration` | Temporary CV data migration |
| `send-diagnostic-access-email` | Diagnostic access email |
| `send-diagnostic-results-email` | Diagnostic results email |

**Dev requirement**: Both `bun run dev` AND `npx inngest-cli@latest dev` must run concurrently

### Payments

**Dual Payment Providers**:

| Provider | Region | Currency |
|----------|--------|----------|
| MercadoPago | Latin America | PEN |
| Paddle | International | USD |

**Paddle Integration**:
- PaddleProvider wraps authenticated layout
- Uses `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` for frontend
- Webhook handler at `app/api/webhooks/paddle/route.ts`

### AI Integrations

**Gemini** (Google):
- CV evaluation and scoring
- Roadmap generation
- Requires `GEMINI_API_KEY`

**Vapi AI**:
- AI-powered interview preparation
- Uses `NEXT_PUBLIC_VAPI_PUBLIC_KEY` and `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
- Config in `config/variables.ts`

---

## Features

### CV Builder (`features/cv/`)
- **Screens**: `cv-builder-screen.tsx`, `cv-processing-screen.tsx`
- **Templates**: Harvard, Europass, STEM, Fulbright (defined in `CvTemplate` model)
- **Sections**: Dynamic CV sections via `CvSection` model
- **AI Evaluation**: Uses Gemini to analyze and score CVs via `evaluate-cv` Inngest function
- **Storage**: Attachments stored in Vercel Blob, photos in Cloudinary

### CV Evaluation (`features/diagnostico-cv/`)
- **Purpose**: AI-powered CV diagnostic and improvement suggestions
- **Flow**: Upload CV → Process via Inngest → AI analysis → Results email
- **Components**: Screens, components, hooks, templates, types, utils
- **Processor**: `process-diagnostico.ts` in `features/processors/`

### Career Routes (`features/routes/`)
- **Purpose**: Personalized career path management
- **Model**: `Route` with status tracking (CV_PENDING → ROADMAP_DONE → PROGRAM_DONE)
- **Components**: RouteProvider context, route management screens
- **Matching**: Links to Opportunities and Roadmaps

### Opportunities (`features/opportunities/`)
- **Purpose**: Job/internship/scholarship matching
- **Types**: INTERNSHIP, SCHOLARSHIP, EXCHANGE_PROGRAM, EMPLOYMENT, STARTUP
- **Matching**: Uses `match` score (0-1) from external API
- **Sources**: External API at `JOBBY_MATCH_URL` (`https://opportunities.joinlevely.com`)
- **Key Files**:
  - `get-opportunities.ts` — Fetch opportunities
  - `get-opportunities-from-engine.ts` — Engine-based matching
  - `save-opportunities.ts` — Persist matched opportunities

### Interview Preparation (`features/interview/`)
- **Platform**: Vapi AI for AI-powered interviews
- **Session Model**: `InterviewSession` with Vapi call integration
- **KPIs**: Overall score, confidence, clarity, alignment (0-100)
- **Feedback**: AI-generated feedback and transcript storage
- **Attempts**: `InterviewAttempt` tracks timing and finish reason

### Roadmaps (`features/roadmap/`)
- **Purpose**: Generated career roadmaps using Gemini AI
- **Model**: `Roadmap` with `RoadmapStep` children
- **Generation**: `generate-roadmap` Inngest function
- **Prompts**: Custom prompts in `features/roadmap/prompts/`

### Billing (`features/billing/`)
- **Plans**: `PaymentPlan` with `PaymentType` (ONE_TIME)
- **Pricing**: Dual currency (PEN for MercadoPago, USD for Paddle)
- **Features**: JSON-based feature flags per plan
- **User Payments**: `UserPayment` tracks active subscriptions
- **Credits**: `CreditPackage` and `UserCreditBalance` for credit-based system

### Admin Panel (`app/(authenticated)/admin/`)
- **Sections**: Companies, CV, Evaluations, Opportunities, Payments, Plans, Credit Packages, Balances, Complaints, Jobs, Interviews, CV Evaluation Prompts
- **Access**: Role-based (`UserRole` enum: USER, ADMIN, SUPER_ADMIN)
- **Management**: Full CRUD for all entities

### Onboarding (`features/onboarding/`)
- **Purpose**: Guide new users through initial setup
- **Components**: Screens, store, schemas, actions
- **Flow**: Multi-step onboarding process

---

## API Design

### Auth Endpoints (better-auth)
- `POST /api/auth/sign-up` — User registration
- `POST /api/auth/sign-in` — User login
- `POST /api/auth/sign-out` — User logout
- `GET /api/auth/get-session` — Get current session
- `POST /api/auth/verify-email` — Email verification
- `POST /api/auth/forgot-password` — Password reset request
- `POST /api/auth/reset-password` — Password reset

### CV Endpoints
- `GET /api/cv` — List user's CVs
- `POST /api/cv` — Create new CV
- `GET /api/cv/:id` — Get CV by ID
- `PUT /api/cv/:id` — Update CV
- `DELETE /api/cv/:id` — Delete CV
- `POST /api/cv/:id/evaluate` — Trigger CV evaluation

### Credits Endpoints
- `GET /api/credits` — Get user credit balance
- `POST /api/credits/purchase` — Purchase credits

### Opportunities Endpoints
- `GET /api/opportunities` — List matched opportunities
- `GET /api/opportunities/external` — Fetch from external engine

### Payments Endpoints
- `POST /api/webhooks/mercadopago` — MercadoPago payment notifications
- `POST /api/webhooks/paddle` — Paddle subscription updates

### Inngest Endpoint
- `POST /api/inngest` — Inngest event webhook handler

---

## Key Patterns & Conventions

### File Naming
- **Files**: kebab-case or camelCase depending on convention
- **Directories**: kebab-case
- **Components**: PascalCase for React components

### Component Patterns
```
features/<feature>/
├── actions/      # Server actions
├── components/   # Feature-specific components
├── hooks/        # Feature-specific hooks
├── screens/      # Full page components
├── schemas/      # Zod validation schemas
├── consts/       # Feature constants
├── types/        # TypeScript types
└── utils/        # Utility functions
```

### Server Actions
- Use `actions` directory in features
- Return structured results (often with `success` boolean)
- Handle errors gracefully with user-friendly messages

### API Routes
- `app/api/` follows Next.js App Router conventions
- Webhook handlers validate signatures (MercadoPago, Paddle)
- Use Prisma directly in API routes for complex queries

### Form Validation
- Use Zod schemas in `features/<feature>/schemas/`
- react-hook-form with Zod resolver
- Shared validation via `lib/schemas/` when applicable

### State Management
- Zustand for client-side state (credits, sidebar, tasks)
- Server components for data fetching
- React Query patterns in hooks for client-side data

---

## Development Workflow

### First-time setup
```bash
bash setup.sh
# Starts PostgreSQL in Docker (port 5555), runs prisma migrate dev, seeds DB
```

### Dev (requires TWO processes)
```bash
bash start_dev.sh
# Runs bun dev (Next.js + Turbopack) AND npx inngest-cli@latest dev concurrently
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

### Database
```bash
bunx prisma migrate dev --name <name>   # new migration
bunx prisma migrate deploy              # deploy to prod
bunx prisma generate                    # regenerate client
bunx prisma migrate status
```

### Seed scripts
```bash
node prisma/seed/0-app-configuration.ts                          # main seed
bunx ts-node prisma/seed/3-conf-cv-sections-configuration.ts      # CV section config
```

---

## Database

- **PostgreSQL 16** via Docker Compose: `dev-tools/levely-db/docker-compose.yml`
- Local port is **5555**: `postgresql://postgres:postgres@localhost:5555/jobby-db`
- ORM: **Prisma 6**
- Prisma singleton at `lib/prisma.ts` (uses `global.prisma` for hot-reload safety)
- Separate `PrismaClient` in `lib/auth.ts` for better-auth

### Key Models
- `User` — Core user entity with auth relations
- `Cv` — CV with template, sections, evaluations
- `CvSection` — Dynamic CV content sections
- `CvEvaluation` — AI evaluation results
- `Opportunity` — Job/internship/scholarship opportunities
- `InterviewSession` — AI interview sessions with Vapi
- `Route` — Career route with status tracking
- `Roadmap` — AI-generated career roadmaps
- `PaymentPlan` / `UserPayment` — Subscription plans
- `UserCreditBalance` / `CreditTransaction` — Credit system
- `Company` / `CompanyMember` — Company management

---

## Environment Variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Local: `postgresql://postgres:postgres@localhost:5555/jobby-db` |
| `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` | better-auth; URL = `http://localhost:3000` in dev |
| `GEMINI_API_KEY` | Google Gemini — CV evaluation and roadmap generation |
| `INNGEST_API_KEY` | Inngest signing key |
| `JOBBY_MATCH_URL` | External opportunities API: `https://opportunities.joinlevely.com` |
| `RESEND_API_KEY` | Email delivery |
| `FIRST_PASSWORD` | Default password for magic-link users |
| `MP_ACCESS_TOKEN` | MercadoPago |
| `PADDLE_API_KEY` + `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` + `PADDLE_WEBHOOK_SECRET` | Paddle |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (CV PDFs) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` + `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi AI |

---

## CI / Deployment

- **Trigger:** push a git tag matching `v*`
- **Flow:** Vercel CLI pulls env, injects `APP_VERSION` from tag, runs `vercel build --prod`, then `vercel deploy --prebuilt --prod`
- CI does NOT run `bun install` or `prisma` — Vercel handles via `bun run build`
- Required GitHub secret: `VERCEL_TOKEN`

---

## Good Practices

1. **Use `@/` alias** for all project imports
2. **Server components first**: Use server components for data fetching, client components for interactivity
3. **better-auth for auth**: NOT next-auth or Clerk
4. **Inngest for background jobs**: Both dev server processes must run concurrently
5. **Prisma singleton**: Use `lib/prisma.ts` singleton, never create multiple instances
6. **Zustand for client state**: Credits, sidebar, tasks, cookies
7. **Form validation**: Zod schemas with react-hook-form
8. **Dual payments**: MercadoPago (LATAM) + Paddle (international)
9. **Environment config**: Use `config/variables.ts` for env-specific values
10. **Sentry monitoring**: Tunnel at `/monitoring` for ad-blocker绕过

---

## Important Notes

- **`bun run dev` alone is insufficient** — Inngest CLI must also run or background processing silently fails
- **`@libsql/client` and `@prisma/adapter-libsql` are installed but NOT active** — Prisma uses plain PostgreSQL only
- **TypeScript strict is fully disabled** — type errors will not block builds or CI
- **No active `middleware.ts`** — `proxy.ts` at root is decommissioned
- **CHANGELOG.MD** uses format: `# vX.Y.Z - YYYY-MM-DD` with `##` section headings
- **Ticket links**: `[LV-XXXXXX](https://app.clickup.com/t/XXXXXX)` — `LV-` prefix required

---

## File Reference

### Auth
| File | Purpose |
|------|---------|
| `lib/auth.ts` | better-auth server configuration |
| `lib/auth-client.ts` | better-auth client configuration |
| `prisma/auth.ts` | Prisma adapter for better-auth |
| `app/api/auth/[...all]/route.ts` | Auth API route handler |
| `features/authentication/actions/` | Auth server actions (get-user, get-session, etc.) |

### CV Feature
| File | Purpose |
|------|---------|
| `features/cv/screens/cv-builder-screen.tsx` | CV builder UI |
| `features/cv/screens/cv-processing-screen.tsx` | CV processing status |
| `features/cv/components/` | CV-related components |
| `features/cv/hooks/` | CV-related hooks |
| `features/cv/schema/` | CV validation schemas |
| `features/cv/actions/` | CV server actions |

### Background Jobs
| File | Purpose |
|------|---------|
| `inngest/functions/evaluate-cv.ts` | CV evaluation Inngest function |
| `inngest/functions/generate-roadmap.ts` | Roadmap generation |
| `inngest/functions/send-magic-link-to-email.ts` | Magic link email |
| `app/api/inngest/route.ts` | Inngest webhook handler |

### Payments
| File | Purpose |
|------|---------|
| `features/billing/components/paddle-provider.tsx` | Paddle context provider |
| `app/api/webhooks/mercadopago/route.ts` | MercadoPago webhook |
| `app/api/webhooks/paddle/route.ts` | Paddle webhook |

### Stores
| File | Purpose |
|------|---------|
| `store/use-credits-store.ts` | Credit balance management |
| `store/use-route-store.ts` | Career route state |
| `store/use-sidebar-store.ts` | Sidebar UI state |
| `store/use-task-store.ts` | Background task state |
| `store/use-cookie-store.ts` | Cookie state |

### Providers
| File | Purpose |
|------|---------|
| `providers/credits-provider.tsx` | Loads credits once on app init |
| `components/ui/sidebar` | Sidebar component |
| `features/routes/components/route-provider.tsx` | Route context |