"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/button-toggle-theme";

interface HeaderProps {
  authenticated: boolean;
}

const NavbarPublic = ({ authenticated }: HeaderProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      {/* NAVBAR */}
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Logo */}
        <Link href="/" className="relative h-10 w-32 lg:h-12 lg:w-40">
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
            <Button className="relative group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary overflow-hidden">
              <span className="absolute inset-0 pointer-events-none">
                <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              </span>
              <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Star className="h-3.5 w-3.5 fill-current text-primary-foreground" />
              </span>
              <span className="relative z-10 flex items-center gap-2">PRO</span>
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavbarPublic;
