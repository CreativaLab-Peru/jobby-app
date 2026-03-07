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
  Briefcase,
  CreditCard,
  Settings,
  Users,
  Sparkles,
  BarChart3,
  Tag,
  Coins,
  Wallet,
} from "lucide-react";

const mainNavItems = [
  { title: "Mi Panel", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mis CVs", href: "/cv", icon: FileText },
  { title: "Mis Evaluaciones", href: "/evaluations", icon: MessageSquare },
  { title: "Oportunidades", href: "/opportunities", icon: Briefcase },
  { title: "Simulador de entrevistas", href: "/interviews", icon: Sparkles },
];

const adminNavItems = [
  { title: "Usuarios", href: "/admin/users", icon: Users },
  { title: "CVs", href: "/admin/cv", icon: FileText },
  { title: "Evaluaciones", href: "/admin/evaluations", icon: BarChart3 },
  { title: "Oportunidades", href: "/admin/opportunities", icon: Briefcase },
  { title: "Pagos", href: "/admin/payments", icon: CreditCard },
  { title: "Planes", href: "/admin/plans", icon: Tag },
  { title: "Paquetes", href: "/admin/credit-packages", icon: Coins },
  { title: "Balances", href: "/admin/balances", icon: Wallet },
];

const communityItems = [{ title: "Networking", href: "/networking", icon: Users }];

const bottomItems = [
  { title: "Créditos", href: "/credits", icon: CreditCard },
  { title: "Configuración", href: "/settings", icon: Settings },
];

export default function AppSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = userRole === "ADMIN";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  // Placeholder para plan y progreso de perfil
  const planName = "Starter";
  const profileProgress = 65;

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

        {/* Main Navigation */}
        <SidebarGroup className="flex-1 mt-2 border-0">
          <SidebarGroupLabel
            className={cn(
              "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
              collapsed && "sr-only",
            )}
          >
            Carrera Profesional
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary text-secondary font-semibold shadow-sm hover:bg-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {isAdmin &&
              adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                        isActive(item.href)
                          ? "bg-primary text-secondary font-semibold shadow-sm hover:bg-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Comunidad (placeholder, descomentar si hay lógica de plan) */}
        {/*<SidebarGroup>*/}
        {/*  <SidebarGroupLabel*/}
        {/*    className={cn(*/}
        {/*      "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",*/}
        {/*      collapsed && "sr-only",*/}
        {/*    )}*/}
        {/*  >*/}
        {/*    Comunidad*/}
        {/*  </SidebarGroupLabel>*/}
        {/*  <SidebarMenu>*/}
        {/*    {communityItems.map((item) => (*/}
        {/*      <SidebarMenuItem key={item.title}>*/}
        {/*        <SidebarMenuButton asChild>*/}
        {/*          <Link*/}
        {/*            href={item.href}*/}
        {/*            className={cn(*/}
        {/*              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",*/}
        {/*              isActive(item.href)*/}
        {/*                ? "bg-levely-blue dark:bg-levely-green text-white dark:text-levely-dark font-semibold"*/}
        {/*                : "text-muted-foreground hover:text-levely-blue hover:bg-levely-blue dark:hover:bg-secondary",*/}
        {/*            )}*/}
        {/*          >*/}
        {/*            <item.icon className="h-5 w-5 shrink-0" />*/}
        {/*            {!collapsed && <span>{item.title}</span>}*/}
        {/*          </Link>*/}
        {/*        </SidebarMenuButton>*/}
        {/*      </SidebarMenuItem>*/}
        {/*    ))}*/}
        {/*  </SidebarMenu>*/}
        {/*</SidebarGroup>*/}

        {/* Plan Badge y progreso (placeholder) */}
        {/*{!collapsed && (*/}
        {/*  <div className="mx-4 mb-4 p-4 rounded-xl bg-secondary/50 border border-border">*/}
        {/*    <div className="flex items-center gap-2 mb-2">*/}
        {/*      <div className="p-1.5 rounded-lg bg-levely-blue/10 dark:bg-levely-green/20">*/}
        {/*        <Sparkles className="h-4 w-4 text-levely-blue dark:text-levely-green" />*/}
        {/*      </div>*/}
        {/*      <span className="text-sm font-semibold uppercase tracking-wide">{planName}</span>*/}
        {/*    </div>*/}
        {/*    <p className="text-xs text-muted-foreground mb-2">Completa tu perfil al 100%</p>*/}
        {/*    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">*/}
        {/*      <div*/}
        {/*        className="h-full rounded-full transition-all duration-700"*/}
        {/*        style={{*/}
        {/*          width: `${profileProgress}%`,*/}
        {/*          background: "linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)"*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

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
