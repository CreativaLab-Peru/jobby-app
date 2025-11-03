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

interface CVFormData {
  title: string
  cvType: CvType
  opportunityType: OpportunityType
}

interface CVFormProps {
  formData: CVFormData
  onFormDataChange: (data: CVFormData) => void
}

export const cvTypes = [
  { key: CvType.TECHNOLOGY_ENGINEERING, value: "Tecnología e Ingeniería" },
  { key: CvType.DESIGN_CREATIVITY, value: "Diseño y Creatividad" },
  { key: CvType.MARKETING_STRATEGY, value: "Marketing y Estrategia" },
  { key: CvType.MANAGEMENT_BUSINESS, value: "Gestión y Negocios" },
  { key: CvType.FINANCE_PROJECTS, value: "Finanzas y Proyectos" },
  { key: CvType.SOCIAL_MEDIA, value: "Redes Sociales y Contenido Digital" },
  { key: CvType.EDUCATION, value: "Educación y Desarrollo Humano" },
  { key: CvType.SCIENCE, value: "Ciencia e Innovación" },
]

export const opportunityTypes = [
  { key: OpportunityType.INTERNSHIP, value: "Prácticas" },
  { key: OpportunityType.SCHOLARSHIP, value: "Beca" },
  { key: OpportunityType.EXCHANGE_PROGRAM, value: "Programa de Intercambio" },
  { key: OpportunityType.EMPLOYMENT, value: "Empleo" },
  // { key: OpportunityType.RESEARCH_FELLOWSHIP, value: "Investigación o Fellowship" },
  // { key: OpportunityType.GRADUATE_PROGRAM, value: "Programa de Posgrado" },
  // { key: OpportunityType.FREELANCE, value: "Freelance / Independiente" },
  // { key: OpportunityType.FULL_TIME, value: "Trabajo a Tiempo Completo" },
  // { key: OpportunityType.PART_TIME, value: "Trabajo a Medio Tiempo" },
]


export function CVForm({ formData, onFormDataChange }: CVFormProps) {
  const updateFormData = (updates: Partial<CVFormData>) => {
    onFormDataChange({ ...formData, ...updates })
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Título del CV
        </Label>
        <Input
          id="title"
          placeholder="Ejemplo: CV Ingeniero de Software"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className="w-full border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="opportunity" className="text-sm font-medium text-gray-700">
          Tipo de Oportunidad
        </Label>
        <Select
          value={formData.opportunityType}
          onValueChange={(value) => updateFormData({ opportunityType: value as OpportunityType })}
        >
          <SelectTrigger className="bg-white text-black w-full border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
            <SelectValue placeholder="Selecciona el tipo de oportunidad" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border-gray-200">
            {opportunityTypes.map((item) => (
              <SelectItem
                className="focus:bg-gray-100 focus:text-black"
                key={item.key}
                value={item.key}
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
          Selecciona tu perfil profesional
        </Label>
        <Select
          value={formData.cvType}
          onValueChange={(value) => updateFormData({ cvType: value as CvType })}
        >
          <SelectTrigger className="bg-white text-black w-full border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
            <SelectValue placeholder="Selecciona el tipo de CV" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border-gray-200">
            {cvTypes.map((item) => (
              <SelectItem
                className="focus:bg-gray-100 focus:text-black"
                key={item.key}
                value={item.key}
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p>
          <span className="text-sm text-gray-500">
            {formData.cvType === CvType.TECHNOLOGY_ENGINEERING && "Ideal para perfiles en sistemas, software, innovación o data."}
            {formData.cvType === CvType.DESIGN_CREATIVITY && "Para creativos visuales, diseñadores gráficos, UX/UI o artistas digitales."}
            {formData.cvType === CvType.MARKETING_STRATEGY && "Para marketers, comunicadores o estrategas de contenido."}
            {formData.cvType === CvType.MANAGEMENT_BUSINESS && "Para administración, emprendimiento o desarrollo comercial."}
            {formData.cvType === CvType.FINANCE_PROJECTS && "Para gestión financiera, análisis económico o PMO."}
            {formData.cvType === CvType.SOCIAL_MEDIA && "Para community managers, creadores de contenido o influencers."}
            {formData.cvType === CvType.EDUCATION && "Para docentes, formadores, capacitadores o coaches."}
            {formData.cvType === CvType.SCIENCE && "Para perfiles STEM, sostenibilidad, impacto o proyectos de investigación."}
            {!formData.cvType && "Selecciona un perfil profesional para ver su descripción."}
          </span>
        </p>
      </div>
    </div>
  )
}
