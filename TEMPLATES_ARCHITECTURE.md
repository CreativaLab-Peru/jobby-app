# 🗺️ Arquitectura & Dependencias - Templates Feature

## 1. DIAGRAMA DE FLUJO (Alto Nivel)

```
┌─────────────────────────────────────────────────────────────────────━┐
│                     CV BUILDER / EDIT PAGE                           │
│                                                                      │
│  ┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐  │
│  │  CV Form    │──────│ Template Gallery │──────│ Live Preview    │  │
│  │  Component  │      │    Modal         │      │  Component      │  │
│  └─────────────┘      └────────┬─────────┘      └─────────────────┘  │
│                                │                           ▲         │
│                                └───────────────────────────┘         │
│                                 (Estado React)                       │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ validateTemplate     │
                    │  Access()            │
                    │                      │
                    │ [Server Action]      │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
       ┌────────┐      ┌─────────────┐    ┌─────────────┐
       │  User  │      │   Credits   │    │ UserPayment │
       │ (Auth) │      │   (Balance) │    │  (Active?)  │
       └────────┘      └─────────────┘    └─────────────┘
                             │
                             └─────────────────────────────┐
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │   Allowed?  │
                                                    │   Yes/No    │
                                                    └─────────────┘
                                                           │
                    ┌───────────────────────────────┬────┼────┬──────────────────┐
                    │ Si Allowed = true             │    │    │                  │
                    └───────────────────────────────┘    ▼    ▼                  ▼
                                           updateCvTemplate() → Consume? → PDF Gen Update
```

---

## 2. DEPENDENCIAS DE DATOS (Entity Relationship para Templates)

```
┌─────────────┐
│  CvTemplate │ ← Tabla NUEVA
├─────────────┤
│ id (PK)     │
│ name        │
│ isPremium   │
│ thumbnail   │
│ cssVars     │
│ createdAt   │
└────────┬────┘
         │
         │ 1:N
         │
         ▼
    ┌─────────┐
    │   Cv    │ ← Tabla MODIFICADA
    ├─────────┤
    │ id      │
    │ userId  │ ──────┐
    │... ...  │       │
    │template │───┐   │
    │   Id    │   │   │
    └─────────┘   │   │
                  │   │
        1:N       │   │ N:1
        │         │   │
        ▼         ▼   ▼
    ┌──────────────────┐
    │      User        │
    ├──────────────────┤
    │ id (PK)          │
    │ email            │
    │ ...              │
    └──────────────────┘
         │
         │ 1:N
         │
    ┌────┴────────────┐
    ▼                 ▼
┌──────────┐    ┌─────────────┐
│ CreditBal│    │ UserPayment │
└──────────┘    └─────────────┘
```

---

## 3. FLUJO DE GENERACIÓN DE PDF (Con Templates)

```
Usuario selecciona "Descargar PDF"
        │
        ▼
┌─────────────────────┐
│ checkCredits()      │ ← Validar créditos/suscripción
│ [Server Action]     │
└──────┬──────────────┘
       │
       ▼ (Si OK)
┌──────────────────────────────┐
│ triggerPdfGeneration()       │ ← Emit Inngest event
│ [Inngest Event]              │
│ Payload: {                   │
│   cvId,                      │
│   userId,                    │
│   templateId, ← NUEVO        │
│   ... otros                  │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ uploadNewCv / processPdf     │ ← Inngest Function
│ (o nueva función)            │
│                              │
│ Recibe templateId            │
└──────────┬───────────────────┘
           │
           ├─ Si @react-pdf/renderer:
           │    CvDocument.tsx + templateId
           │
           └─ Si HTML fallback:
                pdf-generator.ts + templateId
                (aplica clases CSS dinámicas)
           │
           ▼
┌──────────────────────────────┐
│ Generar PDF con estilos      │
│ del template                 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Almacenar PDF + metadata     │
│ (S3 o storage local)         │
└──────────┬───────────────────┘
           │
           ▼
Usuario descarga PDF ✅
```

---

## 4. COMPONENTES CLAVE & PUNTO DE INTEGRACIÓN

### Componentes EXISTENTES que REQUIEREN CAMBIOS:

```
features/cv/components/
├── cv-form.tsx
│   └── + Botón "Cambiar Diseño"
│       └── Abre TemplateGalleryModal
│
├── cv-preview.tsx
│   └── + Props: templateId
│       └── Usa estilos dinámicos
│
├── cv-list-screen.tsx
│   └── + Badge con nombre del template
│
└── admin/
    └── admin-cv-card.tsx
        └── + Badge template (opcional)


components/pdf-preview/
├── cv-document.tsx
│   └── + Props: templateId
│       └── StyleSheet dinámico por template
│
└── client-pdf-preview.tsx
    └── (Probablemente sin cambios)


inngest/functions/
└── upload-new-cv.ts
    └── + Recibe templateId en payload
        └── Pasa a generadores de PDF


utils/
└── pdf-generator.ts
    └── + Recibe templateId
        └── Genera HTML con clases CSS dinámicas
```

### Componentes NUEVOS a crear:

```
features/cv/components/
├── template-gallery-modal.tsx ← NUEVO
│   ├── Grid 2x2 de templates
│   ├── Muestra: thumbnail, nombre, "Pro" badge
│   ├── Botones: "Seleccionar" o "Desbloquear"
│   └── Loading/Error states
│
└── template-styles-provider.tsx ← NUEVO
    ├── HOC Context para estilos dinámicos
    ├── Exporta objeto: { colors, fonts, spacing, ... }
    └── Basado en templateId


features/cv/actions/
├── get-cv-templates.ts ← NUEVO
│   └── Obtiene lista de templates + estado de acceso
│
├── validate-template-access.ts ← NUEVO
│   └── Valida si usuario puede usar un template
│
└── update-cv-template.ts ← NUEVO
    └── Actualiza Cv.templateId + validaciones


prisma/seed/
└── cv-templates.ts ← NUEVO
    └── Seed data de los 4 templates
```

---

## 5. IMPACTO EN MIGRACIONES & SCHEMA

### Migración Requerida (1):

```sql
-- prisma/migrations/[timestamp]_add_cv_templates.sql

-- 1. Crear tabla CvTemplate
CREATE TABLE cv_template (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'academic', 'modern', 'professional'
  isPremium BOOLEAN NOT NULL DEFAULT FALSE,
  thumbnail TEXT NOT NULL,
  cssVariables JSONB, -- Estilos dinámicos
  createdAt TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(id),
  INDEX idx_isPremium (isPremium),
  INDEX idx_category (category)
);

-- 2. Agregar templateId a Cv
ALTER TABLE cv
ADD COLUMN templateId TEXT NOT NULL DEFAULT 'europass-modern',
ADD FOREIGN KEY (templateId) REFERENCES cv_template(id),
ADD INDEX idx_templateId (templateId);

-- 3. Popular seeds
INSERT INTO cv_template VALUES
  ('europass-modern', 'Europass Modern', 'academic', FALSE, '/templates/europass-modern.png', ...),
  ('fulbright-leader', 'Líder Global', 'academic', TRUE, '/templates/fulbright-leader.png', ...),
  ('stem-researcher', 'Investigador STEM', 'academic', FALSE, '/templates/stem-researcher.png', ...),
  ('academic-pure', 'Académico Puro', 'academic', FALSE, '/templates/academic-pure.png', ...);
```

### Schema.prisma cambios:

```prisma
// AGREGAR modelo nuevo
model CvTemplate {
  id              String   @id
  name            String
  category        String   // 'academic', 'modern', 'professional'
  isPremium       Boolean  @default(false)
  thumbnail       String   // URL
  cssVariables    Json?    // variables CSS por template
  createdAt       DateTime @default(now())
  cvs             Cv[]

  @@map("cv_template")
}

// MODIFICAR modelo existente
model Cv {
  // ... campos existentes
  templateId  String    @default("europass-modern")
  template    CvTemplate @relation(fields: [templateId], references: [id])

  @@index([templateId])
  // ... resto de índices
}
```

---

## 6. FLUJO DE AUTORIZACIÓN DETALLADO

```
Usuario abre Template Gallery
        │
        ▼
GET /api/cv-templates?userId=X
        │
        ▼
┌─────────────────────────────────────────┐
│ getAndDecorateTemplates(userId)         │
├─────────────────────────────────────────┤
│ Para CADA template:                     │
│                                         │
│ 1. isPremium = template.isPremium?      │
│                                         │
│ 2. Si isPremium:                        │
│    a. Existe UserPayment.active? → ✅  │
│    b. Sino, user tiene créditos?  → ✅ │
│    c. Sino                        → ❌  │
│                                         │
│ 3. Retorna: isUnlocked: boolean         │
└─────────────────────────────────────────┘
        │
        ▼
UI renderiza:
- Free templates   → Botón "Seleccionar"
- Premium unlocked → Botón "Seleccionar"
- Premium locked   → Botón "Desbloquear" (→ /pricing)


Si usuario hace click en template premium locked:
        │
        ▼
┌──────────────────────────────┐
│ validateTemplateAccess()     │
│ templateId='fulbright-leader'│
└──────────┬───────────────────┘
           │
           ├─ Validaciones:
           │  ├─ Existe template?
           │  ├─ User existe?
           │  ├─ User owns CV?
           │  ├─ User can access template?
           │
           ├─ Si VALIDAS:
           │  ├─ updateCvTemplate()
           │  ├─ Revalidar previews
           │  └─ Return { success: true }
           │
           └─ Si NO:
              └─ Return { success: false, reason: "..." }
                  ├─ "REQUIRES_SUBSCRIPTION"
                  ├─ "REQUIRES_CREDITS"
                  └─ "UNAUTHORIZED"
```

---

## 7. MATRIZ DE COMPATIBILIDAD (Premium vs Free)

| Template | Free User | Subscriber | Admin | Nota |
|----------|-----------|-----------|-------|------|
| **Europass Modern** | ✅ | ✅ | ✅ | Default, puede usarse sin pago |
| **Fulbright Leader** | ❌ (Paywall) | ✅ | ✅ | Premium, requiere suscripción |
| **STEM Researcher** | ✅ | ✅ | ✅ | Incluido en plan gratuito |
| **Academic Pure** | ✅ | ✅ | ✅ | Template base |

---

## 8. CHECKLIST DE IMPLEMENTACIÓN

### Pre-Implementación ✓
- [ ] Diseños finales de 4 templates creados (Figma)
- [ ] Thumbnails 400x500px generados (2x res)
- [ ] Decisión: ¿CSS variables o objetos JS? (recomendado: JS)
- [ ] Cuál template es PREMIUM: Fulbright Leader (confirmado ABOVE)
- [ ] Storage plan: /public (dev) vs S3 (prod)

### Base de Datos (Fase 1) ✓
- [ ] Migración `[timestamp]_add_cv_templates.sql` creada
- [ ] Modelo `CvTemplate` en schema.prisma
- [ ] Modelo `Cv` actualizado con `templateId`
- [ ] Seed data `cv-templates.ts` creada
- [ ] `prisma migrate dev` ejecutada sin errores

### Backend (Fase 2) ✓
- [ ] `get-cv-templates.ts` creada ← obtiene lista
- [ ] `validate-template-access.ts` creada ← validación permisos
- [ ] `update-cv-template.ts` creada ← actualiza Cv.templateId
- [ ] `inngest/upload-new-cv.ts` actualizada ← recibe templateId
- [ ] Todos los endpoints con error handling

### Frontend (Fase 3) ✓
- [ ] `template-gallery-modal.tsx` creada
- [ ] Modal integrada en CV Form
- [ ] `template-styles-provider.tsx` creada
- [ ] `cv-preview.tsx` actualizada → acepta templateId
- [ ] Estilos dinámicos aplicados en preview
- [ ] Badge de template en cv-card.tsx

### PDF (Fase 4) ✓
- [ ] `cv-document.tsx` actualizada → recibe templateId
- [ ] Estilos CSS por template en `@react-pdf/renderer`
- [ ] `pdf-generator.ts` actualizada (si aplica)
- [ ] 4 PDFs generados manualmente + validados visualmente

### Permisos (Fase 5) ✓
- [ ] Paywall en modal para templates premium
- [ ] Validación en `update-cv-template.ts`
- [ ] Toast/mensajes de error claros
- [ ] Enlace a `/pricing` en caso de bloqueo

### Testing (Fase 6) ✓
- [ ] Unit tests para 3 server actions
- [ ] E2E test: cambiar template → ver preview cambio
- [ ] E2E test: usuario free → intenta premium → paywall
- [ ] Regression: CVs antiguo sin templateId → default OK
- [ ] PDF visual tests (4 templates)

### Documentación (Fase 7) ✓
- [ ] DATABASE_DOC.md actualizado (CvTemplate)
- [ ] DEPLOYMENT.md con nueva versión + migración
- [ ] CHANGELOG.md con nuevo feature
- [ ] README de desarrollo (templates system)

### Deploy (Fase 7) ✓
- [ ] Feature flag (ENV var) para rollout gradual
- [ ] Seed data ejecutada en prod
- [ ] Rollback plan documentado
- [ ] Monitoreo de errores activado

---

## 9. EJEMPLOS DE CÓDIGO PLACEHOLDER

### Ejemplo: TemplateStylesProvider

```tsx
// features/cv/components/template-styles-provider.tsx
import { createContext } from 'react';

export interface TemplateStyles {
  headerColor: string;
  headerFontSize: number;
  accentColor: string;
  fontFamily: string;
  sectionTitleSize: number;
  bodyTextSize: number;
  spacing: { top: number; bottom: number; left: number; right: number };
}

const TEMPLATE_STYLES: Record<string, TemplateStyles> = {
  'europass-modern': {
    headerColor: '#1f2937',
    headerFontSize: 20,
    accentColor: '#3b82f6',
    fontFamily: 'Arial',
    sectionTitleSize: 12,
    bodyTextSize: 10.5,
    spacing: { top: 28, bottom: 28, left: 36, right: 36 },
  },
  'fulbright-leader': {
    headerColor: '#065f73', // Azul oscuro académico
    headerFontSize: 22,
    accentColor: '#b22234', // Rojo (Fulbright colors)
    fontFamily: 'Georgia, serif',
    sectionTitleSize: 13,
    bodyTextSize: 11,
    spacing: { top: 32, bottom: 32, left: 40, right: 40 },
  },
  'stem-researcher': {
    headerColor: '#1a365d', // Azul oscuro tech
    headerFontSize: 19,
    accentColor: '#2d7a8a',
    fontFamily: 'Monaco, monospace',
    sectionTitleSize: 11,
    bodyTextSize: 10,
    spacing: { top: 24, bottom: 24, left: 32, right: 32 },
  },
  'academic-pure': {
    headerColor: '#111111', // Negro puro
    headerFontSize: 18,
    accentColor: '#555555',
    fontFamily: 'Arial',
    sectionTitleSize: 11,
    bodyTextSize: 10,
    spacing: { top: 28, bottom: 28, left: 36, right: 36 },
  },
};

export function getTemplateStyles(templateId?: string): TemplateStyles {
  return TEMPLATE_STYLES[templateId || 'europass-modern'];
}

export type TemplateStylesContextType = TemplateStyles;
```

### Ejemplo: cv-document.tsx con templates

```tsx
// components/pdf-preview/cv-document.tsx
import { getTemplateStyles } from "@/features/cv/components/template-styles-provider";

interface DocumentProps {
  data: CVData;
  templateId?: string;
}

export function CvDocument({ data, templateId = 'europass-modern' }: DocumentProps) {
  const styles = getTemplateStyles(templateId);

  const dynamicStyles = StyleSheet.create({
    page: {
      paddingTop: styles.spacing.top,
      paddingBottom: styles.spacing.bottom,
      paddingHorizontal: styles.spacing.left,
      fontSize: styles.bodyTextSize,
      fontFamily: styles.fontFamily,
      color: styles.headerColor,
    },
    name: {
      fontSize: styles.headerFontSize,
      fontWeight: 'bold',
      color: styles.headerColor,
    },
    sectionTitle: {
      fontSize: styles.sectionTitleSize,
      color: styles.accentColor,
    },
    // ... más estilos dinámicos
  });

  return (
    <Document>
      <Page size="A4" style={dynamicStyles.page}>
        {/* Contenido */}
      </Page>
    </Document>
  );
}
```

---

## 10. RIESGO TÉCNICO DETALLADO & MITIGACIÓN

| Riesgo | Severidad | Causa | Impacto | Mitigación |
|--------|-----------|------|--------|-----------|
| PDF no coincide con preview | 🔴 Alta | CSS diferente entre `@react-pdf` y navegador | Usuario ve diseño diferente en PDF vs preview | Testeo visual exhaustivo. Usar misma librería CSS. Variables compartidas. |
| Performance regresión (3 nuevos componentes) | 🟡 Media | Rendering ineficiente de modal/preview actualización | Builder lento, mala UX | Lazy loading de modal. Memoize componentes. useTransition para updates. |
| CVs antiguo sin templateId (backward compat) | 🔴 Alta | Migración no asigna default automáticamente | Queries fallan, PDFs no generan | Migración con `DEFAULT 'europass-modern'`. Zero-downtime deploy. |
| Inngest payload break (versioning) | 🔴 Alta | Worker viejo intenta procesar payload nuevo | Pdf generation falló | Validar payload. Defaults en handler. Mantener 2 versiones brevemente. |
| Storage URLs de thumbnails inválidas | 🟡 Media | Assets movidos o buckets S3 renombrados | Modal muestra imágenes rotas | Usar URLs relativas `/templates/`. CDN con versionado. 404 fallback. |
| Créditos no consumidos correctamente | 🟡 Media | Lógica de validación incompleta | Usuario pierde acceso a premium sin razón | Unit test exhaustivo. Logging de consumo. Audit trail en BD. |
| UX confusa entre free/premium | 🟡 Media | Comunicación poco clara en UI | Usuarios frustrantes, soporte overload | Clear paywall messaging. "Upgrade" button explícito. Test A/B si es posible. |

---

## 11. MÉTRICAS DE ÉXITO

Después del deploy, validar:

- [ ] **Adopción:** 70%+ de usuarios con un template no-default después de 2 semanas
- [ ] **Premium Conversion:** 10%+ de usuarios que ven paywall convierten en créditos/suscripción
- [ ] **PDF Quality:** 0 quejas sobre "PDF looks different"
- [ ] **Performance:** Builder load time < 3s (misma que antes)
- [ ] **Bugs:** < 2 issues críticos reportados en 30 días

