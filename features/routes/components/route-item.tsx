import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RouteWithCvSummary } from "@/store/use-route-store";
import { MiniProgress } from "./mini-progress";

interface RouteItemProps {
  route: RouteWithCvSummary;
  isActive: boolean;
  onSelect: () => void;
}

export function RouteItem({ route, isActive, onSelect }: RouteItemProps) {
  const isDone = route.status === "PROGRAM_DONE";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg transition-all border",
        isActive
          ? "bg-primary/10 border-primary/20"
          : "border-transparent hover:bg-secondary/70",
        isDone && !isActive && "border-green-500/10 bg-green-500/5"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 shrink-0 flex items-center justify-center">
          {isActive && <Check className="w-3 h-3 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-xs font-bold truncate", isActive && "text-primary")}>
            {route.name}
          </p>
          <MiniProgress route={route} />
        </div>
      </div>
    </button>
  );
}
