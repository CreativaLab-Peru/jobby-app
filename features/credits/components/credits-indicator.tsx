import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, FileText, Plus } from "lucide-react";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";

interface CreditsIndicatorProps {
  limits: CreditLimits;
}

export function CreditsIndicator({ limits }: CreditsIndicatorProps) {
  const totalAvailable = limits.manageCvsLimit + limits.aiActionsLimit;
  const isEmpty = totalAvailable === 0;

  return (
    <Popover>
      {/* Gatillo: Solo el icono y el número total para mantener el Navbar limpio */}
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent">
          <Zap className={`h-4 w-4 ${isEmpty ? "text-muted-foreground" : "text-yellow-500 fill-yellow-500"}`} />
          <span className="text-sm font-bold">{totalAvailable}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-4">
        <div className="space-y-4">
          <h4 className="font-semibold leading-none">Tus Créditos</h4>

          <div className="grid gap-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Creación de CVs</span>
              </div>
              <span className="font-mono font-bold">{limits.manageCvsLimit}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Acciones IA</span>
              </div>
              <span className="font-mono font-bold">{limits.aiActionsLimit}</span>
            </div>
          </div>

          <hr />

          {isEmpty ? (
            <div className="space-y-3">
              <p className="text-xs text-balance text-destructive font-medium">
                ¡Te has quedado sin combustible! Potencia tu búsqueda de empleo ahora.
              </p>
              <Button size="sm" className="w-full ai-gradient">
                <Plus className="mr-2 h-4 w-4" /> Comprar Créditos
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              Recargar créditos
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
