"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ChevronDown, Star, User} from "lucide-react";
import {useState} from "react";
import Image from "next/image";
import {ThemeToggle} from "@/components/button-toggle-theme";
// import {ThemeToggleSwitch} from "@/components/button-toggle-theme";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean;
}

const NavbarPublic = ({authenticated}: HeaderProps) => {
const navItems = [
  { name: "CV Builder", href: "/cv-builder" },
  { name: "Career Accelerator", href: "/career-accelerator" },
  { name: "Partners", href: "/partners" },
  { name: "Empresas", href: "/empresas" },
  { name: "Resources", href: "/resources" },
];

export default function Header({ authenticated }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pro" aria-label="Ir a PRO">
              <Button
                className="relative group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary overflow-hidden">
                {/* Animated background shine */}
                <span className="absolute inset-0 pointer-events-none">
                  <span
                    className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                </span>

                {/* Star icon with subtle rotation */}
                <span
                  className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Star className="h-3.5 w-3.5 fill-current text-primary-foreground"/>
                </span>

                {/* Text content */}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="uppercase tracking-wider text-sm font-bold">
                    PRO
                  </span>
                  <span
                    className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-200">
                    Nuevo
                  </span>
                </span>

                {/* Subtle sparkle on hover */}
                <span
                  className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-75 group-hover:animate-ping"></span>
              </Button>
            </Link>
            <Link
              href="/empresas"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/empresas") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Para empresas
            </Link>
            <Link
              href="/instituciones"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/instituciones")
                ? "text-primary"
                : "text-foreground/80"
              }`}
            >
              Para instituciones
            </Link>
          </div>
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
          <ThemeToggle />

            {/* Login - dropdown on hover */}
            <div className="relative">
              <div className="group inline-block">
                {
                  authenticated ? (
                    <Link href="/cv">
                      <Button variant="outline" size="md" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4 inline-block"/>
                        Ver mis CV's
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="hover:cursor-pointer">
                        Iniciar sesión{" "}
                        {/*<ChevronDown className="ml-2 h-4 w-4 inline-block"/>*/}
                      </Button>
                    </Link>
                  )}
              </div>
            </div>
          {authenticated ? (
            <Link href="/cv">
                <Button variant="ghost" className="border border-gray-300 ">
                <User className="mr-2 h-4 w-4" />
                Ver mis CVs
                </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>

            {/* Register - dropdown on hover */}
            {
              !authenticated && (
                <div className="relative">
                  <div className="group inline-block">
                    <Button size="sm">
                      Regístrate{" "}
                      <ChevronDown className="ml-2 h-4 w-4 inline-block"/>
                    </Button>
              {/* Register dropdown (desktop) */}
              <div className="relative">
                <div className="group">
                  <Button>
                    Regístrate
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>

                    <div
                      className="absolute left-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <Link href="/onboarding/talents">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                        >
                          Regístrate como Talento
                        </Button>
                      </Link>
                      {/*<Link href="/register?role=empresa">*/}
                      {/*  <Button*/}
                      {/*    variant="ghost"*/}
                      {/*    size="sm"*/}
                      {/*    className="w-full justify-start mt-1"*/}
                      {/*  >*/}
                      {/*    Regístrate como Empresa*/}
                      {/*  </Button>*/}
                      {/*</Link>*/}
                    </div>
                  </div>
                </div>
              )
            }
          </div>

          {/* PRO Button (visible solo en móvil) */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link href="/pro" aria-label="Ir a PRO">
              <Button
                className="relative group inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary overflow-hidden">
                {/* Shine */}
                <span className="absolute inset-0 pointer-events-none">
                  <span
                    className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                </span>

                {/* Star icon */}
                <span
                  className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Star className="h-3 w-3 fill-current text-primary-foreground"/>
                </span>

                <span className="relative z-10 uppercase tracking-wider text-xs font-bold">
                  PRO
                </span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="relative w-10 h-10 flex flex-col justify-center items-center group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {/* Linea superior */}
              <span
                className={`block w-6 h-0.5 bg-foreground rounded-sm transition-all duration-300 ease-in-out ${mobileMenuOpen
                  ? "rotate-45 translate-y-1.5"
                  : "-translate-y-1.5"
                }`}
              ></span>

              {/* Linea del medio */}
              <span
                className={`block w-6 h-0.5 bg-foreground rounded-sm transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>

              {/* Linea inferior */}
              <span
                className={`block w-6 h-0.5 bg-foreground rounded-sm transition-all duration-300 ease-in-out ${mobileMenuOpen
                  ? "-rotate-45 -translate-y-1.5"
                  : "translate-y-1.5"
                }`}
              ></span>
            </button>
          </div>
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
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => {
            setIsOpen((v) => !v);
            setMobileRegisterOpen(false);
          }}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
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
                  <Button variant="ghost" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>

                {/* Mobile register accordion */}
                <div>
                  <button
                    onClick={() =>
                      setMobileRegisterOpen((v) => !v)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/10"
                  >
                    Regístrate
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileRegisterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

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
                </div>
              </div>

              <div>
                { !authenticated && (
                  <div
                    role="button"
                    tabIndex={0}
                    className="w-full text-left cursor-pointer"
                    onClick={() => setMobileRegisterOpen((s) => !s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setMobileRegisterOpen((s) => !s);
                      }
                    }}
                  >
                    <Link href="/onboarding/talents" aria-label="Registrate">
                      <Button size="sm" className="w-full justify-between">
                        Regístrate
                        {/*<ChevronDown*/}
                        {/*  className={`h-4 w-4 transition-transform ${mobileRegisterOpen ? "rotate-180" : ""*/}
                        {/*  }`}*/}
                        {/*/>*/}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarPublic;
}
