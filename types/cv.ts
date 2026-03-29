export interface CVField {
  name: string
  label: string
  type: "text" | "email" | "number" | "textarea" | "select" | "tags" | "url" | "photo"
  required: boolean
  tip?: string
  example?: string
  options?: string[]
  pattern?: string
  patternError?: string
}

export interface CVSection {
  id: string
  title: string
  icon
  fields: CVField[]
  multiple?: boolean
}

export interface CVData {
  personal?: {
    fullName?: string
    address?: string
    linkedin?: string
    phone?: string
    email?: string
    summary?: string
    nationality?: string  // Campo Europass
    image?: string        // URL de foto (Europass)
  }
  education?: {
    items?: Array<{
      id: string
      level?: string
      title?: string
      institution?: string
      location?: string
      year?: string
      honors?: string
    }>
  }
  experience?: {
    items?: Array<{
      id: string
      position?: string
      company?: string
      location?: string
      duration?: string
      responsibilities?: string
    }>
  }
  projects?: {
    items?: Array<{
      id: string
      title?: string
      description?: string
      technologies?: string
      duration?: string
    }>
  }
  achievements?: {
    items?: Array<{
      id: string
      title?: string
      description?: string
      date?: string
    }>
  }
  certifications?: {
    items?: Array<{
      id: string
      name?: string
      issuer?: string
      date?: string
    }>
  }
  volunteering?: {
    items?: Array<{
      id: string
      organization?: string
      location?: string
      position?: string
      duration?: string
      responsibilities?: string
    }>
  }
  skills?: {
    technical?: string[]
    soft?: string[]
    languages?: string[]
  },
  complements?: {
    items?: Array<{
      id?: string
      title?: string       // Ej: "Disponibilidad", "Licencia de conducir"
      description?: string // Ej: "Inmediata para reubicación", "Categoría A-I"
    }>
  },
  interests?: {
    items?: Array<{
      id?: string
      title?: string       // Ej: "Disponibilidad", "Licencia de conducir"
      description?: string // Ej: "Inmediata para reubicación", "Categoría A-I"
    }>
  }
}
