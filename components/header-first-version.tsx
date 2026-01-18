"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ChevronDown, Star, User} from "lucide-react";
import {useState} from "react";
import Image from "next/image";
import {ThemeToggleSwitch} from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean
}

const Header = ({authenticated}: HeaderProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-40 h-40">
              {/* Light mode */}
              <Image
                src="/logo_light.png"
                alt="Levely logo"
                fill
                priority
                className="block dark:hidden object-contain"
              />

              {/* Dark mode */}
              <Image
                src="/logo_dark.png"
                alt="Levely logo dark"
                fill
                priority
                className="hidden dark:block object-contain"
              />
            </div>
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



          {/* CTA Buttons with per-button hover dropdown (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Button toggle theme */}
            <ThemeToggleSwitch />

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

            {/* Register - dropdown on hover */}
            {
              !authenticated && (
                <div className="relative">
                  <div className="group inline-block">
                    <Button size="sm">
                      Regístrate{" "}
                      <ChevronDown className="ml-2 h-4 w-4 inline-block"/>
                    </Button>

                    <div
                      className="absolute left-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <Link href="/register?role=talento">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                        >
                          Regístrate como Talento
                        </Button>
                      </Link>
                      <Link href="/register?role=empresa">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start mt-1"
                        >
                          Regístrate como Empresa
                        </Button>
                      </Link>
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
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="text-center py-4 space-y-4">
            <Link
              href="/empresas"
              className="block text-sm font-medium text-foreground/80 hover:text-primary transform transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Para empresas
            </Link>
            <Link
              href="/instituciones"
              className="block text-sm font-medium text-foreground/80 hover:text-primary transform transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Para instituciones
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <div>
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full text-left cursor-pointer"
                  onClick={() => setMobileLoginOpen((s) => !s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setMobileLoginOpen((s) => !s);
                    }
                  }}
                >
                  {
                    !authenticated ? (
                      <Link href="/login">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setMobileRegisterOpen((s) => !s);
                            }
                          }}
                        >
                          Iniciar sesión
                        </Button>
                      </Link>

                    ) : (
                      <Link href="/cv">
                        <Button size="md" className="cursor-pointer w-full">
                          <User className="mr-2 h-4 w-4 inline-block"/>
                          Ver mis CV's
                        </Button>
                      </Link>
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
                    <Link href="/register" aria-label="Registrate">
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
