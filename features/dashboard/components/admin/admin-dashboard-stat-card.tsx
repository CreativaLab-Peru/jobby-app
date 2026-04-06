import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminDashboardStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  subtitle?: string;
  toneClassName?: string;
}

export function AdminDashboardStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  toneClassName,
}: AdminDashboardStatCardProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <div className="text-2xl font-black text-foreground">{value}</div>
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

