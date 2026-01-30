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
