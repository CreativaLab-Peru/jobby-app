# 📋 Plan Simplificado: 3 Templates Gratuitos para CV

**Fecha:** 2025
**Scope:** 3 templates FREE para INTERNSHIP & SCHOLARSHIP
**Estimado:** ~15 horas
**Status:** 🔄 Planificación (awaiting UI placement decision)

---

## 1️⃣ REQUIREMENT CLARIFICADO

### 1.1 Qué se implementa
- ✅ **3 Templates GRATUITOS:** Europass Modern, Líder Global (Fulbright), STEM Researcher
- ✅ **Disponible SOLO para:** Internship (Pasantía) y Scholarship (Beca)
- ✅ **Sin premium logic:** Todo es gratis, sin validaciones de créditos
- ✅ **Sin rollout:** Deploy directo a producción
- ✅ **Live preview:** Cambios en tiempo real
- ✅ **Persistencia:** Guardar en BD (`Cv.templateId`)

### 1.2 Los 3 Templates

| Template | Propósito | Elemento Distintivo |
|----------|----------|---|
| **Europass Modern** | Intercambios Europa (Erasmus+, movilidad) | Sección Idiomas con Marco Común (A1-C1) |
| **Líder Global** | Becas prestigio (Fulbright, Chevening, DAAD) | Resalta Voluntariado + Liderazgo |
| **Investigador STEM** | Ingeniería, Ciencias, Pasantías investigación | Cards de Proyectos con Techs |

---

## 2️⃣ UBICACIÓN DEL SELECTOR (DECISIÓN CRÍTICA)

### 2.1 Análisis de opciones

**OPCIÓN A: En `cv-form.tsx` ⭐ RECOMENDADA**
```
Form actual:
├── Title input
├── OpportunityType select
├── CvType select
└── [NEW] Template select ← AQUÍ (condicional: INTERNSHIP || SCHOLARSHIP)
```
- ✅ Lugar más natural
- ✅ Junto a otros metadatos de CV
- ✅ Lógica condicional ya existe en cv-form.tsx
- ✅ Menos refactoring

---OPCIÓN B: En header de `create-cv-page.tsx`
```
Header:
├── CV Title
├── [NEW] Template toggle/select
├── Preview toggle
```
- ⚠️ Requiere restructurar layout
- ⚠️ Separado del "setup" inicial del CV

---

**OPCIÓN C: Botón modal "Cambiar Diseño"**
```
Preview area:
└── "Cambiar Diseño" btn → Modal con 3 cards
```
- ⚠️ Componente extra
- ⚠️ Flujo menos intuitivo

---

**→ RECOMENDACIÓN: OPCIÓN A** (cv-form.tsx, select condicional)

---

## 3️⃣ IMPLEMENTACIÓN (5 FASES)

### FASE 1: Database (2-3 horas)

**Paso 1.1:** Crear migración Prisma
```bash
npx prisma migrate dev --name add_template_id_to_cv
```

**Paso 1.2:** Actualizar `prisma/schema.prisma`
```prisma
model Cv {
  id          String   @id @default(cuid())
  templateId  String   @default("europass")  // default template
  // ... resto de campos
}

model CvTemplate {
  id          String   @id @default(cuid())
  code        String   @unique  // "europass", "fullbright", "stem"
  name        String              // "Europass Modern"
  description String              // Descripción UI
  thumbnailUrl String            // URL del preview
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

**Paso 1.3:** Ejecutar migración
```bash
npx prisma migrate dev
```

**Paso 1.4:** Seed templates en BD (ejecutar en seed.ts)
```typescript
// prisma/seed/templates.ts
const templates = [
  {
    code: 'europass',
    name: 'Europass Modern',
    description: 'Diseño moderno compatible con estándares europeos. Perfecto para Erasmus+ e intercambios.',
    thumbnailUrl: '/templates/europass-thumb.jpg'
  },
  {
    code: 'fullbright',
    name: 'Líder Global',
    description: 'Destaca voluntariado y liderazgo. Ideal para becas de prestigio internacional.',
    thumbnailUrl: '/templates/fullbright-thumb.jpg'
  },
  {
    code: 'stem',
    name: 'Investigador STEM',
    description: 'Diseño especializado para ingeniería, ciencias y proyectos técnicos.',
    thumbnailUrl: '/templates/stem-thumb.jpg'
  }
];
for (const t of templates) {
  await db.cvTemplate.create({ data: t });
}
```

---

### FASE 2: Server Actions (2 horas)

**Paso 2.1:** Crear server action para actualizar template
```typescript
// features/cv/actions/update-cv-template.ts
'use server'

import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateCvTemplate(cvId: string, templateId: string) {
  const cv = await db.cv.update({
    where: { id: cvId },
    data: { templateId }
  })
  
  revalidatePath('/dashboard/cv-builder')
  return { success: true, cv }
}
```

**Paso 2.2:** Actualizar `inngest/functions/upload-new-cv.ts`
- Asegurarse que el evento incluye `templateId`
- Pasar templateId al PDF generator

---

### FASE 3: Frontend - Template Selector (3-4 horas)

**Paso 3.1:** Crear componente selector
```typescript
// features/cv/components/template-selector.tsx
'use client'

import { CvTemplate } from '@prisma/client'
import { useState } from 'react'
import { updateCvTemplate } from '../actions/update-cv-template'
import { Select } from '@/components/ui/select'

interface Props {
  cvId: string
  templates: CvTemplate[]
  defaultValue: string
  showOnly?: boolean // Si es true, renderizar solo si INTERNSHIP || SCHOLARSHIP
}

export function TemplateSelector({ cvId, templates, defaultValue, showOnly }: Props) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(defaultValue)
  
  const handleChange = async (templateId: string) => {
    setLoading(true)
    setSelected(templateId)
    await updateCvTemplate(cvId, templateId)
    setLoading(false)
  }
  
  return (
    <Select
      label="Diseño de CV"
      value={selected}
      options={templates.map(t => ({
        value: t.id,
        label: t.name
      }))}
      onChange={handleChange}
      disabled={loading}
    />
  )
}
```

**Paso 3.2:** Integrar en `cv-form.tsx`
```tsx
{(opportunityType === 'INTERNSHIP' || opportunityType === 'SCHOLARSHIP') && (
  <TemplateSelector
    cvId={cvData.id}
    templates={templates}
    defaultValue={cvData.templateId}
  />
)}
```

---

### FASE 4: Frontend - Dynamic Styles (3-4 horas)

**Paso 4.1:** Crear archivo de estilos por template
```typescript
// features/cv/templates/template-styles.ts
export const TEMPLATE_STYLES = {
  europass: {
    sectionTitleClasses: 'text-lg font-bold text-blue-600 border-b-2 border-blue-600',
    sectionDividerClasses: 'h-1 bg-blue-100',
    headingColor: '#1e40af',
    accentColor: '#3b82f6'
  },
  fullbright: {
    sectionTitleClasses: 'text-lg font-bold text-amber-700 uppercase tracking-wider',
    sectionDividerClasses: 'h-2 bg-amber-200',
    headingColor: '#92400e',
    accentColor: '#d97706'
  },
  stem: {
    sectionTitleClasses: 'text-lg font-bold text-indigo-600 border-l-4 border-indigo-600 pl-3',
    sectionDividerClasses: 'h-1 bg-indigo-100',
    headingColor: '#4f46e5',
    accentColor: '#6366f1'
  }
}
```

**Paso 4.2:** Actualizar `cv-preview.tsx`
```tsx
interface Props {
  cvData: Cv
  templateId: string  // NEW
}

export function CVPreview({ cvData, templateId }: Props) {
  const styles = TEMPLATE_STYLES[templateId as keyof typeof TEMPLATE_STYLES]
  
  return (
    <div className="preview">
      <section>
        <h2 className={styles.sectionTitleClasses}>Educación</h2>
        {/* ... resto */}
      </section>
    </div>
  )
}
```

**Paso 4.3:** Actualizar `cv-document.tsx` (PDF)
```tsx
interface Props {
  cv: Cv
  templateId: string  // NEW
}

export function CVDocument({ cv, templateId }: Props) {
  const styles = TEMPLATE_STYLES[templateId]
  
  return (
    <Document>
      <Page>
        <Text style={{ color: styles.headingColor }}>
          {cv.personalInfo.name}
        </Text>
      </Page>
    </Document>
  )
}
```

---

### FASE 5: Testing (2-3 horas)

**Checklist:**
- ✅ Template selector solo visible para INTERNSHIP & SCHOLARSHIP
- ✅ Template se guarda en BD
- ✅ Live preview actualiza con cambio de template
- ✅ PDF refleja el template seleccionado
- ✅ CVs sin templateId (viejos) heredan default
- ✅ Los 3 templates se ven correctamente

---

## 4️⃣ ARCHIVOS A MODIFICAR/CREAR

| Archivo | Acción | Notas |
|---------|--------|-------|
| `prisma/schema.prisma` | ✏️ Editar | Agregar `templateId` a `Cv`, crear `CvTemplate` |
| `prisma/migrations/` | ✨ Crear | Auto-generada por `prisma migrate dev` |
| `prisma/seed/templates.ts` | ✨ Crear | Seed de 3 templates |
| `features/cv/actions/update-cv-template.ts` | ✨ Crear | Server action |
| `features/cv/components/template-selector.tsx` | ✨ Crear | Componente UI |
| `features/cv/templates/template-styles.ts` | ✨ Crear | Definir estilos por template |
| `features/cv/components/cv-form.tsx` | ✏️ Editar | Agregar selector condicional |
| `features/cv/components/cv-preview.tsx` | ✏️ Editar | Aceptar `templateId`, aplicar estilos |
| `features/cv/components/create-cv-page.tsx` | ✏️ Editar | Pasar `templateId` a preview |
| `components/pdf-preview/cv-document.tsx` | ✏️ Editar | Aceptar `templateId`, aplicar estilos en PDF |
| `inngest/functions/upload-new-cv.ts` | ✏️ Editar | Pasar `templateId` al PDF generator |

---

## 5️⃣ SECUENCIA DE IMPLEMENTACIÓN

**Día 1:**
1. Cambios en schema + migración (1h)
2. Seed de templates (30m)
3. Server action (1h)

**Día 2:**
4. Template selector component (1.5h)
5. Integración en cv-form.tsx (1h)
6. Template styles file (1h)

**Día 3:**
7. Actualizar cv-preview.tsx (1.5h)
8. Actualizar cv-document.tsx (1.5h)
9. Actualizar inngest (1h)

**Día 4:**
10. Testing completo (3h)
11. QA y ajustes (2h)

---

## 6️⃣ EJEMPLO: CÓMO CAMBIA EL FLUJO

### Flujo actual (SIN templates):
1. Usuario hace click "Nuevo CV"
2. Form: Ingresa título, elige tipo (INTERNSHIP, SCHOLARSHIP, etc.), perfil (TECHNOLOGY, etc.)
3. Builder: Crea secciones según tipo
4. Preview: Renderiza con estilos hardcoded
5. Save: Guarda CV

### Flujo nuevo (CON templates):
1. Usuario hace click "Nuevo CV"
2. Form: Ingresa título, elige tipo (INTERNSHIP/SCHOLARSHIP), perfil, **selecciona template**
3. Builder: Crea secciones según tipo
4. Preview: Renderiza con estilos del template **dinámicamente**
5. Usuario puede cambiar template en cualquier momento (va a step 2)
6. Save: Guarda CV **con templateId**
7. PDF: Se genera con el template seleccionado

---

## 7️⃣ DECISIÓN PENDIENTE

**❓ Necesitamos confirmar:**
1. **¿Usar OPCIÓN A (cv-form.tsx)?** Recomendado.
2. **¿O prefieres otra ubicación?**

**Una vez decidido → Comenzamos FASE 1 (Database)**

---

## 8️⃣ NOTAS ADICIONALES

- **Backwards compatibility:** CVs existentes sin `templateId` = default a "europass"
- **No premium logic:** Se simplificó X1000 respecto al plan anterior
- **Assets:** Thumbnails en `/public/templates/` (local dev), AWS S3 (prod)
- **Performance:** Estilos cacheados en `TEMPLATE_STYLES` object (no API calls)

✅ **Este plan es 100% factible en 3-4 días de desarrollo.**
