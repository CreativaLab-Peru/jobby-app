"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={toggleSidebar}
    >
      <Menu />
    </button>
  );
}
