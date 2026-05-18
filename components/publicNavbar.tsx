"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean;
}

const navItems = [
  { name: "CV Builder", href: "/cv-builder" },
  // { name: "Career Accelerator", href: "/career-accelerator" },
  { name: "Partners", href: "/partners" },
  { name: "Newsletter", href: "/newsletter" },
  // { name: "Empresas", href: "/empresas" },
  // { name: "Resources", href: "/resources" },
];

interface ToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  section: "agents" | "tools";
}

const toolsItems: ToolItem[] = [
  // Agentes IA
  {
    id: "score",
    name: "Score de CV",
    description: "71/100 por beca específica · mejoras exactas",
    href: "#score",
    icon: "📊",
    badge: "Core",
    section: "agents",
  },
  {
    id: "match",
    name: "Match de oportunidades",
    description: "500+ becas y fellowships con % de compatibilidad",
    href: "#match",
    icon: "🌍",
    section: "agents",
  },
  {
    id: "roadmap",
    name: "Roadmap personalizado",
    description: "Plan exacto paso a paso hasta ganar",
    href: "#roadmap",
    icon: "🗺️",
    section: "agents",
  },
  // Herramientas IA
  {
    id: "cv",
    name: "CV Internacional",
    description: "Harvard · Europass en segundos · EN / ES",
    href: "#cv",
    icon: "📄",
    section: "tools",
  },
  {
    id: "entrevista",
    name: "Simulador de entrevistas",
    description: "Voz real · STAR + Learning · feedback instantáneo",
    href: "#entrevista",
    icon: "🎤",
    section: "tools",
  },
  {
    id: "radar",
    name: "Radar de oportunidades",
    description: "Embajadas y boletines internacionales en español",
    href: "#radar",
    icon: "📡",
    badge: "Nuevo",
    section: "tools",
  },
];

export default function PublicNavbar({ authenticated }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = React.useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = React.useState(false);
  const toolsDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    if (isToolsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isToolsDropdownOpen]);

  const agentsItems = toolsItems.filter((item) => item.section === "agents");
  const toolsOnlyItems = toolsItems.filter((item) => item.section === "tools");

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
            <div className="relative group" ref={toolsDropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-1 transition-colors ${
                  isToolsDropdownOpen
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                Herramientas
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isToolsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {isToolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-popover border border-border rounded-lg shadow-lg p-2 z-50">
                  {/* Agentes IA Section */}
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Agentes IA
                    </div>
                    <div className="space-y-1">
                      {agentsItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsToolsDropdownOpen(false)}
                          className="flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group/item"
                        >
                          <div className="text-2xl flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              {item.badge && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent flex-shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-border my-2" />

                  {/* Herramientas IA Section */}
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Herramientas IA
                    </div>
                    <div className="space-y-1">
                      {toolsOnlyItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsToolsDropdownOpen(false)}
                          className="flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group/item"
                        >
                          <div className="text-2xl flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              {item.badge && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent flex-shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font medium rounded-full tracking-colors ${
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
          {/* Mobile navigation - Tools accordion */}
          <div className="space-y-2">
            <button
              onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)}
              className={`w-full text-left rounded-lg px-4 py-2 text-sm flex items-center justify-between ${
                mobileRegisterOpen
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <span>Herramientas</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileRegisterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileRegisterOpen && (
              <div className="space-y-2 pl-4">
                {/* Agentes IA Section */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Agentes IA
                  </div>
                  <div className="space-y-2">
                    {agentsItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileRegisterOpen(false);
                        }}
                        className="flex gap-2 rounded-lg px-3 py-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{item.name}</span>
                            {item.badge && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs line-clamp-2">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Herramientas IA Section */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Herramientas IA
                  </div>
                  <div className="space-y-2">
                    {toolsOnlyItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileRegisterOpen(false);
                        }}
                        className="flex gap-2 rounded-lg px-3 py-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{item.name}</span>
                            {item.badge && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs line-clamp-2">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other mobile navigation items */}
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
