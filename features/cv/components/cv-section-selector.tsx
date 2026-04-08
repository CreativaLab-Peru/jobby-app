"use client";

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
  } as Record<CvSectionType, number>;

  const renderOrder = [...allSectionTypes].sort((a, b) => {
    const oa = orderOfSections[a] ?? 1000;
    const ob = orderOfSections[b] ?? 1000;
    return oa - ob;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
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
        </div

        <p className="text-[10px] text-muted-foreground/60 px-1">
          * Selecciona en el orden que prefieras que aparezcan.
        </p>

        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-secondary/10 border border-border/40">
          {renderOrder.map((section) => {
            const isSelected = selectedSections.includes(section);
            const isRecommended = recommended.includes(section);

            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={cn(
                  "w-full text-left flex items-center justify-between px-4 py-2 rounded-lg text-sm font-semibold transition-all border duration-200",
                  isSelected
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-background/50 text-muted-foreground border-border hover:border-accent/30",
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

                {isSelected && (
                  <span className="text-[12px] text-muted-foreground">
                    {selectedSections.indexOf(section) + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
