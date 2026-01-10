"use client"

import { Progress } from "@/components/ui/progress";

interface Props {
  used: number;
  limit: number;
  label: string;
  colorClass: string;
}

export function StatsResourceCard({ used, limit, label, colorClass }: Props) {
  const percentage = (used / limit) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase">
        <span>{label}</span>
        <span className={colorClass}>{used} / {limit}</span>
      </div>
      <Progress value={percentage} className={`h-2 bg-muted ${colorClass === 'text-primary' ? '[&>div]:bg-primary' : '[&>div]:bg-secondary'}`} />
    </div>
  );
}
