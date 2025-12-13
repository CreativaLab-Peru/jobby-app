import {Opportunity} from ".prisma/client";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";
import {motion} from "framer-motion";
import {formatDate} from "@/utils/format-date";

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({opportunity}: OpportunityCardProps) {
  const numberFormatted = Number(opportunity.match) * 100 || 0;
  const deadlineFormatted = formatDate(opportunity.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{opportunity.title}</h3>
          <div className="flex items-center gap-4 mb-3">
            <Badge className="text-black bg-blue-100">
              {opportunity.type}
            </Badge>
            <span className="text-sm text-gray-500">
                    <span className="font-bold">Fecha límite:</span> {deadlineFormatted}
                  </span>
          </div>
        </div>opportunities
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600 mb-1">{numberFormatted}%</div>
          <p className="text-sm text-gray-500">Match</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Requisitos:</h4>
        <div className="flex flex-wrap gap-2">
          {/*{opp.requirements.map((req, reqIndex) => (*/}
          {/*  <Badge key={reqIndex} variant="secondary" className="text-xs">*/}
          {/*    {req}*/}
          {/*  </Badge>*/}
          {/*))}*/}
          {opportunity.requirements &&
            <Badge variant="secondary" className="text-xs">
              {opportunity.requirements}
            </Badge>
          }
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Progress value={numberFormatted} className="h-4 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:via-purple-500 [&>div]:to-pink-500" />
        <Button size="sm" className="text-black border-2 border-yellow-200 bg-yellow-100 hover:bg-yellow-200 ml-4">
          <ExternalLink className="w-4 h-4 mr-1" />
          Ver más
        </Button>
      </div>
    </motion.div>
  )
}
