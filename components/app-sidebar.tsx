"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  Users,
  Rocket,
  Sparkles,
  GraduationCap, SparkleIcon
} from "lucide-react";
import Image from "next/image";

export default function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Mi Panel",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Mis CVs",
      href: "/cv",
      icon: SparkleIcon,
    },
    {
      title: "Mis Evaluaciones",
      href: "/evaluations",
      icon: Sparkles,
    },
    {
      title: "Oportunidades",
      href: "/opportunities",
      icon: Rocket,
    },
  ];

  return (
    <Sidebar variant="inset" side="left" collapsible="icon" className="peer border-r border-border bg-card">
      <SidebarHeader className="px-6">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-40 h-30">
            {/* Light mode */}
            <Image
              src="/logo_light.png"
              alt="Levely logo"
              fill
              priority
              className="block dark:hidden object-contain object-left"
            />

            {/* Dark mode */}
            <Image
              src="/logo_dark.png"
              alt="Levely logo dark"
              fill
              priority
              className="hidden dark:block object-contain object-left"
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground/50 mb-4 px-2">
            Carrera Profesional
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`h-11 rounded-xl transition-all duration-300 mb-1 group ${
                      active
                        ? "ai-gradient text-primary-foreground shadow-glow"
                        : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${active ? "text-white" : "group-hover:text-primary"}`} />
                      <span className="font-bold text-sm tracking-tight">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Sección de Comunidad/Admin (si aplica) */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground/50 mb-4 px-2">
            Comunidad
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-11 rounded-xl text-muted-foreground hover:text-primary transition-all"
              >
                <Link href="/users" className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm">Networking</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-4 opacity-50" />

      <SidebarFooter className="p-4">
        <SidebarMenu>
          {/* Card de Progresión sutil para universitarios */}
          <div className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-bold text-primary uppercase">Junior Pro</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full ai-gradient w-[65%]" />
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 font-medium">Completa tu perfil al 100%</p>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 rounded-xl text-muted-foreground hover:text-primary transition-all"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="font-bold text-sm">Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="mt-4 px-2 group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
              © 2026 Levely AI
            </p>
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
