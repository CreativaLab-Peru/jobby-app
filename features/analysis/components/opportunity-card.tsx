import { Opportunity } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ExternalLink, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/format-date";

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const numberFormatted = Number(opportunity.match) * 100 || 0;
  const deadlineFormatted = formatDate(opportunity.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      // REFACTOR: bg-card y shadow-card para consistencia con el Dashboard
      className="p-6 border border-border rounded-xl bg-card shadow-sm hover:shadow-card transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
            {opportunity.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {/* Badge con estilo muted/primary */}
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">
              {opportunity.type}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              <CalendarDays className="w-4 h-4" />
              <span>Límite: {deadlineFormatted}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          {/* Match Score usando el color secondary (verde lima) */}
          <div className="text-3xl font-black text-secondary tracking-tighter">
            {Math.round(numberFormatted)}%
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Requisitos clave</h4>
        <div className="flex flex-wrap gap-2">
          {opportunity.requirements && (
            <Badge variant="secondary" className="bg-muted text-foreground border-transparent text-xs py-1">
              {opportunity.requirements}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Progress bar con el gradiente de marca */}
        <div className="flex-1">
          <Progress
            value={numberFormatted}
            className="h-2.5 bg-muted [&>div]:ai-gradient"
          />
        </div>

        {/* Botón usando el color secondary para destacar la acción */}
        <Button
          size="sm"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 shadow-sm transition-all"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver más
        </Button>
      </div>
    </motion.div>
  )
}
