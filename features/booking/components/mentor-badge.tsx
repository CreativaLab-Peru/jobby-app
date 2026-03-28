"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MentorBadgeProps {
  children: React.ReactNode;
  icon: LucideIcon;
  className?: string;
}

export const MentorBadge = ({ children, icon: Icon, className }: MentorBadgeProps) => (
  <div className={cn(
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
    "bg-secondary text-primary border border-secondary",
    "text-xs",
    className
  )}>
    <Icon className="h-3.5 w-3.5" />
    {children}
  </div>
);
