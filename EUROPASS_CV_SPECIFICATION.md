# 📐 Especificación Visual: Europass CV

## 1️⃣ DISEÑO GENERAL

**Estructura:** Dos columnas - Sidebar + Contenido principal
**Propósito:** Europeo, estructurado, "scaneable", profesional académico
**Público objetivo:** Estudiantes/becarios aplicando a movilidades Erasmus+, Fulbright, becas europeas

```
┌─────────────────────────────────────────┐
│ [Sidebar Azul]  │  [Contenido Principal] │
│   30% width     │      70% width         │
└─────────────────────────────────────────┘
```

---

## 2️⃣ SIDEBAR (COLUMNA IZQUIERDA)

### Dimensiones
- **Color de fondo:** Azul oscuro: `#0B5394`
- **Ancho:** ~30% del CV
- **Padding:** 24px (todo alrededor)

### Secciones del Sidebar

#### 2.1 Header
```
┌────────────────────┐
│   EUROPASS         │  ← Bold white, text-center
│ ─────────────────  │  ← White divider line (1px)
│                    │
│  12345678990       │  ← Teléfono, white, smaller font
│  examples-euvc@    │  ← Email, white, smaller font
│  kudoswall.com     │
│  LinkedIn          │  ← LinkedIn link, white/underline
│                    │
│ ─────────────────  │  ← White divider line
└────────────────────┘
```

**Colores & Tipografía:**
- "EUROPASS" → `color: white`, `font-size: 24px`, `font-weight: bold`
- Teléfono/Email/LinkedIn → `color: white`, `font-size: 11px`, `line-height: 1.6`
- Divisores → `border-bottom: 1px solid white`

#### 2.2 Skills Section
```
┌────────────────────┐
│ SKILLS AND         │  ← White, bold, text-transform: uppercase
│ COMPETENCIES       │     font-size: 13px, margin-top: 16px
│                    │
│ Digital Marketing  │  ← Bold, white, font-size: 12px
│  • SEO (Advanced)  │  ← Bullet level 1, white, 11px
│  • SEM (Intermed.) │
│  • PPC (Advanced)  │
│  • Social (Adv.)   │
│  • Email (Intermd.)│
│                    │
│ Analytics          │  ← Bold, white
│  • Google Analytics│
│    (Expert)        │
│  • Market Research │
│    (Advanced)      │
│                    │
│ IT Skills          │
│  • MS Office       │
│    (Expert)        │
│  • Adobe Creative  │
│    Suite (Adv.)    │
│  • CRM Software    │
│    (Intermediate)  │
└────────────────────┘
```

**Tipografía:**
- Categoría (Digital Marketing, Analytics, etc) → `font-weight: bold`, `color: white`, `font-size: 12px`
- Skill items → `color: white`, `font-size: 11px`, bullet point, `margin-left: 12px`

#### 2.3 Languages Section (IMPORTANTE)
```
┌────────────────────┐
│ LANGUAGE SKILLS    │  ← White, bold, uppercase, 13px
│                    │
│ English            │  ← Bold, white, 12px
│  C2 (Proficient    │  ← Formato especial: Nivel + descripción
│      user -        │     Nivel: `font-weight: bold`
│      Mastery)      │     Descripción: regular, più piccolo
│                    │
│ Spanish            │  ← Bold, white
│  C1 (Proficient    │
│      user -        │
│      Advanced)     │
│                    │
│ French             │
│  B2 (Independent   │
│      user -        │
│      Upper Inter.) │
└────────────────────┘
```

**Tipografía especial para idiomas:**
- Idioma → `font-weight: bold`, `color: white`, `font-size: 12px`
- Nivel (C2, C1, B2, etc) → `font-weight: bold`, `color: white`, `font-size: 11px`
- Marco CEFR (Proficient user - Mastery) → `color: white`, `font-size: 10px`, italic

**Los 6 niveles CEFR:**
- **A1** → Elementary user (Básico)
- **A2** → Elementary user (Elementario)
- **B1** → Independent user (Intermedio)
- **B2** → Independent user (Intermedio-alto)
- **C1** → Proficient user (Avanzado)
- **C2** → Proficient user (Dominio)

---

## 3️⃣ CONTENIDO PRINCIPAL (COLUMNA DERECHA)

### Dimensiones
- **Color de fondo:** Blanco `#FFFFFF`
- **Ancho:** ~70% del CV
- **Padding:** 24px (todo alrededor)
- **Interlineado:** 1.35

### 3.1 Header Section (Top of main area)
```
┌─────────────────────────┐
│ PROFESSIONAL SUMMARY    │  ← Bold, uppercase, black, 13px
│ ─────────────────────── │  ← Black divider line (1px)
│                         │
│ A dynamic and results-  │  ← Justified text, 11px, black
│ oriented professional   │
│ with over five years    │
│ of experience...        │
│                         │
└─────────────────────────┘
```

**Tipografía:**
- Título → `font-weight: bold`, `text-transform: uppercase`, `font-size: 13px`, `color: black`
- Divisor → `border-bottom: 1px solid black`, `margin: 8px 0`
- Texto → `font-size: 11px`, `text-align: justify`, `line-height: 1.35`, `color: #333`

### 3.2 Work Experience Section
```
┌─────────────────────────┐
│ WORK EXPERIENCE         │  ← Same title style
│ ─────────────────────── │
│                         │
│ Digital Marketing Mgr   │  ← Bold, 12px, black
│ at ABC Corporation,     │     Formato: Role @ Company, Location
│ Town, Country           │     Jan 2018 - Current (alineado derecho)
│ Jan 2018 - Current      │
│                         │
│ • Led a team of 8...    │  ← Bullet point, 11px, justified
│ • Managed a budget...   │
│                         │
│ Marketing Coordinator   │
│ at XYZ Enterprises      │
│ Jun 2015 - Dec 2017     │
│                         │
│ • Coordinated marketing │
│ • Conducted market...   │
└─────────────────────────┘
```

**Tipografía:**
- Posición/Empresa → `font-weight: bold`, `font-size: 12px`, `color: black`
- Fechas → `font-size: 10px`, `color: #666`, texto en lado derecho (flexbox/justified)
- Logros (bullets) → `font-size: 11px`, `color: #333`, `line-height: 1.35`, bullet point

### 3.3 Education Section
```
┌─────────────────────────┐
│ EDUCATION               │  ← Bold, uppercase
│ ─────────────────────── │
│                         │
│ MSc in Digital Mktg     │  ← Bold, 12px
│ from Business Univ.     │
│ Sep 2012 - May 2015     │  ← 10px, regular
│                         │
│ BBA from College of     │
│ Commerce                │
│ Sep 2008 - Jun 2012     │
└─────────────────────────┘
```

**Tipografía:**
- Grado/Institución → `font-weight: bold`, `font-size: 12px`
- Fechas → `font-size: 10px`, regular

### 3.4 Certifications Section
```
┌─────────────────────────┐
│ CERTIFICATIONS          │
│ ─────────────────────── │
│                         │
│ Google Analytics        │  ← Bold, 12px
│ Certified              │
│                         │
│ Advanced Social Media   │
│ Marketing Certification │
└─────────────────────────┘
```

### 3.5 Interests Section
```
┌─────────────────────────┐
│ INTERESTS               │
│ ─────────────────────── │
│                         │
│ Writing a digital       │  ← Regular, 11px, bullet OR simple text
│ marketing blog          │
│                         │
│ Teaching digital        │
│ literacy at local       │
│ community centers       │
└─────────────────────────┘
```

### 3.6 References Section
```
┌─────────────────────────┐
│ REFERENCES              │
│ ─────────────────────── │
│                         │
│ Available upon request  │  ← Regular, 11px
└─────────────────────────┘
```

---

## 4️⃣ PALETA DE COLORES

| Elemento | Color | HEX | RGB |
|----------|-------|-----|-----|
| Sidebar BG | Azul oscuro | `#0B5394` | 11, 83, 148 |
| Sidebar Text | Blanco | `#FFFFFF` | 255, 255, 255 |
| Main BG | Blanco | `#FFFFFF` | 255, 255, 255 |
| Main Text | Negro | `#111111` | 17, 17, 17 |
| Secundario Text | Gris | `#666666` | 102, 102, 102 |
| Divisores Sidebar | Blanco | `#FFFFFF` | 255, 255, 255 |
| Divisores Main | Negro | `#000000` | 0, 0, 0 |

---

## 5️⃣ TIPOGRAFÍA

- **Font Family:** Arial (fallback: sans-serif)
- **Tamaño base (body):** 11px
- **Título sección:** 13px, bold, uppercase
- **Posición/Rol:** 12px, bold
- **Fecha/Ubicación:** 10px, regular
- **Descriptor:** 10px, italic (para CEFR)

---

## 6️⃣ ESPACIADO & LAYOUT

```
Sidebar:
  - Padding: 24px
  - Margin between sections: 16px
  - Line height: 1.4

Main Content:
  - Padding: 24px
  - Margin bottom per section: 12px
  - Line height: 1.35
  - Margins between bullets: 2-4px

Overall:
  - Page size: A4 (210mm x 297mm)
  - Sidebar width: 30%
  - Content width: 70%
```

---

## 7️⃣ ELEMENTOS CLAVE A REPLICAR

✅ **Sidebar azul oscuro con blanco**
✅ **Sección de idiomas ESTRUCTURADA con niveles CEFR**
✅ **Dos columnas claras**
✅ **Divisores limpios (negro/blanco según donde)**
✅ **Tipografía clara y escaneable**
✅ **Bullets para logros/skills**
✅ **Justificado para textos largos**

---

## 8️⃣ DIFERENCIAS CON HARVARD

| Aspecto | Harvard | Europass |
|---------|---------|----------|
| **Layout** | Una columna | Dos columnas (sidebar + main) |
| **Color** | Blanco/Negro | Azul + Blanco + Negro |
| **Encabezado** | Centrado, minimalista | Sidebar izq con datos estructurados |
| **Idiomas** | Texto plano | Niveles CEFR mostrados |
| **Estilos** | Muy sobrio | Más estructura visual |
| **Scaneable** | Difícil | Muy fácil (sidebar sirve de guía) |

---

## 9️⃣ PRÓXIMOS PASOS

1. Crear `cv-preview-europass.tsx` usando esta especificación exacta
2. Crear `cv-document-europass.tsx` con @react-pdf/renderer replicando colores/layout
3. Integrar selector en `cv-form.tsx`
4. Testing visual completo
