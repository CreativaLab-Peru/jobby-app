"use client"

import { Progress } from "@/components/ui/progress";

interface Props {
  used: number;
  limit: number;
  label: string;
  colorClass: string;
}

export function StatsResourceCard({ used, limit, label, colorClass }: Props) {
  const percentage = Math.round((used / limit) * 100);
  const barColor = colorClass.includes('blue') ? 'bg-blue-400' : colorClass.includes('green') ? 'bg-green-400' : colorClass.includes('coral') ? 'bg-orange-400' : 'bg-gray-400';
  return (
    <div className="space-y-2 bg-gradient-to-br dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 rounded-xl p-2">
      <div className="flex justify-between items-center text-xs font-bold uppercase mb-1">
        <span className="text-gray-500 dark:text-gray-300">{label}</span>
        <span className={`font-bold ${colorClass}`}>{used} / {limit}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
