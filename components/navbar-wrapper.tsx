"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import {CreditsOfPlan} from "@/features/billing/actions/get-available-tokens";

interface NavbarWrapperProps {
  creditsOfPlan: CreditsOfPlan;
  user: any;
}

export function NavbarWrapper({ creditsOfPlan, user }: NavbarWrapperProps) {
  const pathname = usePathname();

  // 👇 List of paths where you want to hide the navbar
  const hiddenPaths = ["/edit", "/preview"];

  // Check if current path matches any
  const shouldHide = hiddenPaths.some((p) => pathname.includes(p));

  if (shouldHide) return null;

  return <Navbar userLimit={creditsOfPlan} user={user} />;
}
