"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

// UI Components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

// Icons & Features
import {
  LayoutDashboard, FileText, MessageSquare, MessageSquareWarning,
  Activity, Briefcase, CreditCard, Settings, Users, BarChart3,
  Tag, Wallet, Mic, Shield, Receipt, X, Map, Coins,
  FileCheckIcon
} from "lucide-react";

import { ProfileButton } from "@/components/profile-button";
import { ThemeToggle } from "@/components/button-toggle-theme";
import { CreditsIndicator } from "@/features/credits/components/credits-indicator";
import { RouteSelector } from "@/features/routes/components/route-selector";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {Button} from "@/components/ui/button";
import {useCreditsStore} from "@/store/use-credits-store";

// --- Types & Fetcher ---
export type NavbarUser = {
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

// --- Nav Items Configuration ---
const routeNavItems = [
  { title: "Mi Pasos", href: "/dashboard", icon: LayoutDashboard },
  { title: "CV", href: "/my-cv", icon: FileText },
  { title: "Análisis", href: "/my-evaluation", icon: MessageSquare },
  { title: "Oportunidades", href: "/my-opportunities", icon: Briefcase },
  { title: "Roadmaps", href: "/my-roadmaps", icon: Map },
];

const managementNavItems = [
  { title: "Mis CVs", href: "/my-cvs", icon: FileCheckIcon },
];

const accountNavItems = [
  { title: "Créditos", href: "/credits", icon: CreditCard },
  { title: "Transacciones", href: "/transactions", icon: Receipt },
  // { title: "Preferencias", href: "/preferences", icon: Sliders },
  { title: "Configuraciones", href: "/settings", icon: Settings },
];

const adminNavItems = [
  { title: "Usuarios", href: "/admin/users", icon: Users },
  { title: "CVs", href: "/admin/cv", icon: FileText },
  { title: "Evaluaciones", href: "/admin/evaluations", icon: BarChart3 },
  { title: "Oportunidades", href: "/admin/opportunities", icon: Briefcase },
  { title: "Pagos", href: "/admin/payments", icon: CreditCard },
  { title: "Monetización", href: "/admin/plans", icon: Tag },
  { title: "Balances", href: "/admin/balances", icon: Wallet },
  { title: "Reclamos", href: "/admin/complaints", icon: MessageSquareWarning },
  { title: "Entrevistas", href: "/admin/interviews", icon: Mic },
  { title: "Conf. Secciones", href: "/admin/cv-configs", icon: Settings },
  { title: "Jobs", href: "/admin/jobs", icon: Activity },

];

export default function AppSidebar({
                                     userRole,
                                     initialUser,
                                     creditLimits
                                   }: {
  userRole?: string;
  initialUser: NavbarUser;
  creditLimits: CreditLimits;
}) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = userRole === "ADMIN";

  const user = initialUser;
  const {credits} = useCreditsStore();

  const creditsFinal: CreditLimits = {
    manageCvsLimit: credits?.manageCvsLimit ?? creditLimits.manageCvsLimit,
    aiActionsLimit: credits?.aiActionsLimit ?? creditLimits.aiActionsLimit,
    opportunitiesActionsLimit: credits?.opportunitiesActionsLimit ?? creditLimits.opportunitiesActionsLimit,
  }

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    if (path === "/my-cv" || path === "/my-cvs") return pathname === path;
    if (path === "/admin/plans") {
      return pathname.startsWith("/admin/plans") || pathname.startsWith("/admin/credit-packages");
    }
    return pathname.startsWith(path);
  };

  const renderNavItem = (
    item: { title: string; href: string; icon: any },
    activeStyle: string,
    inactiveStyle: string
  ) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
            isActive(item.href) ? activeStyle : inactiveStyle
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const primaryActive = "bg-primary text-secondary font-semibold shadow-sm hover:bg-primary";
  const primaryInactive = "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground";
  const adminActive = "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold shadow-sm border border-amber-500/20";
  const adminInactive = "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300";

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-r border-border z-30 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <SidebarContent className="flex flex-col h-full overflow-x-hidden">

        {/* LOGO SECTION */}
        <div className="flex items-center justify-center py-6 px-4 relative">
          <Link href="/dashboard" className="relative h-12 w-full max-w-[140px]">
            <Image src="/logo_light.png" alt="Levely" fill priority className="object-contain dark:hidden" />
            <Image src="/logo_dark.png" alt="Levely dark" fill priority className="hidden object-contain dark:block" />
          </Link>

          {/* Botón de cierre: solo visible en mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 hover:bg-accent"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Cerrar sidebar</span>
            </Button>
          )}
        </div>

        {/* WELCOME MESSAGE (From Navbar) */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 mb-4"
          >
            <h2 className="text-xl font-bold truncate">
              Hola, <span className="text-primary dark:text-levely-green">{user?.name?.split(" ")[0]}</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-tight">
              IA de Levely lista para ti.
            </p>
          </motion.div>
        )}

        <div className="px-2">
          <RouteSelector />
        </div>

        {/* ROUTE-SCOPED NAV */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Mi ruta</SidebarGroupLabel>
          <SidebarMenu>
            {routeNavItems.map((item) => renderNavItem(item, primaryActive, primaryInactive))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Gestión</SidebarGroupLabel>
          <SidebarMenu>
            {managementNavItems.map((item) => renderNavItem(item, primaryActive, primaryInactive))}
          </SidebarMenu>
        </SidebarGroup>

        {/* CREDITS INDICATOR (From Navbar) */}
        <div className={cn("px-4 py-2 transition-all", collapsed ? "flex justify-center" : "w-full")}>
          <CreditsIndicator limits={creditsFinal} />
        </div>



        {/* ADMIN NAV */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className={cn(collapsed ? "sr-only" : "text-amber-600 dark:text-amber-400 flex items-center gap-2")}>
              <Shield className="h-3.5 w-3.5" />
              Administración
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => renderNavItem(item, adminActive, adminInactive))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* FOOTER (Profile & Theme Toggle) */}
      <SidebarFooter className="flex flex-col overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Mi Cuenta</SidebarGroupLabel>
          <SidebarMenu>
            {accountNavItems.map((item) => renderNavItem(item, primaryActive, primaryInactive))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="border-t border-border bg-muted/10">
          <div className={cn("flex items-center justify-between gap-2 mt-2", collapsed ? "flex-col" : "flex-row")}>
            <div className="flex items-center gap-3 min-w-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ProfileButton user={user} />
              </motion.div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{user?.name || "Nombre"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || "nombre@gmail.com"}</p>
                </div>
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
        {/* ACCOUNT NAV */}
      </SidebarFooter>
    </Sidebar>
  );
}
