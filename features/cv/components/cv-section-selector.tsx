"use client";

import { CheckCircle, Plus, Sparkles } from "lucide-react";
import { CvSectionType, OpportunityType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { OPPORTUNITY_MAP, RECOMMENDATIONS_BY_OPPORTUNITY, SECTION_LABELS } from "@/const";

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
    .filter(item => item !== CvSectionType.LANGUAGES);

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
        <Label className="text-sm ml-1 flex items-center gap-2">
          Secciones para tu CV
          <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold border border-accent/20">
            IA Sugiere
          </span>
        </Label>

        <p className="text-[10px] text-muted-foreground/60 px-1">
          * Puedes agregar más secciones si deseas.
        </p>

        <div className="flex flex-wrap gap-2 p-3 rounded-3xl bg-secondary/20 border border-border/40">
          {allSectionTypes.map((section) => {
            const isSelected = selectedSections.includes(section);
            const isRecommended = recommended.includes(section);

            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border",
                  // Estado: Seleccionado
                  isSelected && "bg-accent text-accent-foreground border-accent shadow-md shadow-accent/20",
                  // Estado: No seleccionado pero RECOMENDADO
                  (!isSelected && isRecommended) && "bg-accent/5 border-accent/40 text-foreground hover:bg-accent/10",
                  // Estado: No seleccionado y NO recomendado
                  (!isSelected && !isRecommended) && "bg-background/50 text-muted-foreground border-border hover:border-accent/30"
                )}
              >
                {isSelected ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <Plus className={cn("h-3.5 w-3.5", isRecommended && "text-accent")} />
                )}

                {SECTION_LABELS[section]}

                {/* Badge de recomendación (brillo o punto) */}
                {isRecommended && !isSelected && (
                  <Sparkles className="h-2.5 w-2.5 text-accent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 px-1">
        * Las secciones seleccionadas son las que te recomendamos para  <b>{OPPORTUNITY_MAP[opportunityType] || opportunityType}</b>
      </p>
    </div>
  );
}
