import Link from "next/link";

import { Button } from "@/components/ui/button";
import {AdminDashboardRange} from "@/features/dashboard/utils/get-range";

const RANGE_OPTIONS: { value: AdminDashboardRange; label: string }[] = [
  { value: "3d", label: "Últimos 3 dias" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "1m", label: "Último mes" },
  { value: "3m", label: "Últimos 3 meses" },
  { value: "6m", label: "Últimos 6 meses" },
];

interface AdminDashboardRangeTabsProps {
  activeRange: AdminDashboardRange;
  basePath?: string;
}

export function AdminDashboardRangeTabs({
  activeRange,
  basePath = "/admin/dashboard",
}: AdminDashboardRangeTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {RANGE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          asChild
          size="sm"
          variant={activeRange === option.value ? "default" : "outline"}
          className="rounded-full"
        >
          <Link href={`${basePath}?range=${option.value}`}>{option.label}</Link>
        </Button>
      ))}
    </div>
  );
}

