import { Badge } from "@/components/ui/badge";
import { Zap, Globe, FileText } from "lucide-react";

interface Props {
  ai: number;
  opps: number;
  cvs: number;
}

export function CreditBalance({ ai, opps, cvs }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary"
               className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 border-none font-semibold">
          <Zap className="w-3 h-3 mr-1 fill-current" /> {ai} créditos IA
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 border-none font-semibold">
          <Globe className="w-3 h-3 mr-1 fill-current" /> {opps} créditos oportunidades
        </Badge>
        <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-purple-900/30 dark:text-zinc-300 font-semibold">
          <FileText className="w-3 h-3 mr-1" /> {cvs} límite de CVs
        </Badge>
      </div>
      <p className="text-gray-600 text-sm">
        Adquiere paquetes de créditos para desbloquear más funciones de análisis y gestión.
      </p>
    </div>
  );
}
