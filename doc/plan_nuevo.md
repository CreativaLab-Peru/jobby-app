# Plan: Diagnostico-CV Feature

## Context

Create a new paid diagnostic feature for CV scholarship analysis. Users pay S/19.90 via MercadoPago, upload their CV, select target countries/scholarship types/areas, and receive an AI evaluation with matched scholarship opportunities via email.

**Flow:** Landing → Payment (name/email + MercadoPago) → Confirmation webhook → Email with unique link → CV Upload → Onboarding (countries, scholarship type, area) → AI Loading → Results + Email

---

## 1. Database Schema (Prisma)

**File:** `prisma/schema.prisma`

Added models:
- `Country` - Countries for scholarships (UK, US, DE, EU, JP)
- `ScholarshipOpportunity` - Scholarship opportunities catalog
- `DiagnosticSession` - Session for tracking unique link after payment
- `DiagnosticResult` - Result after AI evaluation
- `ScholarshipType` enum (MASTER, PHD, FELLOWSHIP)
- `DiagnosticStatus` enum (PENDING, CV_UPLOADED, PROCESSING, COMPLETED)

---

## 2. Feature Structure

```
features/diagnostico-cv/
├── actions/
│   ├── create-diagnostico-preference.ts    # MercadoPago preference
│   ├── create-diagnostic-session.ts       # Create session after payment
│   ├── get-diagnostic-session.ts # Get session by token
│   ├── update-diagnostic-session.ts       # Update session (CV, onboarding)
│   ├── save-diagnostic-result.ts         # Save AI evaluation result
│   └── admin/
│       ├── create-country.ts
│       ├── update-country.ts
│       ├── delete-country.ts
│       ├── create-opportunity.ts
│       ├── update-opportunity.ts
│       ├── delete-opportunity.ts
│       └── list-opportunities.ts
├── components/
│   ├── diagnostico-landing-screen.tsx
│   ├── diagnostico-payment-form.tsx
│   ├── diagnostico-cv-upload.tsx
│   ├── diagnostico-onboarding.tsx
│   ├── diagnostico-loading.tsx
│   └── diagnostico-results.tsx
├── hooks/
│   └── use-diagnostico-flow.ts             # Zustand store
├── screens/
│   ├── diagnostico-flow.tsx               # Main orchestrator
│   └── diagnostico-session-flow.tsx       # Session-based flow
├── templates/
│   ├── diagnostic-access-email.tsx        # Email with magic link
│   └── diagnostic-results-email.tsx        # Email with results
└── types/
    └── diagnostico.ts

app/(selling)/diagnostico-cv/
├── page.tsx                               # Landing page
└── [sessionToken]/
    └── page.tsx                           # Session-based flow

app/api/payments/mercadopago/
└── diagnostico-confirm/route.ts           # Webhook handler
```

---

## 3. MercadoPago Integration

**Files:**
- `features/diagnostico-cv/actions/create-diagnostico-preference.ts`
- `app/api/payments/mercadopago/diagnostico-confirm/route.ts`

Flow:
1. User enters name/email on payment form
2. Creates MercadoPago preference with metadata `{ type: "DIAGNOSTICO", email, name }`
3. Redirects to MercadoPago checkout
4. Webhook receives payment confirmation
5. Creates `DiagnosticSession` with hashed magic link token
6. Sends Inngest event `diagnostico/access-email`

---

## 4. Inngest Functions

**Files:**
- `inngest/functions/send-diagnostic-access-email.ts`
- `inngest/functions/send-diagnostic-results-email.ts`
- `inngest/functions/evaluate-diagnostic-cv.ts`

Events:
- `diagnostico/access-email` - Sent after payment, sends magic link email
- `diagnostico/cv-ready` - Triggers CV evaluation
- `diagnostico/results-email` - Sent after evaluation completes

---

## 5. Seed Data

**File:** `prisma/seed/7-seed-countries-and-opportunities.ts`

Countries:
- 🇬🇧 Reino Unido (UK): Chevening, Commonwealth, British Council
- 🇺🇸 Estados Unidos (US): Fulbright, Hubert Humphrey
- 🇩🇪 Alemania (DE): DAAD, Heinrich Böll, Humboldt
- 🇫🇷 Francia/Europa (EU): Eiffel, Erasmus Mundus, Becas UE
- 🇯🇵 Japón (JP): MEXT, JICA, Monbukagakusho

---

## 6. UI Components

**Design System (from `doc/solo-html.html`):**
- Dark theme (#080f0d), Lime accent (#c8f562), Cream (#f4f0e6)
- Fonts: Fraunces (serif), DM Sans (body)

**Screens:**
1. **Landing**: Hero + price card (S/19.90) + CTA
2. **Payment Form**: Name/email inputs → MercadoPago redirect
3. **CV Upload**: Dropzone (PDF/DOC/DOCX, max 10MB), thin CV warning
4. **Onboarding**:
   - Q1: Countries (multi-select, max 2)
   - Q2: Scholarship type (single-select)
   - Q3: Area of expertise (single-select)
5. **Loading**: Animated orb + step indicators
6. **Results**: Score ring, profile type, recommendations, opportunities

---

## 7. Implementation Status

### Completed
- [x] Prisma models added
- [x] Seed file created
- [x] Feature actions created
- [x] MercadoPago webhook handler
- [x] Email templates
- [x] Inngest functions
- [x] UI components
- [x] Routes created
- [x] Admin CRUD actions

### Pending
- [ ] Run `prisma migrate dev` to create tables
- [ ] Run seed to populate data
- [ ] Test full flow
- [ ] Implement actual CV upload to Cloudinary
- [ ] Implement actual AI evaluation logic

---

## 8. Critical Files Modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added Country, ScholarshipOpportunity, DiagnosticSession, DiagnosticResult models |
| `prisma/seed.ts` | Added seed7 import |
| `app/api/inngest/route.ts` | Registered new Inngest functions |

---

## 9. Verification Steps

1. Run `prisma migrate dev` to create tables
2. Run `npm run db:seed` to populate countries/opportunities
3. Test flow: Landing → Payment → Webhook → Email → Upload → Onboarding → Results
4. Verify MercadoPago webhook receives payment notification
5. Verify email with magic link is sent
6. Verify Inngest function processes CV and sends results email
7. Test mobile responsiveness (720px breakpoint)
