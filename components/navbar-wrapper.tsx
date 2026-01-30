"use client";

import { usePathname } from "next/navigation";
import {NavbarPrivate} from "@/components/navbar-private";
import {CreditLimits} from "@/features/credits/actions/get-current-credits-limits";

interface NavbarWrapperProps {
  creditLimits: CreditLimits;
  user: any;
}

export function NavbarWrapper({ creditLimits, user }: NavbarWrapperProps) {
  const pathname = usePathname();

  // 👇 List of paths where you want to hide the navbar
  const hiddenPaths = ["/edit", "/preview"];

  // Check if current path matches any
  const shouldHide = hiddenPaths.some((p) => pathname.includes(p));

  if (shouldHide) return null;

  return <NavbarPrivate creditLimits={creditLimits} user={user} />;
}
