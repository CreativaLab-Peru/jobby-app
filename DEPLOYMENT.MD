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
