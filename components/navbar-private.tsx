"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileButton } from "@/components/profile-button";
import { ThemeToggle } from "@/components/button-toggle-theme";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { CreditsIndicator } from "@/features/credits/components/credits-indicator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, FileText, Zap } from "lucide-react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  creditLimits: CreditLimits;
}

type NavbarUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
} | null;

const sessionFetcher = (): Promise<NavbarUser> =>
  authClient.getSession().then((res) => {
    const u = res?.data?.user;
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email ?? "", image: u.image };
  });

export function NavbarPrivate({ creditLimits, user: initialUser }: NavbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sessionUser } = useSWR("session", sessionFetcher, {
    fallbackData: initialUser,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
  });

  const user = sessionUser ?? initialUser;

  if (!mounted) return null;

  return (
    <header className="py-1 sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border md:pl-64">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Sidebar trigger + Welcome */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <SidebarTrigger className="lg:hidden flex-shrink-0" />
          <div className="min-w-0 max-w-[120px] sm:max-w-[200px] md:max-w-xs">
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-1 text-black dark:text-white truncate drop-shadow-[0_1.2px_1.2px_rgba(var(--primary-rgb),0.8)]">
              Hola,{" "}
              <span className="text-accent dark:text-levely-green truncate">{user?.name?.split(" ")[0] || ""}</span>
            </h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Esto es lo que la IA de Levely tiene para ti.
            </p>
          </div>
        </div>

        {/* Center: Quick Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="default" size="sm" asChild>
            <Link href="/cv">
              <FileText className="h-4 w-4 mr-2" />
              Crear CV
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            asChild
          >
            <Link href="/evaluations">
              <Zap className="h-4 w-4 mr-2" />
              Evaluar Perfil
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
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
