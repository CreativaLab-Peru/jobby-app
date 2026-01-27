"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileButton } from "@/components/profile-button";
import { ThemeToggle } from "@/components/button-toggle-theme";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {CreditsIndicator} from "@/features/credits/components/credits-indicator";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  creditLimits: CreditLimits;
}

export function NavbarPrivate({ creditLimits, user }: NavbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-10 lg:px-20">

        {/* LADO IZQUIERDO: Mobile Trigger & Logo placeholder */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="sm:hidden text-primary" />
          {/*<div className="hidden font-bold text-xl sm:block text-primary">MiApp</div>*/}
        </div>

        {/* LADO DERECHO: Acciones */}
        <div className="flex items-center gap-3">

          {/* CRÉDITOS (KISS) */}
          <CreditsIndicator limits={creditLimits} />

          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          <ThemeToggle />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ProfileButton user={user} />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
