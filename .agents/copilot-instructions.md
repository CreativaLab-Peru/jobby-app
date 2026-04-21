opilot Instructions

## Project Overview
Levely is an AI-powered employability platform that analyzes, improves, and positions professional profiles strategically. We process user information (CV, experience, and goals) to generate a diagnosis, an employability score, and personalized recommendations. Based on that, we match people with relevant opportunities (jobs, scholarships, or programs) and provide a clear improvement roadmap to increase their chances of success.

### Core Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** Prisma (PostgreSQL)
- **Authentication:** Better Auth
- **State Management:** Zustand (UI state only)
- **Data Fetching:** Server Components (Primary), SWR (Client-side revalidation)
- **Mutations:** Server Actions (Strictly no traditional API routes for internal logic)

---

## Architectural Rules

### 1. Feature-Based Directory Structure
Code is organized by business domain in `features/`. Each feature folder must be self-contained:
- `features/[feature-name]/components/`: Feature-specific UI (e.g., `book-card.tsx`, `coach-profile.tsx`).
- `features/[feature-name]/screens/`: Feature-specific UI (e.g., `books-screen.tsx`, `coachs-screen.tsx`).
- `features/[feature-name]/actions/`: All mutations via `'use server'`.
- `features/[feature-name]/store/`: Zustand slices for UI state (Modals, Slide-downs).
- `features/[feature-name]/schemas/`: Zod schemas for validation.
- `features/[feature-name]/types/`: Specific TypeScript interfaces.

### 2. Server-First Logic (KISS Principle)
- **Server Components:** Fetch data directly via Prisma in async components. Use `cache` from React for deduping.
- **Server Actions:** All form submissions and data changes MUST use Server Actions.
  - Always include `'use server'`.
  - Validate inputs with **Zod** at the start of the function.
  - Check session via `better-auth` before proceeding with protected actions (e.g., Reviews).
- **Zustand:** Use strictly for **UI State** (e.g., `isOrganizationChartOpen`). Do not store database entities in Zustand; let the server handle data.

---

## Coding Standards

### Indentation & Style
- **Indent:** 2 spaces.
- **Naming:** PascalCase for components, camelCase for functions/variables.
- **Simplicity:** If a task can be done with a native Next.js feature, do not install a library.

### TypeScript & Validation
- **Strict Types:** Avoid `any`. Use Prisma-generated types or explicit interfaces.
- **Zod Schemas:** Required for every Server Action and Form to ensure data integrity.
- **Strings:** Use template literals for dynamic strings.

### Comments
- Use **JSDoc** for complex business logic (e.g., "Global Config Singleton" logic).
- Focus comments on the **"Why"** (Intent) rather than the "What."

---

## Root Folders & Navigation
- `app/`: App Router (Pages, Layouts). Keep logic minimal here; delegate to `features/`.
- `components/ui/`: Atomic, reusable UI elements (Buttons, Inputs).
- `lib/`: Shared singletons (Prisma client, Better Auth config).
- `hooks/`: Global reusable hooks (e.g., `usePagination`, `useStickyNav`).

---

## Operational Workflows

### Finding Related Code
- Search `features/` by domain (e.g., "Literary Hub" -> `features/library`).
- Check `prisma/schema.prisma` for data structures.

### Validation Steps
1. **Type Check:** `tsc --noEmit`.
2. **Auth Check:** Verify `auth.getSession()` is called in any action modifying the DB.
3. **SEO Check:** Ensure `generateMetadata` is used for dynamic routes (Books, Coaches).
