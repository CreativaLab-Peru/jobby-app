"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CvType, OpportunityType } from "@prisma/client"
import { cvTypes } from "@/const"

const OPPORTUNITY_DESCRIPTIONS: Record<string, string> = {
  [OpportunityType.INTERNSHIP]: "Oportunidades de prácticas profesionales.",
  [OpportunityType.SCHOLARSHIP]: "Oportunidades de becas académicas.",
  [OpportunityType.EXCHANGE_PROGRAM]: "Oportunidades de programas de intercambio.",
  [OpportunityType.EMPLOYMENT]: "Oportunidades de empleo y trabajo.",
  default: "Selecciona un tipo de oportunidad para ver su descripción."
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  harvard: "Diseño clásico y profesional, reconocido internacionalmente.",
  europass: "Diseño europeo estructurado, ideal para becas de movilidad y Erasmus+.",
  default: "Elige un diseño que se adapte a tu perfil y oportunidad."
};

const CV_TYPE_DESCRIPTIONS: Record<string, string> = {
  [CvType.TECHNOLOGY_ENGINEERING]: "Ideal para perfiles en sistemas, software, innovación o data.",
  [CvType.DESIGN_CREATIVITY]: "Para creativos visuales, diseñadores gráficos, UX/UI o artistas digitales.",
  [CvType.MARKETING_STRATEGY]: "Para marketers, comunicadores o estrategas de contenido.",
  [CvType.MANAGEMENT_BUSINESS]: "Para administración, emprendimiento o desarrollo comercial.",
  [CvType.FINANCE_PROJECTS]: "Para gestión financiera, análisis económico o PMO.",
  [CvType.SOCIAL_MEDIA]: "Para community managers, creadores de contenido o influencers.",
  [CvType.EDUCATION]: "Para docentes, formadores, capacitadores o coaches.",
  [CvType.SCIENCE]: "Para perfiles STEM, sostenibilidad, impacto o proyectos de investigación.",
  default: "Selecciona un perfil profesional para ver su descripción."
};

export const opportunityTypes = [
  { key: OpportunityType.INTERNSHIP, value: "Pasantía" },
  { key: OpportunityType.SCHOLARSHIP, value: "Beca" },
  { key: OpportunityType.EXCHANGE_PROGRAM, value: "Intercambio" },
  { key: OpportunityType.EMPLOYMENT, value: "Empleo" },
  { key: OpportunityType.STARTUP, value: "Aceleradora" },
]

// --- INTERFACES ---

interface CVFormData {
  title: string
  cvType: CvType
  opportunityType: OpportunityType
  templateId?: string
}

interface CVFormProps {
  formData: CVFormData
  onFormDataChange: (data: CVFormData) => void
}

// --- COMPONENTES ATÓMICOS ---

const HelperText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground transition-all duration-200">
    {children}
  </p>
);

// --- COMPONENTE PRINCIPAL ---

export function CVForm({ formData, onFormDataChange }: CVFormProps) {

  const updateField = <K extends keyof CVFormData>(field: K, value: CVFormData[K]) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const sharedStyles = {
    trigger: "w-full border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-colors",
    item: "focus:bg-primary focus:text-primary-foreground cursor-pointer",
    label: "text-sm font-semibold text-secondary-foreground/80"
  };

  return (
    <div className="space-y-6 py-4">

      {/* 1. Título */}
      <div className="space-y-2">
        <Label htmlFor="title" className={sharedStyles.label}>Título del documento</Label>
        <Input
          id="title"
          placeholder="Ejemplo: CV Ingeniero de Software"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="focus-visible:ring-primary border-secondary/20"
        />
        <HelperText>El título ayudará a identificar este currículum en tu lista.</HelperText>
      </div>

      {/* 2. Tipo de Oportunidad */}
      <div className="space-y-2">
        <Label className={sharedStyles.label}>Tipo de Oportunidad</Label>
        <Select
          value={formData.opportunityType}
          onValueChange={(v) => updateField("opportunityType", v as OpportunityType)}
        >
          <SelectTrigger className={sharedStyles.trigger}>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            {opportunityTypes.map((t) => (
              <SelectItem key={t.key} value={t.key} className={sharedStyles.item}>{t.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <HelperText>
          {OPPORTUNITY_DESCRIPTIONS[formData.opportunityType] || OPPORTUNITY_DESCRIPTIONS.default}
        </HelperText>
      </div>

      {/* 3. Diseño del CV (Condicional) */}
      {["INTERNSHIP", "SCHOLARSHIP"].includes(formData.opportunityType) && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <Label className={sharedStyles.label}>Diseño del CV</Label>
          <Select
            value={formData.templateId || "harvard"}
            onValueChange={(v) => updateField("templateId", v)}
          >
            <SelectTrigger className={sharedStyles.trigger}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "harvard", n: "Harvard (Clásico)" },
                { id: "europass", n: "Europass Modern" },
              ].map((tpl) => (
                <SelectItem key={tpl.id} value={tpl.id} className={sharedStyles.item}>{tpl.n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <HelperText>
            {TEMPLATE_DESCRIPTIONS[formData.templateId!] || TEMPLATE_DESCRIPTIONS.default}
          </HelperText>
        </div>
      )}

      {/* 4. Perfil Profesional */}
      <div className="space-y-2">
        <Label className={sharedStyles.label}>Perfil profesional</Label>
        <Select
          value={formData.cvType}
          onValueChange={(v) => updateField("cvType", v as CvType)}
        >
          <SelectTrigger className={sharedStyles.trigger}>
            <SelectValue placeholder="Selecciona tu perfil" />
          </SelectTrigger>
          <SelectContent>
            {cvTypes.map((t) => (
              <SelectItem key={t.key} value={t.key} className={sharedStyles.item}>{t.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <HelperText>
          {CV_TYPE_DESCRIPTIONS[formData.cvType] || CV_TYPE_DESCRIPTIONS.default}
        </HelperText>
      </div>

    </div>
  )
}
