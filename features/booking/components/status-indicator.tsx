"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  label: string;
  active?: boolean;
  className?: string;
}

export const StatusIndicator = ({ label, active = true, className }: StatusIndicatorProps) => (
  <div className={cn("flex items-center gap-2.5 bg-white/50 px-3 py-1.5 rounded-full border border-border/50", className)}>
    <div className="relative flex h-2 w-2">
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={cn(
        "relative inline-flex h-2 w-2 rounded-full",
        active ? "bg-emerald-500" : "bg-slate-300"
      )} />
    </div>
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest",
      active ? "text-emerald-600" : "text-slate-400"
    )}>
      {label}
    </span>
  </div>
);
