# v1.2.29 - 2026-06-28

## Features
- New landing page: Radar de Becas at `/radar` - Dark mode landing page for the scholarship newsletter product. Replaces old newsletter page at `/newsletter` which now redirects to `/radar`. Uses existing Kit (ConvertKit) form for subscriptions.

## Enhancements
- Replace text "levely" logo with real `logo_dark.png` in mentoria-landing-screen.tsx and diagnostico-landing-screen.tsx nav bars.

# v1.2.28 - 2026-06-23

## Features
- New product: Mentoría 1:1 - Landing page at `/mentoria` with form flow (name, email, WhatsApp, Chevening plan) → Resend email confirmation with MercadoPago payment link and WhatsApp contact button.

# v1.2.27 - 2026-06-16

# Fixes
- Fix text syntaxes
- Fix percent of opportunities

# v1.2.26 - 2026-06-15

# Enhancements
- Fix text in diagnosis landing.
- Add badge of the message to send a email to the user.
- Add badges to inform the user that we already send a email after payment.
- Verify if the token is already used.

# v1.2.25 - 2026-06-09

# Features
- New product: Diagnostic CV (CV Diagnóstico) - A tool that analyzes a user's CV and provides insights and recommendations for improvement.
- Maintenances for countries and scholarships

# v1.2.24 - 2026-06-09

## Features
- Diagnostic cv new product (first version, we need to do some tests to validate the product)

# v1.2.23 - 2026-05-18

## Fixes:

- [LV-86aheqkxw](https://app.clickup.com/t/86aheqkxw) Añadiendo logs para el usuario al momento de registrarse
- [LV-86ahekvn8](https://app.clickup.com/t/86ahekvn8) Agregado el color secundario en el onboarding de empresas
- [LV-86ahdzxhn](https://app.clickup.com/t/86ahdzxhn) Corregido el problema de los estilos del componente de recuperar contraseña

## Features

- [LV-86ahhh0w9](https://app.clickup.com/t/86ahhh0w9) Agregado el desplegable de herramientas y las nuevas paginas (Universidades y Herramientas
- [LV-86ahbnxbe](https://app.clickup.com/t/86ahbnxbe) Integracion de onboarding para empresas e invitaciones. Con validaciones principales de empresa (tenant)

# v1.2.22 - 2026-05-12

## Enhancements

- [LV-86ahdzxkv](https://app.clickup.com/t/86ahdzxkv) Mejorado el modal de subir CV con un drag and drop

## Fixes

- [LV-86ahdgwg0](https://app.clickup.com/t/86ahdgwg0) Cambiado el focus del input de nombre de cv, ademas de omogenizar los estilos entre ambos modales
- [LV-86ahdgtae](https://app.clickup.com/t/86ahdgtae) Arreglado el boton de inicio en el sidebar/footer del usuario
- [LV-86ahdgrwn](https://app.clickup.com/t/86ahdgrwn) Arreglado el boton de princing al hacer hover
- [LV-86ahdhbgk](https://app.clickup.com/t/86ahdhbgk) Arreglado el error con la ventana flotante y ventana flotante al crear un CV manual

# v1.2.21 - 2026-05-07

## Feature

- [LV-86ah912y4](https://app.clickup.com/t/86ah912y4) Agregando onboarding de empresas, además de una nueva tabla CompaniesPreferences

## Enhancements

- [LV-86ahbchqc](https://app.clickup.com/t/86ahbchqc) Cambiado el color para el modo oscuro, cambiados algunos textos y estilos de los cards en el hero

## Fixes

- [LV-86ahb5v1h](https://app.clickup.com/t/86ahb5v1h) Mejorado el responsive de la pagina de de bienvenida del onboarding
- [LV-86ahb5u4e](https://app.clickup.com/t/86ahb5u4e) Arreglado el error que no cerraba el modal, ademas de agregar una pantalla de carga "Procesando"
- [LV-86ahb5q5e](https://app.clickup.com/t/86ahb5q5e) Arreglado el error que no actualiza el proceso en el stepper de la ruta
- [LV-86ahb5ttj](https://app.clickup.com/t/86ahb5ttj) Arreglado el refresh cuando se hace un match de oportunidades, ademas de agregar una pantalla de "Procesando"

# v1.2.20 - 2026-05-04

## Enhancements

- [LV-86ah6jkxg](https://app.clickup.com/t/86ah6jkxg) Agregada tabla para guardar la duracion de la entrevista, y tambien usar la tabla AppCondig para definir la duracion de una entrevista
- [LV-86ah6jp4x](https://app.clickup.com/t/86ah6jp4x) Agregando la tabla de configuracion global de la aplicacion
- [LV-86ah46qf4](https://app.clickup.com/t/86ah46qf4) Cambiado la experiencia del onboarding y agregado Emprendedor como opcion
- [LV-86ah46uqa](https://app.clickup.com/t/86ah46uqa) Añadidos nuevos cards, cambiados los contenidos de los pages y mejora en el componente de planes y créditos en la página principal y dentro de la app
- [LV-86ah46ne2](https://app.clickup.com/t/86ah46ne2) Mejorado el diseño del primer paso del onboarding

## Fixes

- [LV-86ah46guw](https://app.clickup.com/t/86ah46guw) Cambiado el video y agregados dos video demos que cambian segun el tema seleccionado por el usuario
- [LV-86ah46r9c](https://app.clickup.com/t/86ah46r9c) Mejoras en la portada del onboarding
- [LV-86ah46jte](https://app.clickup.com/t/86ah46jte) Removido el checkbox de aceptar terminos, asi como guardar que el usuario acepto terminos y condiciones en BD
- [LV-86ah46m4v](https://app.clickup.com/t/86ah46m4v) Cambiado el color del mensaje de estado de credito
- [LV-86ah46kej](https://app.clickup.com/t/86ah46kej) Corrección de errores/tamanios de los botones en el componente de pasos de rutas
- [LV-86ah46k4x](https://app.clickup.com/t/86ah46k4x) Responsive mejorado en el componente de pasos de rutas
- [LV-86ah46hy0](https://app.clickup.com/t/86ah46hy0) Cambiado el nombre en el footer de "News letter" a "Newsletter"

# v1.2.16, v1.2.17, v1.2.18 and v1.2.19 - 2026-04-27

## System

- new version of Inngest 3.54.0

## Fixes

- [LV-86ah46jam](https://app.clickup.com/t/86ah46jam) UK page is not showing the correct content

## Enhancements

- [LV-86ah0572u](https://app.clickup.com/t/86ah0572u) Implementación de ventanas flotantes para los procesos realizados por el usuario

# v1.2.15 - 2026-04-23

## Enhancements

- [LV-86ah05441](https://app.clickup.com/t/86ah05441) Barra de progreso y secciones colapsables por pasos de rutas
- [LV-86ah05a48](https://app.clickup.com/t/86ah05a48) Rediseño de la interfaz de pasos de rutas y optimización de menús desplegables.
- [LV-86ah051qk](https://app.clickup.com/t/86ah051qk) Gestión integral (CRUD) de sugerencias durante la creación de nuevas rutas.
- [LV-86ah04pbj](https://app.clickup.com/t/86ah04pbj) Optimización del flujo de onboarding y actualización de descripciones en tipos de oportunidades.
- [LV-86ah04zc8](https://app.clickup.com/t/86ah04zc8) Integración de enlaces legales: Términos y Condiciones y Política de Privacidad.
- [LV-86ah1g1r7](https://app.clickup.com/t/86ah1g1r7) Nueva interfaz de ventas especializada para el programa de becas Chevening.

## Fixes

- [LV-86ah04rx8](https://app.clickup.com/t/86ah04rx8) Sincronización dinámica de nombres de planes basada en la configuración del panel administrativo.
- [LV-86ah04qrr](https://app.clickup.com/t/86ah04qrr) Corrección del efecto de desenfoque (blur) en la visualización de oportunidades para usuarios sin suscripción activa.
- [LV-86agzvjht](https://app.clickup.com/t/86agzvjht) Integración de nuevos logos de partners y migración de grid estático a carrusel dinámico.
- [LV-86agzfm0c](https://app.clickup.com/t/86agzfm0c) Refactorización de la página de Partners: separación de componentes y actualización de contenido.
- [LV-86agyg1cv](https://app.clickup.com/t/86agyg1cv) Actualización de copys y metadatos en el componente de carga y creación de CV.
- [LV-86agyg30e](https://app.clickup.com/t/86agyg30e) Implementación de tarjeta informativa para la funcionalidad de generación de roadmaps.
- [LV-86agyg3pd](https://app.clickup.com/t/86agyg3pd) Corrección de la lógica de redirección condicional basada en el estado de autenticación (Auth).
- [LV-86agyg47c](https://app.clickup.com/t/86agyg47c) Deshabilitación de la sección "Career Accelerator" en el footer de la plataforma.
- [LV-86agyg4n0](https://app.clickup.com/t/86agyg4n0) Desactivación temporal del módulo de beneficios para partners en la interfaz.
- [LV-86agyg57f](https://app.clickup.com/t/86agyg57f) Rediseño del componente Newsletter para alineación con la identidad visual del sitio.
- [LV-86agyg5re](https://app.clickup.com/t/86agyg5re) Ajuste de clases CSS para corregir el espaciado tipográfico excesivo (letter-spacing).
- [LV-86agyg67w](https://app.clickup.com/t/86agyg67w) Localización integral al español de la sección de "Tips" para todas las versiones de idioma.
- [LV-86ah0r7qw](https://app.clickup.com/t/86ah0r7qw) Implementación de View Transitions API en rutas públicas para mejorar la experiencia de usuario.
- [LV-86ah05bwb](https://app.clickup.com/t/86ah05bwb) Desarrollo de interfaces para la visualización de becas en el flujo previo al onboarding.

# v1.2.13 - 2026-04-16

## Fixes

- [LV-86agxbt3r](https://app.clickup.com/t/86agxbt3r) Analisis y obtencion de oportunidades guiadas por una beca en especifico
- [LV-86agxcnpq](https://app.clickup.com/t/86agxcnpq) Crear interfaces de administrador de prompts para evaluaciones relacionadas a una beca

# v1.2.12 - 2026-04-15

## Fixes

- [LV-86agwg5t2](https://app.clickup.com/t/86agwg5t2) Solved redirect after click in the CV modal
- [LV-86agwg4wj](https://app.clickup.com/t/86agwg4wj) Solved recommended sections when you close the modal
- [LV-86agwg10m](https://app.clickup.com/t/86agwg10m) Solved redirection after create a new route

# v1.2.11 - 2026-04-14

## Fixes

- [LV-86agwg5t2](https://app.clickup.com/t/86agwg5t2) Solved redirect after click in the CV modal
- [LV-86agwg4wj](https://app.clickup.com/t/86agwg4wj) Solved recommended sections when you close the modal
- [LV-86agwg10m](https://app.clickup.com/t/86agwg10m) Solved redirection after create a new route
- [LV-86agvnwk6](https://app.clickup.com/t/86agvnwk6) Fixed double charging of IA Actions credits and CV credits. Manual for new users
- [LV-86agv3my9](https://app.clickup.com/t/86agv3my9) Now the route generation mode only allows generating a roadmap depending on the plan
- [LV-86agv3kgk](https://app.clickup.com/t/86agv3kgk) Fixed the redirect to prices from View Builder and Accelerator, as well as updating the names
- [LV-86agpvxe4](https://app.clickup.com/t/86agpvxe4) Now you can only match opportunities by route
- [LV-86agv3gvm](https://app.clickup.com/t/86agv3gvm) KISS applied to the main page when there are no routes
- [LV-86agvmdgg](https://app.clickup.com/t/86agvmdgg) Display advertising on road maps
- [LV-86agvnxph](https://app.clickup.com/t/86agvnxph) Account verification route redirection is not correct
- [LV-86agvnxzk](https://app.clickup.com/t/86agvnxzk) Improve opportunities (UI/UX)
- [LV-86agvnyb3](https://app.clickup.com/t/86agvnyb3) Hide the "Apply" buttons (they are not being used correctly)
- [LV-86agvpjhk](https://app.clickup.com/t/86agvpjhk) Improve onboarding steps (UI/UX)

# v1.2.10 - 2026-04-10

## Fixes

- [LV-86agtfxnn](https://app.clickup.com/t/86agtfxnn) Fixed the bug where the analysis included unvalidated sections when creating or uploading CVs
- [LV-86agtgrck](https://app.clickup.com/t/86agtgrck) Improved prompt for not contain MD, and added REGEX validation before rendering

# v1.2.8 and v1.2.9 - 2026-04-09

## Fixes

- [LV-86agtehq5](https://app.clickup.com/t/86agtehq5) No procesa, evalua y obtiene oportunidades luego de terminar de pagar y el onboarding
- [LV-86agtfvww](https://app.clickup.com/t/86agtfvww) Luego del proceso rapido de pago, subida, evaluacion y obtencion de oportunidades no se actualiza la ruta en la interfaz

# v1.2.7 - 2026-04-09

## Fixes

- [LV-86agpvy9d](https://app.clickup.com/t/86agpvy9d) Se tarda en cambiar estado de una tarea (parece lento para el usuario)
- [LV-86agp593z](https://app.clickup.com/t/86agp593z) Mejorar el diseño y contenido de los correos
- [LV-86agrxq5f](https://app.clickup.com/t/86agrxq5f) Ahora se renderizan Complementos e Intereses, además de poder modificar los ejemplos y tips desde admin
- [LV-86agrxq1b](https://app.clickup.com/t/86agrxq1b) Todos los CVs desde la vista admin, tienen las 10 secciones mapeadas

# v1.2.6 - 2026-04-08

## Fixes

- [JB-86agrt0tb](https://app.clickup.com/t/86agrt0tb) Despues de hacer analisis de un cv no se muestra el detalle

# v1.2.3, v1.2.4 and v1.2.5 - 2026-04-08

## Features

- [JB-86agq5b8r](https://app.clickup.com/t/86agq5b8r) New letter page

## Fixes

- [LV-86agpvx6g](https://app.clickup.com/t/86agpvx6g) Added price in USD
- [LV-86agpvy8f](https://app.clickup.com/t/86agpvy8f) Hidden the section Career Accelerator
- [LV-86agpvydd](https://app.clickup.com/t/86agpvydd) Hidden the “Upload” and “Create Resume” buttons on the page listing all resumes
- [LV-86agpvy83](https://app.clickup.com/t/86agpvy83) Fixed Cookie redirection
- [LV-86agpvw8n](https://app.clickup.com/t/86agpvw8n) Fixed and added a reference to the creation of roadmaps, and improved the style.
- [LV-86agpvwah](https://app.clickup.com/t/86agpvwah) Fixed the order in which sections are displayed when creating a resume, and we've also updated the styles for the mobile version.
- [JB-86agpvwu1](https://app.clickup.com/t/86agpvwu1) Al terminar todos los pasos, solo aparece que el final estuviera terminado
- [JB-86agpvx2y](https://app.clickup.com/t/86agpvx2y) El nombre de producto dice jobby, pero deberia decir Levely
- [JB-86agpvx9d](https://app.clickup.com/t/86agpvx9d) El monto esta mal (deberia aparecer 49.90 y no 19.90)
- [JB-86agpvyar](https://app.clickup.com/t/86agpvyar) Mensaje de WhatsApp al completar una ruta
- [JB-86agpvy0g](https://app.clickup.com/t/86agpvy0g) Mejorar los prompts de insight y area y el modal de planes no tiene scroll
- [JB-86agrp9nr](https://app.clickup.com/t/86agrp9nr) Change route of new letter page and include it in navbar
- [JB-86agrqhb1](https://app.clickup.com/t/86agrqhb1) Mejorar news letter y mensaje para el usuario que va pagar
- [JB-86agrq9dq](https://app.clickup.com/t/86agrq9dq) Aún se puede acceder a career accelerator desde este card

# v1.2.2 - 2026-04-06

## Features

- Admin dashboard to monitor new CVs, evaluations, opportunities, roadmaps and complaints.

## Fixes

- Onboarding is only used once; there is no longer a risk of having infinite credits.

# v1.2.1 - 2026-04-06

## Fixes

- Fixed the problem where the summary content was not being saved.
- New way for hot selling (cv-pay and cv-builder)

## Technical

- New function to migrate from temporal tables to real tables for CVs, evaluations and
  opportunities.

## Features

- Added english recommendations (only examples).

# v1.2.0 - 2026-03-30

## Fixes

- Fix generate roadmap
- Fix phone number for 1:1 meeting

# v1.1.31 - 2026-03-29

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
- Select sections to store the information of the CV in the database (it's missing in the preview
  and edit cv).
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
- Get current plans for opportunities page and delete tags of required or optional for tags of
  opportunities
- Mis pasos screen is considering the tasks for roadmap
- Validation in opportunities page for avoid issues in the guide step

## Features

- Rich text added for opportunities description in the admin panel and updated the display in the
  opportunity detail page for end users.
- Popover to accept the cookies added

# v1.1.29 - 2026-03-23

## Features

- Updated `/credits` offers to read limits from plan-linked credit packages (no hardcoded credit
  amounts in cards).
- Fixed admin plan list preview price format to show PEN/USD correctly from cents.
- Product prices in Paddle have been modified so that they can be edited from within the app.

## Fixes

- The discrepancy in the Mercado Pago amount has been corrected: `priceCentsPEN` is now converted to
  soles (`/100`) before `unit_price` is sent in both payment flows.
- Synced plan creation/editing with credits model: admin now manages `MANAGE_CVS`, `AI_ACTIONS`,
  `SEARCH_OPPORTUNITIES` and keeps linked `CreditPackage` records updated.
- Added essential validation for plan card items (line-based features): trims empty lines, enforces
  allowed characters, and caps item length/count to avoid broken forms/cards.
- Plan-based access to opportunities (FREE/STARTER: first only, PRO: all) with simplified blur + CTA
  lock.
- Improved roadmap generation UX with fullscreen loading and fixed `IN_PROGRESS` status issue after
  completion.
- Include templateId when we upload a CV
- Refactor in the creating and uploading cv
- Fix issue for improved text in the language of the CV
- Hidde opp type EMPLOYMENT AND INTERNSHIP for the moment
- Title of section to show preview and edit CV
  - Update prompt to generate roadmap

---

# v1.1.28 - 2026-03-12

## Features

- **AI Roadmap**: Generate a personalized, step-by-step roadmap for any opportunity using AI (CV
  context + opportunity requirements).
- **Roadmap generation via Inngest**: New `generate-roadmap` background function with QueueJob
  tracking, credit consumption, and route status advancement.
- **Career Accelerator gating**: Only the first roadmap step is visible for free users; STARTER/PRO
  plan holders see all steps.
- **Roadmap UI**: Vertical stepper component with timeline, action items, estimated duration,
  resources, and blur overlay for locked steps with upgrade CTA.
- **Roadmap on opportunity detail**: "Generar Roadmap con IA" button on every opportunity detail
  page with polling for generation status.
- **Route stepper step 4**: Dashboard stepper now includes a 4th "Roadmap personalizado" step after
  opportunities.

## Enhancements

- **KISS score card**: Removed redundant big number + circle combo and modal. Score now shows
  compact ring + inline category breakdown bars.
- **KISS improvements section**: Cards expanded by default (no accordions), "Apply All" button,
  simpler before→after layout, removed framer-motion dependency.
- **KISS recommendations section**: Unified card container with dividers, compact header.
- **KISS analysis header**: Left-aligned compact layout instead of centered full-width block.
- **KISS analysis page layout**: Flattened `max-w-3xl` layout, removed `ScoreBreakdownModal`
  dependency.

## Schema Changes

- Added `Roadmap` model (`roadmap` table) with unique constraint on `[opportunityId, cvId, userId]`.
- Added `RoadmapStep` model (`roadmap_step` table) with `order`, `title`, `description`,
  `actionItems` (JSON), `estimatedDays`, `resources` (JSON), `isFree`.
- Extended `RouteStatus` enum with `ROADMAP_PENDING` and `ROADMAP_DONE`.
- Added `roadmaps` relation on `User` and `Opportunity` models.
- Migration: `20260312063620_add_roadmap_models`.

## API

- New `POST /api/roadmap/generate` endpoint to trigger AI roadmap generation.

---

# v1.1.27 - 2026-03-12

## Features

- **Route model**: New `route` table to guide users through a step-by-step journey (CV → Analysis →
  Opportunities).
- **Route-based sidebar**: Sidebar reorganized with route selector, "Ruta Activa" nav group, and "Mi
  Cuenta" section.
- **Dashboard stepper**: Dashboard now shows a 3-step progress flow for the active route instead of
  generic stats.
- **First-time route creation**: Users with no routes are redirected to `/routes/new` to create
  their first route.
- **Auto-filtering by route**: CV, Evaluations, and Opportunities pages automatically filter by the
  active route's CV.
- **Auto-advance route status**: Route status advances automatically when CV is created/uploaded,
  evaluation completes, or opportunities are found.
- **Zustand route store**: Global client state for active route via `use-route-store.ts` and
  `RouteProvider`.
- **Route-scoped pages**: New `/my-cvs`, `/my-evaluations`, `/my-opportunities` pages that always
  filter by the active route's CV. Sidebar updated to use these new paths.
- **Analysis & Correction**: Enhanced AI evaluation prompt now generates improved text suggestions
  per section and suggested content additions, tailored to CV type and target opportunity.
- **Improvements section**: New `ImprovementsSection` component on the evaluation detail page
  showing current vs. improved text with one-click "Accept & Apply" to update the CV directly.
- **Suggested additions**: AI recommends missing sections/content to add, with impact level (
  HIGH/MEDIUM/LOW).

## Schema Changes

- Added `Route` model with `RouteStatus` enum (`CV_PENDING`, `CV_CREATED`, `ANALYSIS_PENDING`,
  `ANALYSIS_DONE`, `OPPORTUNITIES_PENDING`, `OPPORTUNITIES_DONE`).
- Added `routes` relation on `User` model.
- Added optional `route` back-relation on `Cv` model (1:1 via unique `cvId`).
- Added `improvementsJson` field on `CvEvaluation` to store AI-generated improved texts and
  suggested additions.
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

- use inngest functions in all the processes that we want to do in background, like sending emails,
  generating CVs, etc.

---

# v1.1.24 - 2026-03-07

## Features

- Paddle payment flow on `/cv-pay`: authenticated users see an account-choice dialog (use current or
  create new), new users go through email capture → payment method selection; after payment, the
  session is closed if it belonged to a different account and the customer email is pre-filled in
  the Paddle checkout for correct receipt delivery.
- Improved session detection: replaced client-side `authClient.getSession()` with the `getSession`
  server action called at page level and passed as prop, adding explicit return types to eliminate
  `unknown` inferences.

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

- **Settings & preferences**: Users can now update their username, change their password (for
  email/password accounts), and have their dark/light theme preference saved per user in the
  database.
- **Registration & onboarding improvements**: Added a confirm password field to registration flows
  and implemented a terms acceptance gate before continuing or signing up with Google.

## Technical

- New server actions: `updateUsernameAction`, `changePasswordAction`, `updateThemeAction`.
- New `ThemeSync` client component that fetches user theme preference on mount and applies it via
  `next-themes`.
- New `GET /api/theme` route handler to read theme from DB and set cookie (allowed in Route
  Handlers).
- New migration: `add_theme_to_user_preference` — adds `theme TEXT NOT NULL DEFAULT 'light'` to
  `user_preference` table.
- `GoogleOAuthButton` now accepts an external `disabled` prop.
- Navbar uses SWR (`useSWR("session")`) to reactively update the username without F5.

## Fixes

- **Bug fixes (theme & onboarding)**: Fixed theme flash for unauthenticated users by always writing
  the `theme` cookie, corrected onboarding step 10 validation to include `confirmPassword`, and
  added the opportunity type field in onboarding.
- **UX & visibility fixes**: Restored visibility of current resources for users, fixed styling
  issues in the progress analysis view, mapped recommendation titles in the analysis summary, and
  improved performance and text on the public CV builder page.

# v1.1.18 - 2026-02-24

## Enhancements

- Improve styles and colors for dark and light mode.
- The roles are commented in the code for the moment.

## Technical

- New types of opportunities added

# v1.1.17 - 2026-02-17

## Features

- Filter opportunities by CV: Added a new filter in the Opportunities section that allows users to
  select a specific CV and see only the opportunities that match that profile. This helps users find
  relevant job openings more efficiently.
- Search bar with debounce: Implemented a search bar in the Opportunities section that allows users to search and filter opportunities by keyword in real time.

## Fixes

- Fix colors for dark and light mode
- Fixed a bug where multiple CVs with the same name would all be highlighted simultaneously in the
  selection menus by integrating unique IDs into the selection logic.

# v1.1.16 - 2026-02-20

## Features

- **Advanced Opportunity Filtering**: Added a CV-specific filter in the Opportunities section to
  match profiles more accurately.
- **Search Functionality**: Implemented a search bar with debounce (500ms) to filter opportunities
  by job title or company name.
- **Improved IA Matching UX**: Created a new `QuickMatchLoadingModal` with a guaranteed 10-second
  simulation that shows realistic progress steps ("Analyzing profile", "Searching vacancies", etc.)
  for a more professional feel.

## Enhancements

- **UI Consistency**: Standardized the size and style of all action buttons in the CV Preview
  sidebar (Download, Analyze, Match).
- **Responsive Filters**: Improved the layout of the filter bar in the Opportunities and Evaluations
  screens.
- **Smarter Placeholders**: Updated empty states to provide relevant feedback when filters or search
  queries yield no results.

## Fixes

- **Duplicate Name Conflict**: Fixed a bug where multiple CVs with the same name would all be
  highlighted simultaneously in the selection menus by integrating unique IDs into the selection
  logic.

# v1.1.15 - 2026-02-16

## Features

- New "Quick Match" functionality in sidebar for fast opportunity search without full analysis
- Intelligent credit consumption logic for opportunity matching:
  - Charges 1 `SEARCH_OPPORTUNITIES` credit only when matches are found or for refreshing existing
    CV opportunities
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
- Fully redesigned the main page and dashboard with a more modern, attractive interface aligned with
  Levely's identity.
- All progress bars and visual elements now use gradients and official brand colors.
- Improved responsiveness across all components and views, optimizing the experience for both mobile
  and desktop devices.
- Updated global styles and CSS utilities to reflect the new visual identity.
- Enhanced accessibility and contrast for key elements.
- The dashboard now features a clearer structure, improved navigation, and refreshed visual
  components.
- Removed generic colors and styles, centralizing visual management with the new color tokens.
- Changed the browser window .ico to a more rounded version.
- Some components may still need updating; please use the new color palette for any further changes.

# 1.1.1 - 2025-01-22

## Hotfix

- Fixed build process error related to schema modifications

# 1.1.0 - 2025-01-22

## Fixes

- [JB-86adpv36f](https://app.clickup.com/t/86adpv36f) Fixed upload CV count issue
- [JB-86adpv28j](https://app.clickup.com/t/86adpv28j) Fixed issue where changing the title was
  impossible
- [JB-tmp](https://app.clickup.com/t/tmp) Various bug fixes

## Technical

- [JB-86acgydd9](https://app.clickup.com/t/86acgydd9) Integrated Inngest for background processing
- [JB-86acfgked](https://app.clickup.com/t/86acfgked) Integrated Mercado Pago
- [JB-86acrwkdh](https://app.clickup.com/t/86acrwkdh) Integrated new landing page with feedback;
  login and register dropdown menus temporarily hidden; added /pro path with application info,
  plans, and demo
- Refactored the database schema for improved performance and scalability
- [JB-86acz99x8](https://app.clickup.com/t/86acz99x8) Integrated new modular structure for CV
  creation, dynamic form, and dynamic preview, rendering sections in order
- Modified schema: added VOLUNTEERING to CvSectionType, and renamed all CvType names for clarity
- Talent onboarding
- Email service integration
