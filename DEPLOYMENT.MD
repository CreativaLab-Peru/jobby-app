# WIP

## Enhancements

- Añadida la tabla de configuraciones para poder gestionar las configuraciones del sistema desde el panel de administracion

# v1.2.15 - 2026-04-23

## Enhancements

- Es necesario correr el seed `publicity-suggestion.ts` para las recomendacion de las rutas al momento de crear roadmaps

# v1.2.7 - 2026-04-09

## Enhancements

- Es necesario volver a correr `conf_cv_sections.ts` de nuevo para actualizar las secciones de los CVs, asi como complementos e intereses

# v1.2.1 - 2026-04-06

## Enhancements

- It's necessary to run again prisma/seed/conf_cv_sections.ts.
- `requiredRequirements, optionalRequirements, companyLogoUrl, minSalary and maxSalary` added in opportunities table
- New CvSectionConfiguration and TempCvWithEvaluation added to support new CV template and evaluation flow

# v1.1.29 - 2026-03-23

### CURRENT DEPLOYMENT NOTES (Billing + Credits)

#### Scope of this release

- Mercado Pago payment fix: amount is sent in soles (`priceCentsPEN / 100`) in both flows (authenticated user and new user).
- `/credits` now displays credits per plan using `credit_package` linked to the plan (by type).
- Admin plans: synchronized editing/preview with prices in cents and credits by type.

#### Database migrations (must exist in production)

- `20260310040541_credit_package_plan_relation`
- `20260316000000_add_paddle_fields_and_dual_pricing`
- `20260316010000_backfill_dual_pricing_non_null`

#### Paddle / Payments configuration

- Required env vars:
  - `MP_ACCESS_TOKEN`
  - `PADDLE_API_KEY`
  - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
  - `PADDLE_WEBHOOK_SECRET`
- Not required anymore:
  - `PADDLE_PRICE_ID_STARTER`
  - `PADDLE_PRICE_ID_PRO`

### IMPORTANT

#### Deployment steps (only critical)

1. `bun run build`
2. `bunx prisma migrate status` (confirm no pending/failed migrations)
3. `bunx prisma migrate deploy`
4. Quick smoke test:

- `/admin/plans`: create/edit plan and validate PEN/USD price in preview.
- `/admin/plans`: validate Paddle sync IDs (`paddleProductId`, `paddlePriceIdUSD`) are persisted after create/update.
- `/credits`: validate that limits match credits configured in the plan.
- Mercado Pago checkout: confirm it charges exactly the configured soles value.
- Paddle checkout: confirm checkout opens and uses current plan price.

#### Data integrity check (recommended)

```sql
SELECT slug, name, "priceCentsPEN", "priceCentsUSD", "paddlePriceIdUSD"
FROM subscription_plan
ORDER BY slug;
```

# NEED UPDATE WITH DATE OF MERGE

### CURRENT DEPLOYMENT NOTES (Dual-Pricing & Admin System)

#### Database Migrations Included

- `20260316000000_add_paddle_fields_and_dual_pricing` — Adds dual pricing support:
  - Adds `priceCentsPEN` (for Mercado Pago in PEN)
  - Adds `priceCentsUSD` (for Paddle in USD)
  - Adds `paddleProductId` and `paddlePriceIdUSD` for Paddle integration

#### Pre-Deployment Checklist

✅ All migrations are backwards-compatible and idempotent
✅ Database backup verified before deployment
✅ Staging environment tested with production-like data

#### Build & Deployment

```bash
bun run build
```

#### Environment Variables Required (Paddle)

- `PADDLE_API_KEY` — Paddle server API key
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` — Paddle client token
- `PADDLE_WEBHOOK_SECRET` — Paddle webhook signing secret

#### Post-Deployment

1. Verify payment plans created: `psql -d <db> -c "SELECT slug, name, priceCentsPEN, priceCentsUSD FROM subscription_plan;"`
2. Verify Paddle price IDs configured in admin panel `/admin/plans`

---

### BEFORE DEPLOYMENT

- Migrations included in this release:
  - `20260312045719_add_route_model`
  - `20260312054210_add_improvements_json_to_evaluation`
  - `20260312063620_add_roadmap_models`
- These migrations are additive and idempotent (`IF NOT EXISTS` / `ADD VALUE IF NOT EXISTS`), designed to avoid failures when objects already exist.
- Pre-deploy checks:
  - Verify a recent DB backup/snapshot exists.
  - Run migrations first in staging with production-like data.
  - Validate `bunx prisma migrate status` returns no pending/failed migrations.
- Post-deploy smoke checks:
  - Verify opportunities match flow creates and lists records.
  - Verify roadmap generation transitions to `SUCCEEDED` and persists steps.
  - Verify route statuses advance to `OPPORTUNITIES_DONE` / `ROADMAP_DONE` where applicable.

### BEFORE DEPLOYMENT

- Run migration `20260311002011_add_template_id_to_cv` — adds `templateId TEXT NOT NULL DEFAULT 'harvard'` to `cv` table.
- Run migration `20260312000454_add_cv_template_model` — creates `cv_template` table and seeds the 4 initial templates (`harvard`, `europass`, `stem`, `fullbright`). Adds FK from `cv.templateId`.
- Run migration `20260312010952_add_cv_photo` — creates `cv_photo` table linked to `user`.
- No new environment variables required.

---

### BEFORE DEPLOYMENT

- Run migration `20260310040541_credit_package_plan_relation` — adds `planId` column and relation to `credit_package` table, linking each package to a `PaymentPlan` (`migrate deploy` handles this automatically in the build script).
- No new environment variables required.
- Existing credit packages without a plan assigned will have `planId = null`; assign them from the admin panel at `/admin/credit-packages`.

---

# v1.1.25 - 2026-03-07

### BEFORE DEPLOYMENT

- New migration for interview table
- New migration with admin role for User table
- New variable `NEXT_PUBLIC_VAPI_WEB_TOKEN` for VAPI integration

---

# v1.1.24 - 2026-03-07

### BEFORE DEPLOYMENT

- Add new environment variables (Paddle integration):
  - `PADDLE_API_KEY` — server-side Paddle API key (sandbox: `test_...`, production: `live_...`)
  - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` — client-side Paddle token for the JS overlay (sandbox: `test_...`, production: `live_...`)
  - `PADDLE_WEBHOOK_SECRET` — secret to validate incoming Paddle webhook signatures (from Paddle Dashboard → Notifications)
  - `PADDLE_PRICE_ID_STARTER` — Paddle price ID for the Starter plan (from Paddle Dashboard → Catalog → Prices)
- Run seed `prisma/seed/credit_package.js` to populate the `credit_package` table if not already done.
- Register the webhook endpoint `https://<domain>/api/payments/paddle/confirm` in Paddle Dashboard → Notifications, with event `transaction.completed`.

---

# v1.1.21 - 2026-03-04

### BEFORE DEPLOYMENT

- Run migration `20260303030454_add_complaint_table` — creates the `complaint` table (`migrate deploy` handles this automatically in the build script).
- No new environment variables required.
- Existing users are not affected; the table starts empty.

---

# v1.1.19 and v1.1.20 - 2026-02-28

### BEFORE DEPLOYMENT

- Run migration `add_theme_to_user_preference` — adds `theme` column to `user_preference` table (`migrate deploy` handles this automatically in the build script).
- No new environment variables required.
- Verify that existing users with a `UserPreference` record get `theme = 'light'` by default (handled by the migration default value).
- Opportunity type added on preference user
- Cv type on cv table is optional
- Delete some types of opportunities types on CV table

# 1.1.2 - 2025-01-30

# BEFORE DEPLOYMENT

- Add credits package (script)
- Add and edit subscription plans (script)

# 1.1.2

### BEFORE DEPLOYMENT

- Ensure that the new color tokens are correctly defined in `globals.css` and that there are no references to old or generic colors in the components.
- Review all visual components (progress bars, badges, cards, dashboard, sidebar, etc.) to confirm they use the new Levely colors and gradients.
- Test responsiveness and appearance on both mobile and desktop devices, making sure the new design adapts properly.
- Validate that the dashboard and main page reflect the new design and visual structure.
- Clear style and asset caches in the production environment to avoid visual conflicts.
- If there are any environment variables related to branding or visuals, make sure they are updated.

# 1.0.2

### BEFORE DEPLOYMENT

- Add new environment variable
  - RESEND_API_KEY
- Remove old environment variable
  - MAILERLITE_API_KEY
  - MAILERLITE_WELCOME_GROUP_ID
  - MAILERLITE_VERIFY_GROUP_ID
  - MAILERLITE_MAGIC_LINK_GROUP_ID

# 1.0.0

### BEFORE DEPLOYMENT

- Add variables for new flow
  - MAILERLITE_MAGIC_LINK_GROUP_ID for mailerlite
  - FIRST_PASSWORD for default password when user register with magic link

- Add new environment variables for Levely App
  - INNGEST_API_KEY for inngest service
  - MP_ACCESS_TOKEN token of mercado pago
