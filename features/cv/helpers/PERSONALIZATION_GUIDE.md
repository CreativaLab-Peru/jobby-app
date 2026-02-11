# Personalización de CVs

El sistema de CVs soporta **personalización completa** de campos según:
- **Tipo de CV** (`CvType`): TECHNOLOGY_ENGINEERING, DESIGN_CREATIVITY, MARKETING_STRATEGY, FINANCE_PROJECTS, MANAGEMENT_BUSINESS, SOCIAL_MEDIA, EDUCATION, SCIENCE
- **Tipo de Oportunidad** (`OpportunityType`): SCHOLARSHIP, INTERNSHIP, EMPLOYMENT, FREELANCE, EXCHANGE_PROGRAM, GRADUATE_PROGRAM, FULL_TIME, PART_TIME

---

## Características Personalizables

### 1. **Secciones del CV** (`sections`)
Define qué secciones mostrar y en qué orden.

**Ejemplo:**
```typescript
sections: ["personal", "education", "projects", "skills"]
```

### 2. **Ejemplos** (`examples`)
Personaliza los ejemplos que aparecen en cada campo del formulario.

**Ejemplo:**
```typescript
examples: {
  "personal.summary": "Estudiante de...",
  "education.institution": "Universidad Nacional..."
}
```

### 3. **Tips** (`tips`) *(Opcional)*
Personaliza los consejos/ayudas que aparecen en cada campo.

**Ejemplo:**
```typescript
tips: {
  "personal.summary": "Enfócate en tus logros académicos y objetivos",
  "education.year": "Usa 'Esperado [Mes Año]' si aún estás estudiando"
}
```

### 4. **Campos Requeridos** (`requiredFields`) ⭐ **NUEVO**
Personaliza qué campos son obligatorios según el contexto.

**Ejemplo:**
```typescript
requiredFields: {
  "education.level": false,        // Campo opcional
  "education.institution": false,  // Campo opcional
  "projects.title": true,          // Campo obligatorio
}
```

---

## 📝 Ejemplo de Implementación: Becas (SCHOLARSHIP)

### ✅ **IMPLEMENTADO y FUNCIONANDO**

Para **TODOS los tipos de CV** con **OpportunityType: SCHOLARSHIP**, la educación es completamente **OPCIONAL**.

#### Archivos Configurados (8 tipos de CV):

1. ✅ `configs/technology-engineering/scholarship.ts`
2. ✅ `configs/design-creativity/scholarship.ts`
3. ✅ `configs/marketing-strategy/scholarship.ts`
4. ✅ `configs/finance-projects/scholarship.ts`
5. ✅ `configs/management-business/scholarship.ts`
6. ✅ `configs/social-media/scholarship.ts`
7. ✅ `configs/education/scholarship.ts`
8. ✅ `configs/science/scholarship.ts`
9. ✅ `configs/default.ts` (fallback)

#### Código Implementado:

```typescript
// Ejemplo: technology-engineering/scholarship.ts
export const technologyEngineeringScholarship: SectionConfig = {
  sections: ["personal", "education", "projects", "achievements", "skills"],
  
  // ✅ Educación opcional para becas
  requiredFields: {
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },
  
  examples: {
    "personal.summary": "Estudiante de Ingeniería de Sistemas buscando beca...",
    "education.year": "Esperado Diciembre 2026",
    "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
    // ... más ejemplos
  }
};
```

#### Comportamiento:

- ✅ Puedes **dejar la sección de Educación vacía** (sin agregar items)
- ✅ Puedes **agregar educación parcial** (solo algunos campos)
- ✅ El botón **"Siguiente" NO se bloqueará**
- ✅ **NO aparecerán errores de validación**

---

## 🔧 Cómo Agregar Nuevas Personalizaciones

### Paso 1: Identificar el archivo de configuración

Según el **Tipo de CV** y **Tipo de Oportunidad**:

```
features/cv/helpers/configs/
├── technology-engineering/
│   ├── scholarship.ts      ← Para SCHOLARSHIP
│   ├── internship.ts       ← Para INTERNSHIP
│   ├── employment.ts       ← Para EMPLOYMENT
│   └── index.ts            ← Exporta las configuraciones
├── design-creativity/
│   ├── scholarship.ts
│   ├── internship.ts
│   └── ...
├── marketing-strategy/
├── finance-projects/
├── management-business/
├── social-media/
├── education/
├── science/
└── default.ts              ← Fallback para tipos no específicos
```

### Paso 2: Editar el archivo específico

**Ejemplo: Hacer experiencia opcional para INTERNSHIP en TECHNOLOGY_ENGINEERING**

```typescript
// En: technology-engineering/internship.ts

export const technologyEngineeringInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "experience", "skills"],
  
  // ✅ Agregar requiredFields
  requiredFields: {
    "experience.company": false,          // Opcional para pasantías
    "experience.position": false,         // Opcional
    "experience.responsibilities": false, // Opcional
    "projects.title": true,               // Proyectos SÍ requeridos
  },
  
  examples: {
    "personal.summary": "Estudiante buscando pasantía en desarrollo de software...",
    // ... más ejemplos
  }
};
```

### Paso 3: Verificar exportación

Asegúrate de que el archivo esté exportado en `index.ts`:

```typescript
// En: technology-engineering/index.ts

import { technologyEngineeringInternship } from "./internship";
import { technologyEngineeringScholarship } from "./scholarship";
import { technologyEngineeringEmployment } from "./employment";
import { OpportunityType } from "@prisma/client";
import type { SectionConfig } from "../types";

export const getTechnologyEngineeringConfig = (
  opportunityType: OpportunityType
): SectionConfig => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return technologyEngineeringInternship;
    case OpportunityType.SCHOLARSHIP:
      return technologyEngineeringScholarship;
    case OpportunityType.EMPLOYMENT:
      return technologyEngineeringEmployment;
    default:
      return technologyEngineeringEmployment; // Fallback
  }
};
```

### Paso 4: Probar

1. Crear un CV con:
   - CvType: **TECHNOLOGY_ENGINEERING**
   - OpportunityType: **INTERNSHIP**
2. Verificar que los campos configurados se comporten correctamente
3. Los campos con `required: false` NO deben bloquear el avance

---

## Referencia de Campos Disponibles

### Personal
- `personal.fullName` (siempre requerido)
- `personal.address`
- `personal.linkedin`
- `personal.phone` (siempre requerido)
- `personal.email` (siempre requerido)
- `personal.summary` (siempre requerido)

### Educación
- `education.level`
- `education.title`
- `education.institution`
- `education.location`
- `education.year`
- `education.honors` (siempre opcional)

### Experiencia
- `experience.company`
- `experience.location`
- `experience.position`
- `experience.duration`
- `experience.responsibilities`

### Proyectos
- `projects.title`
- `projects.description`
- `projects.technologies`
- `projects.duration`

### Habilidades
- `skills.technical`
- `skills.soft`
- `skills.languages` (siempre requerido)

### Logros
- `achievements.title`
- `achievements.description`
- `achievements.date`

### Certificaciones
- `certifications.name`
- `certifications.issuer`
- `certifications.date`

### Voluntariado
- `volunteering.organization`
- `volunteering.location`
- `volunteering.position`
- `volunteering.duration`
- `volunteering.responsibilities`

---

## Casos de Uso Comunes

### 1. **Becas Académicas (SCHOLARSHIP)** IMPLEMENTADO

**Contexto**: Estudiantes que están en proceso de estudiar necesitan solicitar becas sin tener aún su título completo.

**Configuración:**
```typescript
requiredFields: {
  "education.level": false,
  "education.title": false,
  "education.institution": false,
  "education.location": false,
  "education.year": false,
}
```

**Resultado**: Educación completamente opcional.

---

### 2. **Programas de Intercambio (EXCHANGE_PROGRAM)**

**Contexto**: Estudiantes universitarios que buscan programas de intercambio académico priorizan logros académicos sobre experiencia laboral.

**Configuración sugerida:**
```typescript
requiredFields: {
  "experience.company": false,        // Experiencia laboral opcional
  "experience.position": false,
  "projects.title": true,             // Proyectos académicos requeridos
  "achievements.title": true,         // Logros académicos requeridos
}

sections: ["personal", "education", "projects", "achievements", "skills"]
```

---

### 3. **Primer Empleo / Recién Graduados (EMPLOYMENT + Junior)**

**Contexto**: Candidatos sin experiencia laboral formal que buscan su primer trabajo.

**Configuración sugerida:**
```typescript
requiredFields: {
  "experience.company": false,        // Sin experiencia profesional aún
  "experience.position": false,
  "projects.title": true,             // Proyectos universitarios importantes
  "skills.technical": true,           // Habilidades técnicas requeridas
}

sections: ["personal", "education", "projects", "skills", "certifications"]
```

---

### 4. **Freelance / Contractor**

**Contexto**: Profesionales independientes donde el portfolio de proyectos es más importante que la educación formal.

**Configuración sugerida:**
```typescript
requiredFields: {
  "education.institution": false,     // Educación formal opcional
  "education.title": false,
  "projects.title": true,             // Portfolio de proyectos REQUERIDO
  "certifications.name": true,        // Certificaciones profesionales importantes
  "skills.technical": true,           // Skills técnicas relevantes
}

sections: ["personal", "projects", "certifications", "skills", "experience"]
```

---

### 5. **Investigación / Research Fellowship**

**Contexto**: Académicos y científicos que aplican a posiciones de investigación.

**Configuración sugerida:**
```typescript
requiredFields: {
  "projects.title": true,             // Proyectos de investigación requeridos
  "achievements.title": true,         // Publicaciones y reconocimientos
  "education.institution": true,      // Educación formal SÍ importante
}

sections: ["personal", "education", "projects", "achievements", "certifications"]
```

---

### 6. **Pasantías (INTERNSHIP)**

**Contexto**: Estudiantes que buscan pasantías durante o después de sus estudios.

**Configuración sugerida:**
```typescript
requiredFields: {
  "experience.company": false,        // Experiencia laboral opcional
  "projects.title": true,             // Proyectos académicos requeridos
  "education.institution": true,      // Educación SÍ requerida
}

sections: ["personal", "education", "projects", "skills"]
```

---

## 🚀 Implementación Técnica

### Arquitectura del Sistema

```
Usuario selecciona CvType + OpportunityType
       ↓
getSections(opportunityType, cvType)
       ├─ Llama getConfig(cvType, opportunityType)
       └─ Obtiene SectionConfig específica
       ↓
applyCustomization(baseSection, config)
       ├─ Lee base-sections.ts (defaults)
       ├─ Aplica examples personalizados
       ├─ Aplica tips personalizados
       └─ Aplica requiredFields personalizados 
       ↓
CVSectionForm recibe sección personalizada
       └─ Campos tienen required: true/false según config
       ↓
Usuario llena formulario
       └─ validate() verifica solo campos con required: true
       ↓
Submit guarda en DB
```

### Archivos Clave

1. **`base-sections.ts`**: Secciones base con defaults
2. **`types.ts`**: Interfaces `SectionConfig`, `FieldRequiredConfig`
3. **`index.ts`**: `getSections()` y `applyCustomization()`
4. **`configs/[cvType]/`**: Configuraciones específicas por tipo
5. **`cv-section-form.tsx`**: Validación de formularios

### Flujo de Personalización

```typescript
// 1. Usuario crea CV: SCHOLARSHIP + TECHNOLOGY_ENGINEERING
const sections = getSections(
  OpportunityType.SCHOLARSHIP, 
  CvType.TECHNOLOGY_ENGINEERING
);

// 2. getConfig() retorna configuración específica
const config = getTechnologyEngineeringConfig(OpportunityType.SCHOLARSHIP);
// → technologyEngineeringScholarship con requiredFields

// 3. applyCustomization() modifica required
const educationSection = applyCustomization(baseEducationSection, config);
// education.institution.required: true → false 

// 4. Formulario valida según required personalizado
if (educationSection.fields.every(f => !f.required)) {
  return true; // Permite avanzar sin items 
}
```

---

## Archivos para revisar:
- `features/cv/helpers/types.ts` - Definiciones de tipos
- `features/cv/helpers/index.ts` - Lógica de aplicación
- `features/cv/components/cv-section-form.tsx` - Validación

**Para debugging, agregar logs temporales:**
```typescript
// En applyCustomization():
console.log(`${fieldPath}:`, { originalRequired, customRequired, finalRequired });

// En validateAll():
console.log("Section:", section.id, "Fields:", section.fields.map(f => f.required));
```
````

---
