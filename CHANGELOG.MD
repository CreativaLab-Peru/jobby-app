# WIP

## Fixes
- New way for hot selling (cv-pay and cv-builder)

## Features
- Added english recomendations (only examples).

# v.1.2.0 - 2026-03-30

## Fixes
- Fix generate roadmap
- Fix phone number for 1:1 meeting

# v.1.1.31 - 2026-03-29

## Features
- Configuration of cv section and admin interface

## Fixes
- Hidden roadmap into details of opportunities.
- Removed button Todos mis CVs from sidebar into CV, and added to the sidebar app.
- Fixed the 3 steps for analyzing a CV.
- Removed double buttons in create/upload CVs.
- Fixed create a roadmap for each route.
- Mapped type of opportunity in roadmap create modal.
- Refresh route after each action of the guided flow.
- Name of temporal user to use Mercado pago integration.
- Select sections to store the information of the CV in the database (it's missing in the preview and edit cv).
- Contact with mentor, store phone number and refactor route components.
- It's impossible to get the current credits.

# v1.1.30 - 2026-03-26

## Fixes
- Fixed form in admin monetization.
- Added the modal redirect for analyze a CV.
- New roadmap button for select Opportunities and generate roadmap after validation.
- Now, volunteering, projects and achievements are optional.
- Updated plan information (in production).
- Redirect button into cv preview for see all CVs.
- Fixed issue preventing CV analysis.
- Fixed incorrect roadmap step URLs.
- Added roadmap step statuses to support completing the roadmap.
- Redirect and update the current route in the dashboard is not working
- It's impossible to download CV in English language
- Fixed redirect when we click on different or same route
- Show tags in the opportunities
- Get current plans for opportunities page and delete tags of required or optional for tags of opportunities
- Mis pasos screen is considering the tasks for roadmap
- Validation in opportunities page for avoid issues in the guide step

## Features
- Rich text added for opportunities description in the admin panel and updated the display in the opportunity detail page for end users.
- Popover to accept the cookies added

# v1.1.29 - 2026-03-23

## Features
- Updated `/credits` offers to read limits from plan-linked credit packages (no hardcoded credit amounts in cards).
- Fixed admin plan list preview price format to show PEN/USD correctly from cents.
- Product prices in Paddle have been modified so that they can be edited from within the app.

## Fix
- The discrepancy in the Mercado Pago amount has been corrected: `priceCentsPEN` is now converted to soles (`/100`) before `unit_price` is sent in both payment flows.
- Synced plan creation/editing with credits model: admin now manages `MANAGE_CVS`, `AI_ACTIONS`, `SEARCH_OPPORTUNITIES` and keeps linked `CreditPackage` records updated.
- Added essential validation for plan card items (line-based features): trims empty lines, enforces allowed characters, and caps item length/count to avoid broken forms/cards.
- Plan-based access to opportunities (FREE/STARTER: first only, PRO: all) with simplified blur + CTA lock.
- Improved roadmap generation UX with fullscreen loading and fixed `IN_PROGRESS` status issue after completion.
- Include templateId when we upload a CV
- Refactor in the creating and uploading cv
- Fix issue for improved text in the language of the CV
- Hidde opp type EMPLOYMENT AND INTERNSHIP for the moment
- Title of section to show preview and edit CV
  - Update prompt to generate roadmap
---

# v1.1.28 - 2026-03-12

## Features
- **AI Roadmap**: Generate a personalized, step-by-step roadmap for any opportunity using AI (CV context + opportunity requirements).
- **Roadmap generation via Inngest**: New `generate-roadmap` background function with QueueJob tracking, credit consumption, and route status advancement.
- **Career Accelerator gating**: Only the first roadmap step is visible for free users; STARTER/PRO plan holders see all steps.
- **Roadmap UI**: Vertical stepper component with timeline, action items, estimated duration, resources, and blur overlay for locked steps with upgrade CTA.
- **Roadmap on opportunity detail**: "Generar Roadmap con IA" button on every opportunity detail page with polling for generation status.
- **Route stepper step 4**: Dashboard stepper now includes a 4th "Roadmap personalizado" step after opportunities.

## Enhancements
- **KISS score card**: Removed redundant big number + circle combo and modal. Score now shows compact ring + inline category breakdown bars.
- **KISS improvements section**: Cards expanded by default (no accordions), "Apply All" button, simpler before→after layout, removed framer-motion dependency.
- **KISS recommendations section**: Unified card container with dividers, compact header.
- **KISS analysis header**: Left-aligned compact layout instead of centered full-width block.
- **KISS analysis page layout**: Flattened `max-w-3xl` layout, removed `ScoreBreakdownModal` dependency.

## Schema Changes
- Added `Roadmap` model (`roadmap` table) with unique constraint on `[opportunityId, cvId, userId]`.
- Added `RoadmapStep` model (`roadmap_step` table) with `order`, `title`, `description`, `actionItems` (JSON), `estimatedDays`, `resources` (JSON), `isFree`.
- Extended `RouteStatus` enum with `ROADMAP_PENDING` and `ROADMAP_DONE`.
- Added `roadmaps` relation on `User` and `Opportunity` models.
- Migration: `20260312063620_add_roadmap_models`.

## API
- New `POST /api/roadmap/generate` endpoint to trigger AI roadmap generation.

---

# v1.1.27 - 2026-03-12

## Features
- **Route model**: New `route` table to guide users through a step-by-step journey (CV → Analysis → Opportunities).
- **Route-based sidebar**: Sidebar reorganized with route selector, "Ruta Activa" nav group, and "Mi Cuenta" section.
- **Dashboard stepper**: Dashboard now shows a 3-step progress flow for the active route instead of generic stats.
- **First-time route creation**: Users with no routes are redirected to `/routes/new` to create their first route.
- **Auto-filtering by route**: CV, Evaluations, and Opportunities pages automatically filter by the active route's CV.
- **Auto-advance route status**: Route status advances automatically when CV is created/uploaded, evaluation completes, or opportunities are found.
- **Zustand route store**: Global client state for active route via `use-route-store.ts` and `RouteProvider`.
- **Route-scoped pages**: New `/my-cvs`, `/my-evaluations`, `/my-opportunities` pages that always filter by the active route's CV. Sidebar updated to use these new paths.
- **Analysis & Correction**: Enhanced AI evaluation prompt now generates improved text suggestions per section and suggested content additions, tailored to CV type and target opportunity.
- **Improvements section**: New `ImprovementsSection` component on the evaluation detail page showing current vs. improved text with one-click "Accept & Apply" to update the CV directly.
- **Suggested additions**: AI recommends missing sections/content to add, with impact level (HIGH/MEDIUM/LOW).

## Schema Changes
- Added `Route` model with `RouteStatus` enum (`CV_PENDING`, `CV_CREATED`, `ANALYSIS_PENDING`, `ANALYSIS_DONE`, `OPPORTUNITIES_PENDING`, `OPPORTUNITIES_DONE`).
- Added `routes` relation on `User` model.
- Added optional `route` back-relation on `Cv` model (1:1 via unique `cvId`).
- Added `improvementsJson` field on `CvEvaluation` to store AI-generated improved texts and suggested additions.
- Migration: `20260312045719_add_route_model`.
- Migration: `20260312054210_add_improvements_json_to_evaluation`.

---

# v1.1.26 - 2026-03-11

## Features
- CV templates support: new `cv_template` table and `templateId` field on `cv`.
- CV photo upload: new `cv_photo` table linked to `user`.
- Europass template visual polish and PDF layout fixes.
- Create CV modal redesigned with template preview panel (only for Pasantía/Beca).
- Admin modal now supports `templateId`.

## Enhancements
- Change the price from 9.90 to 19.90 and 19.90 to 29.90
- Update the cv pay page with video and hero

## Fixes
- Some functions of the admin dashboard were fixed, as well as adding a filter by packages.

---

# v1.1.25 - 2026-03-07

## Features
- For admin users we added maintenances with AI (it missing make some tests to validate)

## Fixes
- use inngest functions in all the processes that we want to do in background, like sending emails, generating CVs, etc.

---

# v1.1.24 - 2026-03-07

## Features
- Paddle payment flow on `/cv-pay`: authenticated users see an account-choice dialog (use current or create new), new users go through email capture → payment method selection; after payment, the session is closed if it belonged to a different account and the customer email is pre-filled in the Paddle checkout for correct receipt delivery.
- Improved session detection: replaced client-side `authClient.getSession()` with the `getSession` server action called at page level and passed as prop, adding explicit return types to eliminate `unknown` inferences.

# v1.1.23 - 2026-03-06

## Features
- Implemented a complaint with email delivery.
- Pay first and go added with onboarding password step.

## Fixes
- Recover the cv when we use Google after onboarding and cv builder fast step.
- Add STARTUP opp type to the onboarding and create new cv modal.

# v1.1.22 - 2026-03-04

## Fixes
- Move sections on cv builder page
- Update the metadata for SEO on public pages
- Save tmp cv on db to avoid losing data when user refreshes the page


# v1.1.21 - 2026-03-03

## Fixes
- Delete some step of onboarding to make it faster
- Get all the CVs for opportunities matching list

# v1.1.19 and v1.1.20 - 2026-02-28

## Features
* **Settings & preferences**: Users can now update their username, change their password (for email/password accounts), and have their dark/light theme preference saved per user in the database.
* **Registration & onboarding improvements**: Added a confirm password field to registration flows and implemented a terms acceptance gate before continuing or signing up with Google.

## Technical
- New server actions: `updateUsernameAction`, `changePasswordAction`, `updateThemeAction`.
- New `ThemeSync` client component that fetches user theme preference on mount and applies it via `next-themes`.
- New `GET /api/theme` route handler to read theme from DB and set cookie (allowed in Route Handlers).
- New migration: `add_theme_to_user_preference` — adds `theme TEXT NOT NULL DEFAULT 'light'` to `user_preference` table.
- `GoogleOAuthButton` now accepts an external `disabled` prop.
- Navbar uses SWR (`useSWR("session")`) to reactively update the username without F5.

## Fixes
* **Bug fixes (theme & onboarding)**: Fixed theme flash for unauthenticated users by always writing the `theme` cookie, corrected onboarding step 10 validation to include `confirmPassword`, and added the opportunity type field in onboarding.
* **UX & visibility fixes**: Restored visibility of current resources for users, fixed styling issues in the progress analysis view, mapped recommendation titles in the analysis summary, and improved performance and text on the public CV builder page.

# v1.1.18 - 2026-02-24

## Enhancements
- Improve styles and colors for dark and light mode.
- The roles are commented in the code for the moment.

## Technical
- New types of opportunities added

# v1.1.17 - 2026-02-17

## Features
- Filter opportunities by CV: Added a new filter in the Opportunities section that allows users to select a specific CV and see only the opportunities that match that profile. This helps users find relevant job openings more efficiently.
- Search bar with debounce: Implemented a search bar in the Opportunities section that allows users to

## Fixes
- Fix colors for dark and light mode
- Fixed a bug where multiple CVs with the same name would all be highlighted simultaneously in the selection menus by integrating unique IDs into the selection logic.

# v1.1.16 - 2026-01-20

## Features
- **Advanced Opportunity Filtering**: Added a CV-specific filter in the Opportunities section to match profiles more accurately.
- **Search Functionality**: Implemented a search bar with debounce (500ms) to filter opportunities by job title or company name.
- **Improved IA Matching UX**: Created a new `QuickMatchLoadingModal` with a guaranteed 10-second simulation that shows realistic progress steps ("Analyzing profile", "Searching vacancies", etc.) for a more professional feel.

## Enhancements
- **UI Consistency**: Standardized the size and style of all action buttons in the CV Preview sidebar (Download, Analyze, Match).
- **Responsive Filters**: Improved the layout of the filter bar in the Opportunities and Evaluations screens.
- **Smarter Placeholders**: Updated empty states to provide relevant feedback when filters or search queries yield no results.

## Fixes
- **Duplicate Name Conflict**: Fixed a bug where multiple CVs with the same name would all be highlighted simultaneously in the selection menus by integrating unique IDs into the selection logic.


# v1.1.15 - 2026-02-16

## Features
- New "Quick Match" functionality in sidebar for fast opportunity search without full analysis
- Intelligent credit consumption logic for opportunity matching:
    - Charges 1 `SEARCH_OPPORTUNITIES` credit only when matches are found or for refreshing existing CV opportunities
    - No credit consumed for new CVs with no matches found (Better UX)

## Enhancements
- Updated Privacy Policy and Terms & Conditions
- Updated meetings/booking link
- Professional summary is now OPTIONAL for all CV types
- Education is MANDATORY for: Scholarships, Internships, and Exchange Programs
- Education is OPTIONAL for: Employment
- Improved navigation flow in CV creation form
- Background saving while navigating between sections
- Strict validation only on final step before preview
- Better error handling with toast notifications
- Hidden "Brochure" button in partners section
- Hidden "Resources" link in the main header navigation

# v1.1.11, v1.1.12, v1.1.13, v1.1.14 - 2025-02-06

# Fixes
- Google OAuth sign in and sign up
- Better auth for sending emails
- Auth client variable need to load before rendering the app, to avoid errors on public pages
- Fix the sending emails for google oauth users and users without password

# v1.1.10 - 2025-02-04

# Fixes
- Improve onboarding validations
- Google OAuth
- Fix buttons on public pages

# v1.1.9 - 2025-02-04

# Fixes
- Hide AIESEC logo

# v1.1.8 - 2025-02-03

# Fixes
- Test CI and CD pipelines to generate versions properly
- Fix style of name on header of user


# v1.1.7 - 2025-02-03

# Fixes
- Impossible to save credits after payment and get current credits updated

# v1.1.6

# Fixes
- It's impossible to save credits after payment

# v1.1.3, v1.1.4 and v1.1.5 - 2025-01-30

## QA
- Test CI and CD pipelines

# 1.1.2 - 2025-01-30

## Features
- Added credits package for users to purchase additional CV generations.
- Introduced new subscription plans with varying levels of access and features.
- Payment with Mercado Pago integrated.

## Enhancements
- Updated colors and logo for email sending
- Implemented a new color palette based on tokens:
    - --color-levely-blue: rgb(86 135 255)
    - --color-levely-offwhite: rgb(245 245 240)
    - --color-levely-dark: rgb(25 40 45)
    - --color-levely-green: rgb(210 255 125)
    - --color-levely-pink: rgb(255 85 245)
    - --color-levely-orange: rgb(240 90 80)
- Fully redesigned the main page and dashboard with a more modern, attractive interface aligned with Levely's identity.
- All progress bars and visual elements now use gradients and official brand colors.
- Improved responsiveness across all components and views, optimizing the experience for both mobile and desktop devices.
- Updated global styles and CSS utilities to reflect the new visual identity.
- Enhanced accessibility and contrast for key elements.
- The dashboard now features a clearer structure, improved navigation, and refreshed visual components.
- Removed generic colors and styles, centralizing visual management with the new color tokens.
- Changed the browser window .ico to a more rounded version.
- Some components may still need updating; please use the new color palette for any further changes.

# 1.1.1 - 2025-01-22

## Hotfix
- Fixed build process error related to schema modifications

# 1.1.0 - 2025-01-22

## Fixes
- [JB-86adpv36f](https://app.clickup.com/t/86adpv36f) Fixed upload CV count issue
- [JB-86adpv28j](https://app.clickup.com/t/86adpv28j) Fixed issue where changing the title was impossible
- [JB-tmp](https://app.clickup.com/t/tmp) Various bug fixes

## Technical

- [JB-86acgydd9](https://app.clickup.com/t/86acgydd9) Integrated Inngest for background processing
- [JB-86acfgked](https://app.clickup.com/t/86acfgked) Integrated Mercado Pago
- [JB-86acrwkdh](https://app.clickup.com/t/86acrwkdh) Integrated new landing page with feedback; login and register dropdown menus temporarily hidden; added /pro path with application info, plans, and demo
- Refactored the database schema for improved performance and scalability
- [JB-86acz99x8](https://app.clickup.com/t/86acz99x8) Integrated new modular structure for CV creation, dynamic form, and dynamic preview, rendering sections in order
- Modified schema: added VOLUNTEERING to CvSectionType, and renamed all CvType names for clarity
- Talent onboarding
- Email service integration


