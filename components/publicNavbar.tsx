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

export default function PublicNavbar({ authenticated }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-levelyDark backdrop-blur-lg border-b border-border">
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
          {/* Mobile navigation */}
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
