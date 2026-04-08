"use client";

import { useState } from "react";
import { CheckCircle, Plus, Sparkles } from "lucide-react";
import { CvSectionType, OpportunityType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RECOMMENDATIONS_BY_OPPORTUNITY, SECTION_LABELS } from "@/const";

interface CvSectionSelectorProps {
  opportunityType: OpportunityType;
  selectedSections: CvSectionType[];
  onChange: (sections: CvSectionType[]) => void;
}

export function CvSectionSelector({
  opportunityType,
  selectedSections,
  onChange,
}: CvSectionSelectorProps) {
  const recommended = RECOMMENDATIONS_BY_OPPORTUNITY[opportunityType] || [];
  const allSectionTypes = Object.values(CvSectionType)
    .filter((item) => item !== CvSectionType.LANGUAGES)
    .filter((item) => item !== CvSectionType.SUMMARY);

  // Estado para la sección actualmente abierta
  const [openSection, setOpenSection] = useState<CvSectionType | null>(null);

  const toggleSection = (section: CvSectionType) => {
    const isSelected = selectedSections.includes(section);
    if (isSelected) {
      onChange(selectedSections.filter((s) => s !== section));
    } else {
      onChange([...selectedSections, section]);
    }
  };

  // Toggle collapse estándar: si clicas en la misma sección, se cierra; otra sección → se abre y cierra la anterior
  const toggleCollapse = (section: CvSectionType) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const orderOfSections: Record<CvSectionType, number> = {
    [CvSectionType.SUMMARY]: 0,
    [CvSectionType.CONTACT]: 1,
    [CvSectionType.EXPERIENCE]: 2,
    [CvSectionType.EDUCATION]: 3,
    [CvSectionType.SKILLS]: 4,
    [CvSectionType.PROJECTS]: 5,
    [CvSectionType.VOLUNTEERING]: 6,
    [CvSectionType.CERTIFICATIONS]: 7,
    [CvSectionType.COMPLEMENTS]: 8,
    [CvSectionType.ACHIEVEMENTS]: 9,
    [CvSectionType.INTERESTS]: 10,
    [CvSectionType.LANGUAGES]: 11,
  };

  const renderOrder = [...allSectionTypes].sort(
    (a, b) => (orderOfSections[a] ?? 1000) - (orderOfSections[b] ?? 1000)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-1 gap-1">
          <Label className="flex items-center gap-1 text-sm">
            Secciones para tu CV
            <span className="ml-1 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold border border-accent/20">
              IA Sugiere
            </span>
          </Label>
          {selectedSections.length > 0 && (
            <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1 sm:mt-0">
              Orden de llenado activo
            </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/60 px-1">
          * Selecciona en el orden que prefieras que aparezcan.
        </p>

        {/* Secciones */}
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-secondary/10 border border-border/40">
          {renderOrder.map((section) => {
            const isSelected = selectedSections.includes(section);
            const isRecommended = recommended.includes(section);
            const isOpen = openSection === section;

            return (
              <div key={section} className="w-full">
                {/* Botón para abrir/cerrar */}
                <button
                  type="button"
                  onClick={() => toggleCollapse(section)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-semibold transition-all border cursor-pointer duration-200",
                    isSelected
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background/50 text-muted-foreground border-border hover:border-accent/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4 text-accent-foreground" />
                    ) : isRecommended ? (
                      <Sparkles className="h-4 w-4 text-accent" />
                    ) : (
                      <Plus className="h-4 w-4 opacity-40" />
                    )}
                    <span>{SECTION_LABELS[section]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSelected && (
                      <span className="text-[12px] text-muted-foreground">
                        {selectedSections.indexOf(section) + 1}
                      </span>
                    )}
                    <span
                      className={cn(
                        "transition-transform duration-300",
                        isOpen ? "rotate-90" : "rotate-0"
                      )}
                    >
                      ▶
                    </span>
                  </div>
                </button>

                {/* Contenido desplegable */}
                {isOpen && (
                  <div className="px-6 py-3 bg-background/80 border border-border rounded-b-lg text-sm text-muted-foreground">
                    <p>
                      Aquí va la descripción o contenido adicional de la sección{" "}
                      <strong>{SECTION_LABELS[section]}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleSection(section)}
                      className={cn(
                        "mt-2 px-3 py-1 rounded bg-accent text-accent-foreground font-semibold",
                        isSelected ? "opacity-100" : "opacity-70"
                      )}
                    >
                      {isSelected ? "Quitar sección" : "Agregar sección"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
