"use client";

import { usePathname } from "next/navigation";
import {NavbarPrivate} from "@/components/navbar-private";

export function NavbarWrapper() {
  return <NavbarPrivate />;
}
