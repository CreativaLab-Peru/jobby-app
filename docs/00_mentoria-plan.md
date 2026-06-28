# Plan: Mentoría 1:1 — Landing Page & Request Flow

## Overview

This document covers the implementation plan for the **Mentoría 1:1** product (S/ 250 / session). The architecture mirrors the existing `diagnostico-cv` feature: a stateful flow component switches between screens, with a landing page, a contact request form, and optionally a confirmation state.

---

## 1. Feature Structure

```
src/features/mentoria/
├── screens/
│   └── mentoria-flow.tsx          # Stateful orchestrator (mirrors diagnosis-flow.tsx)
├── components/
│   ├── mentoria-landing-screen.tsx  # Full landing page (images 1–6)
│   └── mentoria-request-form.tsx    # Contact/request form (image 7)
├── hooks/
│   └── use-mentoria-flow.ts         # Step state + user info (mirrors use-diagnostico-flow)
├── actions/
│   └── submit-mentoria-request.ts   # Server action: saves lead, sends email/WhatsApp
└── types/
    └── mentoria.ts                  # Price constant, types, Chevening options
```

### Page entry point

```
src/app/(public)/mentoria/page.tsx
```

```tsx
// page.tsx
import { Metadata } from "next";
import { MentoriaFlow } from "@/features/mentoria/screens/mentoria-flow";

export const metadata: Metadata = {
  title: "Mentoría 1:1 de Beca | Levely",
  description:
    "En 60 minutos construimos la ruta exacta a tu beca. Sesión personalizada con Dara Mariluz, fundadora de Levely.",
};

interface MentoriaPageProps {
  searchParams: Promise<{ status?: "sent" | "error" }>;
}

export default async function MentoriaPage({ searchParams }: MentoriaPageProps) {
  const { status } = await searchParams;
  return <MentoriaFlow requestStatus={status} />;
}
```

---

## 2. Types & Constants

```
src/features/mentoria/types/mentoria.ts
```

```ts
export const MENTORIA_PRICE = 250;

export const CHEVENING_OPTIONS = [
  "Sí, en la convocatoria de este año (ago–nov 2026)",
  "Sí, el próximo año",
  "Estoy evaluando otras becas (Fulbright, DAAD, Erasmus)",
  "Aún no lo tengo claro",
] as const;

export type CheveningOption = (typeof CHEVENING_OPTIONS)[number];

export interface MentoriaRequestData {
  name: string;
  email: string;
  whatsapp: string;
  cheveningPlan: CheveningOption | string;
}

export type MentoriaStep = "landing" | "form" | "sent";
```

---

## 3. Hook

```
src/features/mentoria/hooks/use-mentoria-flow.ts
```

```ts
import { useState } from "react";
import { MentoriaStep, MentoriaRequestData } from "../types/mentoria";

export function useMentoriaFlow() {
  const [step, setStep] = useState<MentoriaStep>("landing");
  const [userData, setUserData] = useState<Partial<MentoriaRequestData>>({});

  const setUserInfo = (data: MentoriaRequestData) => setUserData(data);

  return { step, setStep, userData, setUserInfo };
}
```

---

## 4. Server Action

```
src/features/mentoria/actions/submit-mentoria-request.ts
```

```ts
"use server";

import { MentoriaRequestData } from "../types/mentoria";

export async function submitMentoriaRequest(
  data: MentoriaRequestData
): Promise<{ success: boolean; error?: string }> {
  // 1. Save lead to DB (e.g. insert into mentoria_leads table)
  // 2. Send internal notification (email or WhatsApp via Twilio/Meta API)
  // 3. Send confirmation email to the user (via Resend)
  return { success: true };
}
```

---

## 5. Flow Orchestrator

```
src/features/mentoria/screens/mentoria-flow.tsx
```

```tsx
"use client";

import { useMentoriaFlow } from "../hooks/use-mentoria-flow";
import { MentoriaLandingScreen } from "../components/mentoria-landing-screen";
import { MentoriaRequestForm } from "../components/mentoria-request-form";
import { submitMentoriaRequest } from "../actions/submit-mentoria-request";
import { MentoriaRequestData } from "../types/mentoria";

interface MentoriaFlowProps {
  requestStatus?: "sent" | "error";
}

export function MentoriaFlow({ requestStatus }: MentoriaFlowProps) {
  const { step, setStep, setUserInfo } = useMentoriaFlow();

  const handleStart = () => setStep("form");

  const handleFormSubmit = async (data: MentoriaRequestData) => {
    setUserInfo(data);
    const result = await submitMentoriaRequest(data);
    if (result.success) {
      setStep("sent");
    }
    // on error: stay on form, surface error via isError state (passed as prop)
  };

  switch (step) {
    case "landing":
      return (
        <MentoriaLandingScreen
          onStart={handleStart}
          requestStatus={requestStatus}
        />
      );
    case "form":
      return (
        <MentoriaRequestForm
          onBack={() => setStep("landing")}
          onSubmit={handleFormSubmit}
          isLoading={false}
        />
      );
    case "sent":
      return (
        <MentoriaLandingScreen
          onStart={handleStart}
          requestStatus="sent"
        />
      );
    default:
      return <MentoriaLandingScreen onStart={handleStart} />;
  }
}
```

---

## 6. Landing Screen — `mentoria-landing-screen.tsx`

### Sections (in order, from screenshots)

| # | Section | Screenshot |
|---|---------|------------|
| 1 | **Nav** — logo left, "Solicitar sesión" pill CTA right | Image 1 |
| 2 | **Hero** — eyebrow label, big headline, subtitle, badge pills, CTA button + stat cards grid (60 / 10 / $80k / 1:1) | Image 1 |
| 3 | **"Para quién es esto"** — cream bg, headline, 2×2 bullet grid, minimum-requirement callout box | Image 2 |
| 4 | **"Lo que pasa en los 60 minutos"** — cream bg, headline + subtitle, 2×3 feature card grid | Image 3 |
| 5 | **"Tu mentora"** — dark bg, avatar + name/title/LinkedIn, long bio, credential bullet list | Image 4 |
| 6 | **Testimonials** — cream bg, carousel / 2-col cards with quotes + attribution + beca badge | Image 5 |
| 7 | **Price / Inversión** — white bg, centered S/250 display, comparison text, ROI copy | Image 6 |
| 8 | **Request form** — embedded at bottom of landing OR as separate screen (see §7) | Image 7 |
| 9 | **Footer** — privacy policy, "Levely emite boleta de pago · Empresa registrada en Perú" | Image 7 |

### Key data constants to extract into `mentoria.ts` or a `const.ts`

```ts
// These currently live inline in the screenshots — extract to constants:
export const MENTORIA_STATS = [
  { value: "60", label: "minutos de sesión personalizada" },
  { value: "10", label: "universidades y programas para tu perfil" },
  { value: "$80k", label: "cubre Chevening en matrícula, vuelo y más" },
  { value: "1:1", label: "con quien ya pasó por el proceso" },
];

export const MENTORIA_FEATURES = [
  { emoji: "🔍", title: "Revisión humana de tu perfil", body: "Analizamos tu experiencia, formación y metas..." },
  { emoji: "🎓", title: "Las becas reales que existen para vos", body: "Identificamos cuáles aplican a tu caso..." },
  { emoji: "🗺️", title: "Tus 10 mejores universidades UK", body: "Seleccionadas en sesión según tu área y perfil..." },
  { emoji: "⚙️", title: "Cómo funciona el proceso — de verdad", body: "Qué documentos piden, en qué orden..." },
  { emoji: "✉️", title: "Cartas y ensayos: qué piden y cómo enfocarlos", body: "Revisamos cuáles documentos necesitás..." },
  { emoji: "💬", title: "Grupo privado de WhatsApp", body: "Acceso exclusivo al grupo de asesorados Levely..." },
];

export const MENTORIA_TESTIMONIALS = [
  {
    quote: "No sabía cómo conectar mi experiencia con lo que pedía el programa...",
    name: "Mónica Díaz",
    location: "Lima, Perú",
    badge: "Próximamente con Erasmus Mundus",
  },
  {
    quote: "Siempre pensé que mi perfil técnico no encajaba con lo que buscan estas becas...",
    name: "Andy Marcelo",
    location: "Cusco, Perú",
    badge: "Próximamente con Erasmus Mundus",
  },
];

export const PARA_QUIEN_BULLETS = [
  "Quieres estudiar una maestría fuera con una beca que cubra todo...",
  "Escuchaste hablar de Chevening, Fulbright o DAAD pero nunca tuviste a alguien que te explicara...",
  "No sabes si tu perfil alcanza, qué becas existen para alguien como tú...",
  "Tienes experiencia real — trabajo, voluntariado, proyectos. Solo necesitas que alguien te ayude a leerla...",
];
```

### Color & typography — consistent with existing system

The landing uses two backgrounds that alternate:
- **Dark** (`#0a0f0c`) — Nav, Hero, "Tu mentora" section
- **Cream/light** (`#f5f2eb` approx.) — "Para quién", "Lo que pasa", Testimonials, Price

Accent: `#c9f563` (lime green) for logo, CTA buttons, links  
Body font: Inter  
Display font: Fraunces (serif, bold/black italic for headlines)

This is already established in the existing components — keep it identical.

---

## 7. Request Form — `mentoria-request-form.tsx`

Mirrors `DiagnosticoPaymentForm` in structure. Fields:

| Field | Type | Validation |
|-------|------|------------|
| Nombre completo | text | required |
| Correo electrónico | email | required, valid format |
| WhatsApp | tel | required, numeric, country prefix selector (+51 default) |
| ¿Planeas postular a Chevening? | select (4 options) | required |

### Props

```tsx
interface MentoriaRequestFormProps {
  onBack?: () => void;
  onSubmit: (data: MentoriaRequestData) => Promise<void>;
  isLoading: boolean;
}
```

### Layout

Same split layout as `DiagnosticoPaymentForm`:
- **Left card** — dark-bg price card showing S/ 250, what's included (session features), security note
- **Vertical divider** — desktop only
- **Right** — form fields + submit button + disclaimer footer

---

## 8. Implementation Order

1. `types/mentoria.ts` — constants, types, options
2. `hooks/use-mentoria-flow.ts` — step machine
3. `actions/submit-mentoria-request.ts` — stub server action (fill in real logic after)
4. `components/mentoria-landing-screen.tsx` — section by section, top to bottom
5. `components/mentoria-request-form.tsx` — form with validation
6. `screens/mentoria-flow.tsx` — wire everything together
7. `app/(public)/mentoria/page.tsx` — page entry + metadata

---

## 9. DB Consideration (optional, for later)

If you want to persist leads before confirming by WhatsApp:

```sql
CREATE TABLE mentoria_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  chevening   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  contacted   BOOLEAN DEFAULT FALSE
);
```

---

## 10. Notes & Decisions

- **No payment redirect** — unlike the diagnóstico flow, mentoría is a manual confirmation model (Dara contacts within 24h, then sends payment link). The form submit just saves the lead and sends a notification.
- **"sent" state** — show a success banner on the landing page (same pattern as `paymentStatus` banner in `DiagnosticoLandingScreen`), not a separate full-page confirmation.
- **Testimonial carousel** — two cards visible on desktop; dots navigation; mobile shows one card at a time. Can use simple CSS scroll-snap or a lightweight state-based approach (no external library needed).
- **WhatsApp field** — include a `+51` prefix display but accept the number separately; combine on submit.
- **`requestStatus` prop** — passed from `searchParams` in `page.tsx` to allow deep-link to success state (e.g. after redirect back from an external flow, if ever added).
