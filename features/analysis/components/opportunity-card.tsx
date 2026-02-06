import { Opportunity } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, CalendarDays, Building2, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import { parseRequirements } from "@/utils/parse-requirements";

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const numberFormatted = Number(opportunity.match) * 100 || 0;
  const deadlineFormatted = formatDate(opportunity.deadline);


  const { required, optional } = opportunity.requirements 
    ? parseRequirements(opportunity.requirements) 
    : { required: null, optional: null };

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
          {opportunity.company && (
            <p className="text-sm text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {opportunity.company}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {/* Badge con estilo muted/primary */}
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">
              {opportunity.type.replace(/_/g, ' ')}
            </Badge>
            {opportunity.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>{opportunity.location}</span>
              </div>
            )}
            {opportunity.deadline && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Límite: {deadlineFormatted}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black text-levely-blue dark:text-levely-green tracking-tighter">
            {Math.round(numberFormatted)}%
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Requisitos</h4>
        {required || optional ? (
          <div className="space-y-1.5">
            {required && (
              <div className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Habilidades Requeridas:</span>{' '}
                <span className="text-muted-foreground">{required}</span>
              </div>
            )}
            {optional && (
              <div className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Habilidades Opcionales:</span>{' '}
                <span className="text-muted-foreground">{optional}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sin requisitos especificados</p>
        )}
      </div>

      {/* Barra visual de match */}
      <div className="mb-4">
        <Progress 
          value={numberFormatted} 
          className="h-1.5 [&>div]:dark:bg-levely-green [&>div]:bg-levely-blue"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Link href={`/opportunities/${opportunity.id}/details`} className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-2 font-semibold dark:bg-levely-green/90 dark:text-levely-dark bg-levely-blue/90 text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver detalles
          </Button>
        </Link>
        <Button
          size="sm"
          className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-sm"
          asChild
        >
          <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
            Postular
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
