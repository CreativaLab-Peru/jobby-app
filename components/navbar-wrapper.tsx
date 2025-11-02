"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { LimitOfPlan } from "@/lib/shared/get-count-availables-attempts";

interface NavbarWrapperProps {
  hasSubscription: boolean;
  userLimit: LimitOfPlan;
  user: any;
}

export function NavbarWrapper({ hasSubscription, userLimit, user }: NavbarWrapperProps) {
  const pathname = usePathname();

  // 👇 List of paths where you want to hide the navbar
  const hiddenPaths = ["/edit", "/preview"];

  // Check if current path matches any
  const shouldHide = hiddenPaths.some((p) => pathname.includes(p));

  if (shouldHide) return null;

  return <Navbar hasSubscription={hasSubscription} userLimit={userLimit} user={user} />;
}
