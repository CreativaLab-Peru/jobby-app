# CV Sections - Sistema Modular

Sistema modular y escalable para gestionar las secciones del CV según `CvType` y `OpportunityType`.

## structura

```
lib/cv-sections/
├── index.ts                    # Punto de entrada principal
├── types.ts                    # Interfaces TypeScript
├── base-sections.ts            # Secciones base reutilizables
├── configs/
│   ├── default.ts              # Configuración fallback
│   └── technology-engineering/
│       ├── index.ts            # Orquestador de configs
│       ├── internship.ts       # Config para INTERNSHIP
│       ├── scholarship.ts      # Config para SCHOLARSHIP
│       ├── exchange-program.ts # Config para EXCHANGE_PROGRAM
│       ├── full-time.ts        # Config para FULL_TIME
│       ├── part-time.ts        # Config para PART_TIME
│       └── freelance.ts        # Config para FREELANCE
```

## Uso

```typescript
import { getSections } from "@/lib/cv-sections"
import { CvType, OpportunityType } from "@prisma/client"

// Obtener secciones personalizadas
const sections = getSections(
  OpportunityType.INTERNSHIP,
  CvType.TECHNOLOGY_ENGINEERING
)
```

## Características

### 1. **Ejemplos Dinámicos**
Cada combinación de `CvType` + `OpportunityType` tiene ejemplos contextualizados:

```typescript
// TECHNOLOGY_ENGINEERING + INTERNSHIP
"personal.summary": "Estudiante de 5to ciclo de Ingeniería de Sistemas..."

// TECHNOLOGY_ENGINEERING + FULL_TIME
"personal.summary": "Ingeniero de Sistemas con 3+ años de experiencia..."
```

### 2. **Secciones Condicionales**
Diferentes tipos muestran diferentes secciones:

```typescript
// INTERNSHIP/SCHOLARSHIP/EXCHANGE_PROGRAM
sections: ["personal", "projects", "experience", "education", "achievements", "skills"]

// FULL_TIME/PART_TIME/FREELANCE
sections: ["personal", "experience", "education", "certifications", "skills"]
```

### 3. **Retrocompatibilidad**
El archivo `lib/cv-sections.ts` sigue funcionando:

```typescript
// Todavía funciona (con CvType por defecto)
import { getSections } from "@/lib/cv-sections"
const sections = getSections(OpportunityType.INTERNSHIP)
```

## Cómo Agregar Nuevos CvTypes

### Paso 1: Crear carpeta de configuración

```bash
lib/cv-sections/configs/design-creativity/
```

### Paso 2: Crear archivos por OpportunityType

```typescript
// design-creativity/internship.ts
import type { SectionConfig } from "../../types"

export const designCreativityInternship: SectionConfig = {
  sections: ["personal", "projects", "experience", "education", "achievements", "skills"],
  examples: {
    "personal.summary": "Estudiante de Diseño Gráfico con portfolio...",
    "projects.title": "Campaña de Branding para Startup Tech",
    "skills.technical": "Adobe Creative Suite, Figma, Sketch, InVision",
    // ... más ejemplos
  }
}
```

### Paso 3: Crear índice del CvType

```typescript
// design-creativity/index.ts
import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { designCreativityInternship } from "./internship"
// ... importar otros

export const getDesignCreativityConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return designCreativityInternship
    // ... otros casos
    default:
      return designCreativityInternship
  }
}
```

### Paso 4: Registrar en el sistema principal

```typescript
// lib/cv-sections/index.ts
import { getDesignCreativityConfig } from "./configs/design-creativity"

function getConfig(cvType: CvType, opportunityType: OpportunityType): SectionConfig {
  switch (cvType) {
    case CvType.TECHNOLOGY_ENGINEERING:
      return getTechnologyEngineeringConfig(opportunityType)
    
    case CvType.DESIGN_CREATIVITY:
      return getDesignCreativityConfig(opportunityType) // ✅ Agregado
    
    // ... resto
  }
}
```

## Estado Actual

### Implementado
- **TECHNOLOGY_ENGINEERING**: Todos los OpportunityTypes
  - INTERNSHIP
  - SCHOLARSHIP
  - EXCHANGE_PROGRAM
  - FULL_TIME
  - PART_TIME
  - FREELANCE

### 🔄 Pendiente (usan config por defecto)
- DESIGN_CREATIVITY
- MARKETING_STRATEGY
- MANAGEMENT_BUSINESS
- FINANCE_PROJECTS
- SOCIAL_MEDIA
- EDUCATION
- SCIENCE

## 🔧 Arquitectura

### Flujo de Datos

```
Usuario selecciona CvType + OpportunityType
         ↓
getSections(opportunityType, cvType)
         ↓
getConfig() → Obtiene configuración específica
         ↓
Itera sobre config.sections
         ↓
Para cada sección:
  1. Obtiene base de baseSectionsMap
  2. Aplica ejemplos personalizados
  3. Aplica tips personalizados (opcional)
         ↓
Retorna CVSection[] personalizado
```

### Ventajas de la Arquitectura

1. **Escalable**: Agregar nuevo CvType = crear carpeta + archivos
2. **Mantenible**: Cada configuración en su archivo
3. **Type-safe**: TypeScript garantiza consistencia
4. **DRY**: Secciones base reutilizables
5. **Flexible**: Fácil sobrescribir ejemplos y tips
6. **Sin Breaking Changes**: Mantiene API existente

## 📚 Tipos Importantes

```typescript
interface SectionConfig {
  sections: string[]              // Orden de secciones
  examples: FieldExampleConfig    // Ejemplos por campo
  tips?: FieldTipConfig           // Tips opcionales
}

interface FieldExampleConfig {
  [fieldPath: string]: string     // e.g., "personal.summary": "..."
}

type ConfigGetter = (opportunityType: OpportunityType) => SectionConfig
```

## 🧪 Testing

Para probar una nueva configuración:

1. Crear CV con `TECHNOLOGY_ENGINEERING` + `INTERNSHIP`
2. Verificar que los ejemplos sean específicos para ese contexto
3. Comparar con `TECHNOLOGY_ENGINEERING` + `FULL_TIME`
4. Confirmar que las secciones y ejemplos cambien

## 📞 Contacto

Para dudas sobre la implementación, revisar:
- `lib/cv-sections/index.ts` - Lógica principal
- `lib/cv-sections/configs/technology-engineering/` - Ejemplo completo
- `features/cv/components/create-cv-page.tsx` - Uso en componentes
