"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileButton } from "@/components/profile-button";
import { ThemeToggle } from "@/components/button-toggle-theme";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {CreditsIndicator} from "@/features/credits/components/credits-indicator";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Briefcase, FileText, Zap} from "lucide-react";

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
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border md:pl-64">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Sidebar trigger + Welcome */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h1 className="text-xl font-bold">
              Hola, <span className="text-levely-blue dark:text-levely-green truncate block">{user.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Esto es lo que la IA de Levely tiene para ti.
            </p>
          </div>
        </div>

        {/* Center: Quick Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/cv">
              <FileText className="h-4 w-4 mr-2" />
              Crear CV
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-levely-blue/50 text-levely-blue dark:border-levely-green/50 dark:text-levely-green hover:bg-levely-green/10"
            asChild
          >
            <Link href="/evaluations">
              <Zap className="h-4 w-4 mr-2" />
              Evaluar Perfil
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/opportunities">
              <Briefcase className="h-4 w-4 mr-2" />
              Ver Oportunidades
            </Link>
          </Button>
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
    </header>
  );
}
