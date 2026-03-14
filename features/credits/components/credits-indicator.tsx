"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, FileText, Plus } from "lucide-react";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { useRouter } from "next/navigation";
import { useCredits } from "@/features/credits/hooks/use-credits";
import { useSidebar } from "@/components/ui/sidebar"; // Importante para detectar el estado
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CreditsIndicatorProps {
  limits: CreditLimits;
}

export function CreditsIndicator({ limits }: CreditsIndicatorProps) {
  const { credits } = useCredits(limits);
  const { state } = useSidebar();
  const router = useRouter();

  const collapsed = state === "collapsed";
  const totalAvailable = credits.manageCvsLimit + credits.aiActionsLimit + credits.opportunitiesActionsLimit;
  const isEmpty = totalAvailable === 0;

  const handleRechargeCredits = () => {
    router.push("/credits");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-2 rounded-xl border border-border bg-card p-2 transition-all hover:bg-secondary/80 hover:shadow-sm",
            collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2"
          )}
        >
          <div className="relative">
            <Zap
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isEmpty ? "text-muted-foreground" : "text-yellow-500 fill-yellow-500"
              )}
            />
            {isEmpty && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-destructive" />
            )}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-1 items-center justify-between"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Créditos
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {totalAvailable} disponibles
                  </span>
                </div>
                <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side={collapsed ? "right" : "bottom"}
        align={collapsed ? "start" : "center"}
        sideOffset={12}
        className="w-64 p-4 shadow-xl border-border"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Desglose de energía</h4>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>

          <div className="grid gap-3">
            <CreditRow
              icon={<FileText className="h-4 w-4 text-blue-500" />}
              label="Gestión de CVs"
              value={credits.manageCvsLimit}
            />
            <CreditRow
              icon={<Sparkles className="h-4 w-4 text-purple-500" />}
              label="Acciones IA"
              value={credits.aiActionsLimit}
            />
            <CreditRow
              icon={<Zap className="h-4 w-4 text-yellow-500" />}
              label="Oportunidades"
              value={credits.opportunitiesActionsLimit}
            />
          </div>

          <Separator className="bg-border/50" />

          {isEmpty ? (
            <div className="space-y-3">
              <p className="text-[11px] text-balance text-destructive font-medium text-center">
                ¡Sin combustible! Recarga para seguir acelerando tu carrera.
              </p>
              <Button
                size="sm"
                className="w-full font-bold"
                variant="accent"
                onClick={handleRechargeCredits}
              >
                Comprar Créditos
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium"
              onClick={handleRechargeCredits}
            >
              Gestionar Plan
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Sub-componente interno para mantener el código limpio (KISS)
function CreditRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono font-bold text-foreground">{value}</span>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[1px] w-full bg-border", className)} />;
}
