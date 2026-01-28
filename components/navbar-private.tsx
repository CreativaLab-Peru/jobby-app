"use client";

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/button-toggle-theme";
import { ProfileButton } from "@/components/profile-button";
import { Coins, FileText, Zap, Briefcase, Sun, Moon, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditsOfPlan } from "@/features/billing/actions/get-available-tokens";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  userLimit: CreditsOfPlan;
}

export function NavbarPrivate({ userLimit, user }: NavbarProps) {
  const router = useRouter();
  const displayName = user?.name || "Explorador";
  const credits = userLimit.totalCredits - userLimit.usedCredits;

  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border md:pl-64">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Sidebar trigger + Welcome */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h1 className="text-2xl font-bold">
              Hola, <span className="text-levely-blue dark:text-levely-green">{displayName}</span>
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

        {/* Right: Credits + Theme + Profile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Credits Badge */}
          <Link
            href="/settings" // O a la ruta de créditos si existe
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border hover:border-levely-green/50 transition-colors"
          >
            <Coins className="h-4 w-4 text-levely-blue dark:text-levely-green" />
            <span className="text-sm font-medium">{credits}</span>
            <span className="text-xs text-muted-foreground">Créditos</span>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {/* TODO: implement user plan display */}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/creditos" className="cursor-pointer">
                  Mejorar Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  // Cerrar sesión
                  if (typeof window !== "undefined") {
                    const { authClient } = await import("@/lib/auth-client");
                    await authClient.signOut();
                    router.push("/login");
                  }
                }}
                className="text-levely-blue dark:text-levely-green cursor-pointer"
              >
                <LogOut className="text-levely-blue dark:text-levely-green h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
