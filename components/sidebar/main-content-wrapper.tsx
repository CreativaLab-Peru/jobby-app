"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className={cn(
      "flex flex-1 flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "sm:ml-20" : "sm:ml-64"
    )}>
      {children}
    </div>
  );
}
