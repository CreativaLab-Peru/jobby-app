# 📋 Plan Simplificado: 3 Templates Gratuitos para CV Académico

## 1️⃣ REQUIREMENT CLARIFICADO

### 1.1 Lo que se pide (SIMPLIFICADO)
- **3 Templates GRATUITOS únicamente:** Europass Modern, Líder Global (Fulbright), STEM Researcher
- **Disponible SOLO para:** Internship (Pasantía) y Scholarship (Beca)
- **Sin premium, sin créditos, sin validaciones:** Todo es gratis
- **Sin rollout gradual:** Deploy directo
- **Live preview:** Cambios en tiempo real sin recargar
- **Persistencia:** El template se guarda en BD (tabla `Cv.templateId`)

### 1.2 Los 3 Templates (GRATIS todos)

| Template | Propósito | Elemento Clave |
|----------|----------|---|
| **Europass Modern** | Intercambios en Europa (Erasmus+) | Sección de idiomas con Marco Común Europeo (A1-C1) |
| **Líder Global / Fulbright** | Becas de alto prestigio (Fulbright, Chevening, DAAD) | Resalta Voluntariado y Liderazgo |
| **Investigador / STEM** | Ingeniería, Ciencias, Pasantías investigación | Sección de Proyectos con formateo especial |

---

## 2️⃣ VISTA DE LA ARQUITECTURA ACTUAL

### Componentes existentes relacionados:

| Área | Archivo/Modelo | Status |
|------|---|---|
| **Schema** | `model Cv` | ✅ Existe, SIN campo `templateId` |
| **Builder UI** | `features/cv/components/cv-form.tsx` | ✅ Existe |
| **Preview** | `features/cv/components/cv-preview.tsx` | ✅ Existe (componente React) |
| **PDF Renderizado** | `components/pdf-preview/cv-document.tsx` | ✅ Existe (usa `@react-pdf/renderer`) |
| **HTML PDF Gen** | `utils/pdf-generator.ts` | ✅ Existe (genera HTML para PDF) |
| **Inngest Queue** | `inngest/functions/upload-new-cv.ts` | ✅ Existe, **NO pasa templateId** |
| **Autenticación** | `lib/auth.ts` | ✅ Existe |
| **Sistema de Créditos** | `features/credits/` | ✅ Existe |
| **Suscripciones** | `prisma.model UserPayment, PaymentPlan` | ✅ Existe |

### Observaciones clave:

1. **Cv.model NO tiene templateId** → Necesita migración
2. **No existe CvTemplate.model** → Debe crearse
3. **cv-preview.tsx usa hardcoded styles** → Necesita abstraerse a objeto de estilos dinámicos
4. **cv-document.tsx usa @react-pdf/renderer** → Necesita aceptar templateId para aplicar estilos
5. **pdf-generator.ts usa HTML/CSS puro** → Necesita versión con estilos por template
6. **Inngest upload-new-cv no conoce templateId** → Payload debe expandirse
7. **No existe "Template Gallery" UI** → Debe crearse como componente modal o sección del builder

---

## 3️⃣ IMPACTO EN STORAGE y ASSETS

### ¿Dónde se almacenan los thumbnails?

Opciones:
1. **SQLite en BD** (BLOB) → ❌ No recomendado para imágenes grandes
2. **AWS S3 / CloudStorage** → ✅ Mejor prácticaActualmente jobby-app alojaría en:
   - `public/templates/` (local) → Para desarrollo/demo
   - AWS S3 (production) → Recomendado

**4 thumbnails × 2 resoluciones (móvil/desktop) = ~8 assets**

---

## 4️⃣ FLUJO DE VALIDACIÓN (Permisos Premium)

Actualmente el proyecto tiene:
- `user_credit_balance` (créditos por tipo)
- `UserPayment` (suscripciones activas)
- `PaymentPlan` (planes disponibles)

**Lógica de validación necesaria:**
```
Si templateId = "premium":
  Si UserPayment.active = true Y expiresAt > now() → ✅ Permitir
  Si user_credit_balance[MANAGE_CVS] > 0 → ✅ Permitir (consumir crédito)
  Sino → ❌ Mostrar "Suscríbete" con enlace a /pricing
```

---

## 5️⃣ CACHEADO & PERFORMANCE

**Consideraciones:**
- Los templates son **datos estáticos** → Se pueden cachear en los stores de React
- Al cambiar template, solo el `state` cambia, sin re-renderizar el Cv en BD
- Revalidaré caché de PDFs cuando se actualice `cvId.templateId`

---

## 6️⃣ RIESGOS IDENTIFICADOS

| Riesgo | Severidad | Mitigación |
|--------|-----------|-----------|
| **Migración rompe CVs existentes** | 🔴 Alta | Default `templateId = "académico-puro"` (free). Migración safe. |
| **CSS de templates demasiado complejo** | 🟡 Media | Usar CSS variables (custom props) en lugar de condicionales inline. Mantener simple. |
| **PDF generado no coincide con preview** | 🔴 Alta | Testeo extenso. Same CSS en preview y PDF `cv-document.tsx`. |
| **Inngest no recibe templateId** | 🔴 Alta | Actualizar payload. Garantizar backwards compatibility. |
| **Bloat del bundle** | 🟡 Media | Lazy load de estilos de templates. Code split. |

---

## 7️⃣ DEPENDENCIAS EXTERNAS

- `@react-pdf/renderer` — Mantener sincronizado con preview
- `Inngest` — Versiones recientes soportan payloads complejos ✅
- `Prisma` — Migración requerida, soporta default values ✅

---

## 📐 PLAN PASO A PASO

### Fase 0: Prepromise & Desing (Sin código)
- [ ] **Crear diseños de los 4 templates en Figma/CSS mockup**
  - Específicamente: layout, tipografía, colores, iconografía
  - Deliverable: Especificación visual (Figma o HTML estática)

- [ ] **Crear thumbnails de 400x500px (2x resolución)**
  - Ej: `europass-modern.png`, `fulbright-leader.png`, etc.
  - Almacenar en `/public/templates/` (temporalmente) o plan S3

- [ ] **Revisar DATABASE_DOC.md y CHANGELOG.MD para versionado**

---

### Fase 1: Base de Datos & Configuración

**Paso 1.1: Crear CvTemplate seed data**
- [ ] Crear archivo `prisma/seed/cv-templates.ts`
  - Define los 4 templates con: id, name, category, isPremium, thumbnail URL, estilos CSS (como JSON)
  - Ejemplo:
    ```json
    {
      "id": "europass-modern",
      "name": "Europass Modern",
      "category": "academic",
      "isPremium": false,
      "thumbnail": "/templates/europass-modern.png",
      "cssVariables": {
        "primaryColor": "#1f2937",
        "accentColor": "#3b82f6",
        ...
      }
    }
    ```

**Paso 1.2: Crear migración Prisma**
- [ ] `prisma/migrations/[timestamp]_add_cv_template_relation.sql`
  - Crear tabla `cv_template` con campos: id, name, category, isPremium, thumbnail, cssVariables (JSON), createdAt
  - Agregar `templateId` a `cv` con FK, default="europass-modern"
  - Índice en `cv.templateId` para queries rápidas
  - Migración SAFE: No dropea CVs existentes, asigna default

**Paso 1.3: Actualizar schema.prisma**
- [ ] Agregar modelo `CvTemplate`
- [ ] Actualizar modelo `Cv` con:
  ```prisma
  templateId String @default("europass-modern")
  template CvTemplate @relation(fields: [templateId], references: [id])
  @@index([templateId])
  ```
- [ ] Correr `prisma migrate dev` para generar cliente actualizado

---

### Fase 2: Backend - Acciones & Servicios

**Paso 2.1: Crear action para obtener templates disponibles**
- [ ] Archivo: `features/cv/actions/get-cv-templates.ts`
  - Server action que retorna lista de templates
  - Marca premium con base en `user.subscription` (si está activa)
  - Input: `userId` (opcional para admin)
  - Output: `{ id, name, isPremium, isUnlocked, thumbnail }`

**Paso 2.2: Crear action para validar acceso a template premium**
- [ ] Archivo: `features/cv/actions/validate-template-access.ts`
  - Valida si usuario tiene acceso a un template específico
  - Lógica:
    ```
    Si isPremium = false → return { allowed: true }
    Si UserPayment.active = true → return { allowed: true }
    Si credits[MANAGE_CVS] > 0 → return { allowed: true, willConsume: true }
    Sino → return { allowed: false, requiresPayment: true }
    ```

**Paso 2.3: Crear action para actualizar templateId del CV**
- [ ] Archivo: `features/cv/actions/update-cv-template.ts`
  - Recibe: `cvId`, `templateId`
  - Valida permisos (mismo usuario propietario del CV)
  - Valida acceso a template (usa 2.2)
  - Actualiza `Cv.templateId` en BD
  - Revalidaré paths de previsualización y lista de CVs

**Paso 2.4: Actualizar Inngest `upload-new-cv` para incluir templateId**
- [ ] Modificar `inngest/functions/upload-new-cv.ts`
  - El payload del evento ahora incluye: `{ cvId, attachmentUrl, userId, templateId }`
  - Asegurar backwards compatibility (default a "europass-modern" si no viene)
  - Pasar `templateId` a las funciones de generación de PDF

---

### Fase 3: Frontend - UI Components

**Paso 3.1: Crear Template Gallery Modal**
- [ ] Archivo: `features/cv/components/template-gallery-modal.tsx`
  - Componente: modal con grid de 2x2 (4 templates)
  - Cada card muestra:
    - Thumbnail (400x500px)
    - Nombre del template
    - Indicador "Pro" (corona, badge) si isPremium
    - Botón "Seleccionar" o "Desbloquear"
  - Loading state mientras carga templates
  - Error state si falla la query

**Paso 3.2: Integrar Modal en CV Builder**
- [ ] Actualizar `features/cv/components/cv-form.tsx`
  - Agregar botón "Cambiar Diseño" o "Templates" en la UI del builder
  - onClick → abre Template Gallery Modal
  - Usar transición de React (useTransition) para actualizar CV
  - Loading state durante actualización

**Paso 3.3: Crear TemplateStylesProvider**
- [ ] Archivo: `features/cv/components/template-styles-provider.tsx`
  - HOC que proporciona estilos dinámicos basados en templateId
  - Via Context API o prop drilling (depende de estructura)
  - Exporta objeto de estilos: `{ headerColor, fontFamily, spacing, ... }`

**Paso 3.4: Actualizar CVPreview para aceptar templateId**
- [ ] Modificar `features/cv/components/cv-preview.tsx`
  - Nuevos props: `templateId?: string`
  - Aplicar estilos dinámicos de `TemplateStylesProvider`
  - Posible refactor: extraer `sectionTitleClasses` a variable dinámica
  - Sin cambios en datos (data sigue siendo el mismo JSON)

**Paso 3.5: Agregar badge de template a CV List**
- [ ] Actualizar `features/cv/components/cv-card.tsx` o `cv-list-screen.tsx`
  - Mostrar etiqueta pequeña con nombre del template seleccionado
  - Badge "Pro" si es premium

---

### Fase 4: PDF Generation

**Paso 4.1: Refactorizar CvDocument para templates**
- [ ] Modificar `components/pdf-preview/cv-document.tsx`
  - Nuevos props: `templateId?: string`
  - Crear objeto `TEMPLATE_STYLES` con estilos CSS por template
  - Aplicar condicionales: `if (templateId === 'europass-modern') { ... }`
  - O usar CSS-in-JS dinámico (StyleSheet.create con variables)
  - Testear que PDF renderiza correctamente

**Paso 4.2: Actualizar pdf-generator.ts (HTML fallback)**
- [ ] Modificar `utils/pdf-generator.ts`
  - Si Inngest usa HTML puro como fallback, necesita templateId
  - Generar HTML con clases CSS dinámicas
  - Enlazar a stylesheet que define estilos por template
  - Menos crítico si solo usa `@react-pdf/renderer`

**Paso 4.3: Test de PDFs generados**
- [ ] Crear test script que genere 4 PDFs (uno por template)
  - Validar que:
    - Colores correctos
    - Tipografía correcta
    - Secciones presentes
    - Espaciados correctos
  - Manual testing con preview en navegador

---

### Fase 5: Validación & Permisos

**Paso 5.1: Implementar Paywall para templates premium**
- [ ] Actualizar Template Gallery Modal
  - Botón "Seleccionar" deshabilitado si usuario non-premium
  - onClick muestra toast + enlace a `/pricing`
  - O modal de "Upgrade" inline

**Paso 5.2: Agregar validación en server actions**
- [ ] En `update-cv-template.ts`
  - Verificar que usuario tiene acceso (fase 2.2)
  - Loguear cambio de template (audit trail)
  - Si template es premium y usuario sin créditos:
    - Permitir seleccionar pero con warning
    - O consumir 1 crédito al seleccionar

---

### Fase 6: Testing & QA

**Paso 6.1: Unit tests para actions**
- [ ] Test `get-cv-templates.ts`
  - Retorna todos los templates
  - Marca correctamente isPremium/isUnlocked

- [ ] Test `validate-template-access.ts`
  - Usuario gratuito → free templates ✅, premium ❌
  - Usuario suscrito → todos ✅
  - Usuario con créditos → todos ✅

- [ ] Test `update-cv-template.ts`
  - Actualiza correctamente
  - Valida permiso de usuario
  - Rechaza templates no permitidos

**Paso 6.2: E2E tests**
- [ ] Flow completo: abrir CV → cambiar template → ver preview en tiempo real
- [ ] Flow premium: usuario free intenta premium → muestra paywall
- [ ] Flow PDF: generar PDF con cada template → validar visualización

**Paso 6.3: Regression testing**
- [ ] CVs existentes (sin templateId) se asignan default correctamente
- [ ] PDFs antiguos todavía se generan sin errors
- [ ] Inngest backwards compatible si payload es antiguo

---

### Fase 7: Documentación & Deploy

**Paso 7.1: Actualizar documentación**
- [ ] `DATABASE_DOC.md` → Agregar sección `CvTemplate`
- [ ] `DEPLOYMENT.MD` → Nueva versión con migración requerida
- [ ] `CHANGELOG.MD` → Entrada de features (templates free, premium, live preview)

**Paso 7.2: Seed data & fixtures**
- [ ] Correr `prisma db seed` para popular templates iniciales
- [ ] Verificar que todos los 4 templates están en BD

**Paso 7.3: Deploy strategy**
- [ ] Migración cero-downtime (default value en migration)
- [ ] Feature flag opcional (ENV var) para rollout gradual
- [ ] Rollback plan: borrar templateId de queries si necesario

---

## 📊 ESTIMACIÓN DE ESFUERZO

| Fase | Tarea Clave | Horas Est. | Notas |
|------|---|---|---|
| **0** | Diseños + Assets | 8-12h | Depende si tienes diseños previos |
| **1** | DB + Migración | 2-3h | Straightforward, bien soportado por Prisma |
| **2** | Backend (5 actions) | 4-5h | Lógica de validación es lo más complejo |
| **3** | UI (5 componentes) | 6-8h | Modal, integración en builder, estilos dinámicos |
| **4** | PDF Gen | 4-6h | Sincronizar estilos entre preview y PDF es crítico |
| **5** | Permisos/Paywall | 2-3h | Reutiliza lógica de créditos existing |
| **6** | Testing | 4-6h | Unit + E2E + Regression |
| **7** | Docs + Deploy | 1-2h | Documentation |
| **TOTAL** | | **31-45h** | Depende de complejidad de diseños CSS |

---

## ⚠️ GOTCHAS & CONSIDERACIONES

1. **CSS Variables vs StyleSheet.create**
   - `@react-pdf/renderer` NO soporta CSS variables de navegador
   - Solución: Usar `StyleSheet.create()` con valores hardcodeados o objetos dinámicos en JS

2. **Inngest backward compatibility**
   - Si cambias payload de evento, asegurar que handlers antiguos todavía funcionen
   - Usar defaults en payload

3. **Live preview performance**
   - Si cambias template de golpe → puede haber flicker
   - Usar `useTransition` para optimistic updates

4. **Thumbnails en storage**
   - `/public` es OK para desarrollo
   - Production: usar S3 o CDN con versionado de assets

5. **Migración a todos los CVs**
   - Si hay 1000 CVs existentes sin `templateId`
   - Migración con default `templateId = "europass-modern"` es SAFE
   - No requiere data backfill

---

## 🎯 SIGUIENTE PASO RECOMENDADO

**Prioridad 1 (Crítico):**
1. Finalizar **diseños de los 4 templates** (Figma o CSS mockup)
2. Crear **assets (thumbnails)**
3. Hacer **Fase 1** (DB + Migración)

**Prioridad 2 (Core Feature):**
4. Hacer **Fase 2** (Backend actions)
5. Hacer **Fase 3** (UI components)

**Prioridad 3 (Polish):**
6. Hacer **Fase 4** (PDF generation)
7. Hacer **Fase 5-7** (Validación, testing, deploy)

---

## ❓ PREGUNTAS A RESPONDER ANTES DE IMPLEMENTAR

1. ¿Tienes diseños finales de los 4 templates?
2. ¿Dónde se almacenarán los thumbnails? (local vs S3)
3. ¿Los usuarios premium actuales tienen acceso automático a templates premium?
4. ¿Se debe consumir créditos al seleccionar un template premium o solo al generar PDF?
5. ¿Necessitas feature flag para rollout gradual?
6. ¿Qué templates se consideren "premium"? (Se asume: Fulbright y los otros 2 son free)

