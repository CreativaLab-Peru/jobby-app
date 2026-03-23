"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function NavbarPrivate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="py-1 sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border md:pl-64">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Sidebar trigger + Welcome */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <SidebarTrigger className="lg:hidden flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}
