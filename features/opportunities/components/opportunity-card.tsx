import { Calendar, ExternalLink, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {SerializableOpportunity} from "@/features/opportunities/get-opportunities";

interface Props {
  opportunity: SerializableOpportunity;
}

export default function OpportunityCard({ opportunity }: Props) {
  const matchValue = Math.round(opportunity.match);

  return (
    <Card className="border-2 hover:border-primary/40 transition-all duration-300 group overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="font-bold border-2">
            {opportunity.type.replace('_', ' ')}
          </Badge>
          <div className="flex items-center gap-1 text-primary font-black">
            <Target className="w-4 h-4" />
            <span>{matchValue}%</span>
          </div>
        </div>
        <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
          {opportunity.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Requerimientos resumidos */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {opportunity.requirements}
        </p>

        <div className="flex flex-wrap gap-y-2 gap-x-4">
          {opportunity.deadline && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Calendar className="w-3 h-3" />
              <span>Cierra: {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full ai-gradient text-white font-bold border-none shadow-glow hover:opacity-90"
          asChild
        >
          <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer">
            Postular Ahora
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
