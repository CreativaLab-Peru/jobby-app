# 📋 Plan Templates: CONSERVADOR (No tocar Harvard)

**Fecha:** Marzo 2025
**Filosofía:** Add-on, NO refactorizar código existente
**Estimado:** ~8-10 horas
**Status:** 🔄 Listo para comenzar

---

## 1️⃣ ARQUITECTURA: Lo que CAMBIA vs lo que NO CAMBIA

### ✅ LO QUE NO TOCA NADA (Harvard sigue igual)
- `cv-preview.tsx` → **CERO cambios**, mantiene estilos hardcoded
- `cv-document.tsx` → **CERO cambios**, mantiene StyleSheet existente
- `pdf-generator.ts` → **CERO cambios**, sigue funcionando igual
- Todos los server actions existentes → **REUTILIZAR sin modificar**
- Inngest functions → **Minimizar cambios**

### ✏️ LO QUE SÍ SE AGREGA (Como capas opcionales)
- `Cv.templateId` campo en BD (default = "harvard")
- Select en `cv-form.tsx` (solo INTERNSHIP || SCHOLARSHIP)
- **Nuevos componentes de preview:** `cv-preview-europass.tsx`, `cv-preview-stem.tsx`, etc.
- **Nuevos PDF renderers:** `cv-document-europass.tsx`, `cv-document-stem.tsx`, etc.
- Una simple conditional en `create-cv-page.tsx`: Qué preview renderizar según template

---

## 2️⃣ PLAN DE IMPLEMENTATION (5 FASES MUY SIMPLES)

### FASE 1: Database (30 min)

```bash
# 1. Crear migración
npx prisma migrate dev --name add_template_id_to_cv

# 2. En schema.prisma:
model Cv {
  ...
  templateId  String   @default("harvard")  // harvard, europass, stem, fullbright
  ...
}

# 3. Ejecutar
npx prisma migrate dev
```

**Total tiempo:** 30 minutos

---

### FASE 2: Selector en cv-form.tsx (45 min)

**Cambio MÍNIMO en `cv-form.tsx`:**

```tsx
{/* AGREGAR DESPUÉS DEL CAMPO opportunityType */}
{(opportunityType === 'INTERNSHIP' || opportunityType === 'SCHOLARSHIP') && (
  <Select
    label="Diseño de CV"
    value={templateId || "harvard"}
    options={[
      { value: "harvard", label: "Harvard (Default)" },
      { value: "europass", label: "Europass Modern" },
      { value: "stem", label: "Investigador STEM" },
      { value: "fullbright", label: "Líder Global" }
    ]}
    onChange={(value) => handleTemplateChange(value)}
  />
)}
```

**Total tiempo:** 45 minutos

---

### FASE 3: Nuevos componentes de Preview (3-4 horas)

**CREAR NUEVOS ARCHIVOS (sin tocar cv-preview.tsx):**

```
features/cv/components/
├── cv-preview.tsx                    ← ORIGINAL (SIN CAMBIOS)
├── cv-preview-europass.tsx          ← NUEVO (copia + estilos Europass)
├── cv-preview-stem.tsx              ← NUEVO (copia + estilos STEM)
└── cv-preview-fullbright.tsx        ← NUEVO (copia + estilos Fullbright)
```

**En `create-cv-page.tsx`:**
```tsx
// Importar los previews condicionales
const renderPreview = () => {
  switch (cvData.templateId) {
    case "europass":
      return <CVPreviewEuropass data={cvData} sections={sections} />;
    case "stem":
      return <CVPreviewStem data={cvData} sections={sections} />;
    case "fullbright":
      return <CVPreviewFullbright data={cvData} sections={sections} />;
    default: // harvard
      return <CVPreview data={cvData} sections={sections} />;
  }
};
```

**Total tiempo:** 3-4 horas (copy-paste + cambiar estilos)

---

### FASE 4: Nuevos renderers PDF (2-3 horas)

**CREAR NUEVOS ARCHIVOS en `components/pdf-preview/`:**

```
components/pdf-preview/
├── cv-document.tsx                  ← ORIGINAL (SIN CAMBIOS)
├── cv-document-europass.tsx         ← NUEVO
├── cv-document-stem.tsx             ← NUEVO
└── cv-document-fullbright.tsx       ← NUEVO
```

**La lógica en Inngest o donde se genere PDF:**
```tsx
const getPDFRenderer = (templateId: string) => {
  switch (templateId) {
    case "europass":
      return CVDocumentEuropass;
    case "stem":
      return CVDocumentStem;
    case "fullbright":
      return CVDocumentFullbright;
    default:
      return CVDocument; // Harvard
  }
};
```

**Total tiempo:** 2-3 horas

---

### FASE 5: Testing (30-45 min)

**Checklist:**
- [ ] Template selector aparece solo en INTERNSHIP/SCHOLARSHIP
- [ ] Selector guardado en BD (Cv.templateId)
- [ ] Preview cambia según template seleccionado
- [ ] PDF se genera con el template correcto
- [ ] CVs viejos sin templateId defaultean a Harvard
- [ ] Harvard igual que antes (sin cambios visuales)

**Total tiempo:** 30-45 minutos

---

## 3️⃣ ARCHIVOS INVOLUCRADOS

| Archivo | Acción | Riesgo |
|---------|--------|--------|
| `prisma/schema.prisma` | ✏️ Add field + migrate | 🟢 Muy bajo |
| `features/cv/components/cv-form.tsx` | ✏️ Add select (5 líneas) | 🟢 Muy bajo |
| `features/cv/components/create-cv-page.tsx` | ✏️ Add conditional switch (10 líneas) | 🟢 Muy bajo |
| `features/cv/components/cv-preview.tsx` | 🔒 CERO cambios | 🟢 Nulo |
| `features/cv/components/cv-preview-europass.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| `features/cv/components/cv-preview-stem.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| `features/cv/components/cv-preview-fullbright.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| `components/pdf-preview/cv-document.tsx` | 🔒 CERO cambios | 🟢 Nulo |
| `components/pdf-preview/cv-document-europass.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| `components/pdf-preview/cv-document-stem.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| `components/pdf-preview/cv-document-fullbright.tsx` | ✨ Nuevo | 🟢 Nulo (add-on) |
| Inngest/ PDF generation | ✏️ Minimal (template selector) | 🟡 Bajo |

---

## 4️⃣ RIESGOS MITIGADOS

| Riesgo Original | Solución |
|--------|-----------|
| **Tocar Harvard y romperlo** | ✅ NO tocamos cv-preview.tsx ni cv-document.tsx |
| **Refactorizar estilos complejos** | ✅ Creamos nuevos archivos, no refactorizamos |
| **Migración quiebra CVs viejos** | ✅ Default `templateId = "harvard"` |
| **Perder server actions útiles** | ✅ Las REUTILIZAMOS sin cambios |
| **PDF no coincide con preview** | ✅ Los nuevos PDFs se generan igual que antes |
| **Bundle bloat** | ✅ Solo 4 nuevos archivos pequeños (~20KB total) |

---

## 5️⃣ FLUJO USUARIO FINAL

```
1. Usuario crea CV
2. Completa cv-form.tsx:
   - Título
   - Tipo oportunidad (INTERNSHIP, SCHOLARSHIP, etc)
   - Perfil (Technology, Design, etc)
   - **[NUEVO] Diseño: "Harvard", "Europass", "STEM", "Global"** ← Aparece solo si INTERNSHIP/SCHOLARSHIP
3. Entra al builder (create-cv-page.tsx)
4. Preview muestra el template seleccionado
5. User edita secciones (sin cambios en la UI de edición)
6. Genera PDF y descarga en el template elegido
7. CV guardado con templateId en BD
```

---

## 6️⃣ EJEMPLOS DE CÓDIGO (Pseudo-código)

### 6.1 cv-form.tsx (cambio mínimo)
```tsx
// En el form, DESPUÉS de opportunityType select:

{(opportunityType === 'INTERNSHIP' || opportunityType === 'SCHOLARSHIP') && (
  <FormField
    control={form.control}
    name="templateId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Diseño de CV</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="harvard">Harvard (Clásico)</SelectItem>
            <SelectItem value="europass">Europass Modern</SelectItem>
            <SelectItem value="stem">Investigador STEM</SelectItem>
            <SelectItem value="fullbright">Líder Global</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Elige el diseño que mejor se adapte a tu oportunidad
        </FormDescription>
      </FormItem>
    )}
  />
)}
```

### 6.2 create-cv-page.tsx (cambio mínimo)
```tsx
// En el return:

<div className="flex gap-4">
  <CVSectionForm sections={sections} /* ... */ />
  
  {showPreview && (
    <div className="w-1/2">
      {cvData.templateId === "europass" ? (
        <CVPreviewEuropass data={cvData} sections={sections} />
      ) : cvData.templateId === "stem" ? (
        <CVPreviewStem data={cvData} sections={sections} />
      ) : cvData.templateId === "fullbright" ? (
        <CVPreviewFullbright data={cvData} sections={sections} />
      ) : (
        <CVPreview data={cvData} sections={sections} />
      )}
    </div>
  )}
</div>
```

### 6.3 cv-preview-europass.tsx (copia + estilos nuevos)
```tsx
"use client"

import { CVData, CVSection } from "@/types/cv"

interface Props {
  data: CVData
  sections: CVSection[]
}

export function CVPreviewEuropass({ data, sections }: Props) {
  // NUEVOS estilos (para Europass)
  const sectionTitleClasses = "text-[13px] font-bold text-blue-600 mb-1.5 border-b-2 border-blue-300"
  const sectionDividerClasses = "border-b border-blue-200 mb-2"
  const itemTitleClasses = "text-[11px] font-bold text-blue-900"
  const bodyTextClasses = "text-[11px] text-gray-800 leading-[1.4]"

  // [Copiar toda la lógica de renderizado de cv-preview.tsx original]
  // pero usar nuevos estilos
  
  return (
    <div className="p-8 bg-white text-[12px]">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-[18px] font-bold">{data.personalInfo?.fullName}</h1>
        <p className="text-[10px] text-gray-600">{data.personalInfo?.email} | {data.personalInfo?.phone}</p>
      </div>
      
      {/* Sections con nuevos estilos */}
      {/* ... render sections ... */}
    </div>
  )
}
```

---

## 7️⃣ ORDEN DE EJECUCIÓN

```
Lunes (3 horas):
├── FASE 1: DB migration (30 min)
├── FASE 2: Selector en cv-form.tsx (45 min)
└── FASE 3: Nuevos preview components (1.5h)

Martes (3-4 horas):
├── FASE 3 (continuación): Terminar previews (2h)
└── FASE 4: New PDF renderers (1.5-2h)

Miércoles (1 hora):
└── FASE 5: Testing + QA
```

---

## 8️⃣ CONFIRMACIÓN FINAL

**¿Entendido así?**
- ✅ NO tocar cv-preview.tsx (mantener Harvard igual)
- ✅ NO tocar cv-document.tsx (mantener Harvard igual)
- ✅ Crear NUEVOS componentes para cada template (europass, stem, fullbright)
- ✅ Usar condicionales simples para mostrar el preview correcto
- ✅ Reutilizar server actions existentes
- ✅ Mínimo riesgo, máxima seguridad

**¿Empezamos con FASE 1 (Database)?**
