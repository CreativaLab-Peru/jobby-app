"use client";

import { CheckCircle, Plus, Sparkles } from "lucide-react";
import { CvSectionType, Language, OpportunityType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RECOMMENDATIONS_BY_OPPORTUNITY } from "@/const";

interface CvSectionSelectorProps {
  opportunityType: OpportunityType;
  selectedSections: CvSectionType[];
  onChange: (sections: CvSectionType[]) => void;
  language?: Language;
}

const SECTION_LABELS_I18N: Record<CvSectionType, { ES: string; EN: string }> = {
  SUMMARY: { ES: "Resumen Profesional", EN: "Professional Summary" },
  CONTACT: { ES: "Informacion de Contacto", EN: "Contact Information" },
  EXPERIENCE: { ES: "Experiencia Laboral", EN: "Work Experience" },
  EDUCATION: { ES: "Formacion Academica", EN: "Education" },
  SKILLS: { ES: "Habilidades Tecnicas", EN: "Technical Skills" },
  PROJECTS: { ES: "Proyectos Destacados", EN: "Featured Projects" },
  VOLUNTEERING: { ES: "Voluntariado", EN: "Volunteering" },
  CERTIFICATIONS: { ES: "Certificaciones", EN: "Certifications" },
  COMPLEMENTS: { ES: "Informacion Complementaria", EN: "Additional Information" },
  ACHIEVEMENTS: { ES: "Logros", EN: "Achievements" },
  LANGUAGES: { ES: "Idiomas", EN: "Languages" },
  INTERESTS: { ES: "Intereses", EN: "Interests" },
};

export function CvSectionSelector({
                                    opportunityType,
                                    selectedSections,
                                    onChange,
                                    language = Language.ES,
                                  }: CvSectionSelectorProps) {
  const recommended = RECOMMENDATIONS_BY_OPPORTUNITY[opportunityType] || [];
  const isEn = language === Language.EN;
  const allSectionTypes = Object.values(CvSectionType)
    .filter(item => item !== CvSectionType.LANGUAGES)
    .filter(item => item !== CvSectionType.SUMMARY);

  const toggleSection = (section: CvSectionType) => {
    const isSelected = selectedSections.includes(section);
    if (isSelected) {
      onChange(selectedSections.filter((s) => s !== section));
    } else {
      onChange([...selectedSections, section]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <Label className="text-sm flex items-center gap-2">
            {isEn ? "Sections for your CV" : "Secciones para tu CV"}
            <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold border border-accent/20">
              {isEn ? "AI Suggests" : "IA Sugiere"}
            </span>
          </Label>
          {selectedSections.length > 0 && (
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
               {isEn ? "Active fill order" : "Orden de llenado activo"}
             </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/60 px-1">
          {isEn
            ? "* Select the order you want them to appear in."
            : "* Selecciona en el orden que prefieras que aparezcan."}
        </p>

        <div className="flex flex-wrap gap-2 p-3 rounded-3xl bg-secondary/10 border border-border/40">
          {allSectionTypes.map((section) => {
            const orderIndex = selectedSections.indexOf(section);
            const isSelected = orderIndex !== -1;
            const isRecommended = recommended.includes(section);

            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold transition-all border duration-200",
                  // Estado: Seleccionado
                  isSelected
                    ? "bg-accent text-accent-foreground border-accent shadow-md shadow-accent/20 scale-[1.02]"
                    : "bg-background/50 text-muted-foreground border-border hover:border-accent/30",
                  // Recomendado pero no seleccionado
                  (!isSelected && isRecommended) && "bg-accent/5 border-accent/40 text-foreground hover:bg-accent/10",
                )}
              >
                {/* Indicador Numérico de Orden */}
                {isSelected && (
                  <span className="flex items-center justify-center w-4 h-4 bg-accent-foreground text-accent rounded-full text-[9px] font-black shadow-inner">
                    {orderIndex + 1}
                  </span>
                )}

                {!isSelected && (
                  isRecommended ? (
                    <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 opacity-40" />
                  )
                )}

                <span className={cn(isSelected && "ml-0.5")}>
                  {SECTION_LABELS_I18N[section][isEn ? "EN" : "ES"]}
                </span>

                {isSelected && (
                  <CheckCircle className="h-3 w-3 opacity-70 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
