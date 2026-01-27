"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean;
}

const navItems = [
  { name: "CV Builder", href: "/cv-builder" },
  { name: "Career Accelerator", href: "/career-accelerator" },
  { name: "Partners", href: "/partners" },
  // { name: "Empresas", href: "/empresas" },
  { name: "Resources", href: "/resources" },
];

export default function Header({ authenticated }: HeaderProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-gray-300 dark:border-gray-700">
      {/* NAVBAR */}
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">

        {/* Logo */}
        <Link href="/" className="relative h-30 w-40 lg:h-40 lg:w-52">
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
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle className="text-muted-foreground dark:text-secondary-dark hover:bg-primary/10 dark:hover:bg-secondary-dark/10" />

          {authenticated ? (
            <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="border border-gray-300 dark:border-gray-700 text-primary dark:text-primary-dark"
                >
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

              {/* Register dropdown (desktop) */}
              <div className="relative">
                <div className="group">
                  <Link href="/register">
                    <Button>
                      Empezar
                      {/*<ChevronDown className="ml-2 h-4 w-4" />*/}
                    </Button>
                  </Link>  
                  {/*
                  <div
                    className="invisible absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border bg-background p-2 shadow-md
                               opacity-0 transition
                               group-hover:visible group-hover:opacity-100"
                  >
                    <Link href="/register?role=talento">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        Regístrate como Talento
                      </Button>
                    </Link>

                    <Link href="/register?role=empresa">
                      <Button
                        variant="ghost"
                        className="mt-1 w-full justify-start"
                      >
                        Regístrate como Empresa
                      </Button>
                    </Link>
                  </div>
                  */}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="px-4 flex justify-between items-center lg:hidden">
          <ThemeToggle className="text-muted-foreground dark:text-secondary-dark hover:bg-primary/10 dark:hover:bg-secondary-dark/10" />
          <button
            onClick={() => {
              setIsOpen((v) => !v);
              setMobileRegisterOpen(false);
            }}
            className="px-5 lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

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
                <Button className="w-full">
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
                  <Button
                    onClick={() =>
                      setMobileRegisterOpen((v) => !v)
                    }
                    className="w-full text-muted-foreground dark:text-black hover:bg-primary/10 dark:hover:bg-secondary-dark/10"
                  >
                    Empezar
                    {/*
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileRegisterOpen ? "rotate-180" : ""
                      }`}
                    />*/}
                  </Button>
                  {/*      
                  {mobileRegisterOpen && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/register?role=talento">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Como Talento
                        </Button>
                      </Link>

                      <Link href="/register?role=empresa">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Como Empresa
                        </Button>
                      </Link>
                    </div>
                  )}
                  */}  
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
