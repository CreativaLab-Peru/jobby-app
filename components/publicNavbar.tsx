"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown, FileText, Mic2, Radar, BarChart3, Globe, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean;
}

const navItems = [
  { name: "CV Builder", href: "/cv-builder" },
  // { name: "Career Accelerator", href: "/career-accelerator" },
  { name: "Para universidades", href: "/universidades" },
  { name: "Newsletter", href: "/newsletter" },
  // { name: "Empresas", href: "/empresas" },
  // { name: "Resources", href: "/resources" },
];

const agentsItems = [
  {
    name: "Score de CV",
    href: "/herramientas/score",
    description: "71/100 por beca específica · mejoras exactas",
    icon: "BarChart3",
    badge: "Core",
  },
  {
    name: "Match de oportunidades",
    href: "/herramientas/match",
    description: "500+ becas y fellowships con % de compatibilidad",
    icon: "Globe",
  },
  {
    name: "Roadmap personalizado",
    href: "/herramientas/roadmap",
    description: "Plan exacto paso a paso hasta ganar",
    icon: "Map",
  },
];

const toolsItems = [
  {
    name: "CV Internacional",
    href: "/herramientas/cv-internacional",
    description: "Harvard · Europass en segundos · EN / ES",
    icon: "FileText",
  },
  {
    name: "Simulador de entrevistas",
    href: "/herramientas/entrevista",
    description: "Voz real · STAR + Learning · feedback instantáneo",
    icon: "Mic2",
  },
  {
    name: "Radar de oportunidades",
    href: "/herramientas/radar",
    description: "Embajadas y boletines internacionales en español",
    icon: "Radar",
    badge: "Nuevo",
  },
];

export default function PublicNavbar({ authenticated }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = React.useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = React.useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-levelyDark backdrop-blur-lg border-b border-border"
      style={{ viewTransitionName: "public-nav" }}
    >
      <div className="container-levely">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="relative h-30 w-20 lg:h-20 lg:w-30">
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

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Herramientas Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex items-center gap-2 transition-colors">
                Herramientas
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-0 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[20rem] z-50">
                <div className="p-3 space-y-4">
                  {/* Agentes IA */}
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Agentes IA
                    </div>
                    <div className="space-y-1 mt-1">
                      {agentsItems.map((tool, idx) => {
                        const IconComponent =
                          tool.icon === "BarChart3"
                            ? BarChart3
                            : tool.icon === "Globe"
                              ? Globe
                              : Map;
                        return (
                          <Link
                            key={idx}
                            href={tool.href}
                            className="flex gap-3 items-start p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="h-px bg-border/40 mx-2" />

                  {/* Herramientas IA */}
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Herramientas IA
                    </div>
                    <div className="space-y-1 mt-1">
                      {toolsItems.map((tool, idx) => {
                        const IconComponent =
                          tool.icon === "FileText"
                            ? FileText
                            : tool.icon === "Mic2"
                              ? Mic2
                              : Radar;
                        return (
                          <Link
                            key={idx}
                            href={tool.href}
                            className="flex gap-3 items-start p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-full tracking-colors ${
                    active
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {authenticated ? (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="cursor-pointer border border-gray-300 dark:border-gray-700 text-primary dark:text-primary-dark"
                >
                  <User className="mr-2 h-4 w-4" />
                  Ver mis CVs
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button className="cursor-pointer" variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>

                {/* Register dropdown (desktop) */}
                <div className="relative">
                  <div className="group">
                    <Link href="/onboarding/talents">
                      <Button variant="accent" size="default">
                        Empezar
                        {/*<ChevronDown className="ml-2 h-4 w-4" />*/}
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                setIsOpen((v) => !v);
                setMobileRegisterOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-4 space-y-3">
          {/* Mobile Herramientas Header / Accordion Trigger */}
          <div>
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className="w-full flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span>Herramientas</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Herramientas Collapsible Content */}
            {mobileToolsOpen && (
              <div className="mt-2 pl-2 border-l border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Agentes IA Section */}
                <div>
                  <div className="px-4 py-1 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Agentes IA
                  </div>
                  <div className="space-y-1 mt-2">
                    {agentsItems.map((tool, idx) => {
                      const IconComponent =
                        tool.icon === "BarChart3"
                          ? BarChart3
                          : tool.icon === "Globe"
                            ? Globe
                            : Map;
                      return (
                        <Link
                          key={idx}
                          href={tool.href}
                          onClick={() => setIsOpen(false)}
                          className="flex gap-3 items-start p-3 mx-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-snug">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Separador */}
                <div className="h-px bg-border/40 mx-4" />

                {/* Herramientas IA Section */}
                <div>
                  <div className="px-4 py-1 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Herramientas IA
                  </div>
                  <div className="space-y-1 mt-2">
                    {toolsItems.map((tool, idx) => {
                      const IconComponent =
                        tool.icon === "FileText"
                          ? FileText
                          : tool.icon === "Mic2"
                            ? Mic2
                            : Radar;
                      return (
                        <Link
                          key={idx}
                          href={tool.href}
                          onClick={() => setIsOpen(false)}
                          className="flex gap-3 items-start p-3 mx-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-snug">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile navigation */}
          <div className="border-t pt-3 space-y-1 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-2 text-sm
            ${
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            {authenticated ? (
              <Link href="/cv">
                <Button className="w-full" size="icon">
                  <User className="mr-2 h-4 w-4" />
                  Ver mis CVs
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground dark:text-secondary-dark hover:bg-primary/10 dark:hover:bg-secondary-dark/10"
                  >
                    Iniciar sesión
                  </Button>
                </Link>

                {/* Mobile register accordion */}
                <div>
                  <Link href="/onboarding/talents" className={"w-full"}>
                    <Button variant="accent" size="lg" className={"w-full"}>
                      Empezar
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
