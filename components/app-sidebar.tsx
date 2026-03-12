"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  MessageSquareWarning,
  Activity,
  Briefcase,
  CreditCard,
  Settings,
  Users,
  BarChart3,
  Tag,
  Wallet,
  Mic,
  Shield,
  Receipt,
  Sliders,
  Map,
} from "lucide-react";
import { RouteSelector } from "@/features/routes/components/route-selector";

// Items scoped to the active route (the core journey)
const routeNavItems = [
  { title: "Mi Ruta", href: "/dashboard", icon: LayoutDashboard },
  { title: "CV", href: "/my-cv", icon: FileText },
  { title: "Análisis", href: "/my-evaluation", icon: MessageSquare },
  { title: "Oportunidades", href: "/my-opportunities", icon: Briefcase },
  { title: "Roadmaps", href: "/my-roadmaps", icon: Map },
];

// Account-level items (not route-scoped)
const accountNavItems = [
  { title: "Créditos", href: "/credits", icon: CreditCard },
  { title: "Transacciones", href: "/transactions", icon: Receipt },
  { title: "Preferencias", href: "/preferences", icon: Sliders },
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
  { title: "Jobs", href: "/admin/jobs", icon: Activity },
  { title: "Entrevistas", href: "/admin/interviews", icon: Mic },
];

const bottomItems = [
  { title: "Configuración", href: "/settings", icon: Settings },
];

export default function AppSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = userRole === "ADMIN";

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    if (path === "/admin/plans") {
      return pathname.startsWith("/admin/plans") || pathname.startsWith("/admin/credit-packages");
    }
    return pathname.startsWith(path);
  };

  const renderNavItem = (
    item: { title: string; href: string; icon: React.ComponentType<{ className?: string }> },
    activeStyle: string,
    inactiveStyle: string,
  ) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
            isActive(item.href) ? activeStyle : inactiveStyle,
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

  const adminActive =
    "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold shadow-sm border border-amber-500/20 hover:bg-amber-500/15";
  const adminInactive =
    "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300";

  return (
    <Sidebar className={cn("border-r border-border z-30", collapsed ? "w-16" : "w-64")}>
      <SidebarContent className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center mt-3">
          <Link href="/dashboard" className="relative h-16 w-36">
            <Image
              src="/logo_light.png"
              alt="Levely"
              fill
              priority
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo_dark.png"
              alt="Levely dark"
              fill
              priority
              className="hidden object-contain dark:block"
            />
          </Link>
        </div>

        {/* Route Selector */}
        <RouteSelector />

        {/* Route-scoped Navigation */}
        <SidebarGroup className="flex-1 mt-1 border-0">
          <SidebarGroupLabel
            className={cn(
              "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
              collapsed && "sr-only",
            )}
          >
            Ruta Activa
          </SidebarGroupLabel>
          <SidebarMenu>
            {routeNavItems.map((item) =>
              renderNavItem(item, primaryActive, primaryInactive),
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Account Navigation */}
        <SidebarGroup className="border-0">
          <SidebarGroupLabel
            className={cn(
              "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
              collapsed && "sr-only",
            )}
          >
            Mi Cuenta
          </SidebarGroupLabel>
          <SidebarMenu>
            {accountNavItems.map((item) =>
              renderNavItem(item, primaryActive, primaryInactive),
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup className="border-0">
            <SidebarGroupLabel
              className={cn(
                "px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2",
                collapsed ? "sr-only" : "text-amber-600 dark:text-amber-400",
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              Administración
            </SidebarGroupLabel>
            {!collapsed && (
              <div className="mx-3 mb-1 h-px bg-amber-500/20 dark:bg-amber-400/20" />
            )}
            <SidebarMenu>
              {adminNavItems.map((item) =>
                renderNavItem(item, adminActive, adminInactive),
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Bottom Navigation */}
        <SidebarFooter className="border-t border-border">
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      isActive(item.href)
                        ? "bg-levely-green text-levely-dark font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
