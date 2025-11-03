"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { LimitOfPlan } from "@/lib/shared/get-count-availables-attempts";

interface NavbarWrapperProps {
  needNewPayment: boolean;
  userLimit: LimitOfPlan;
  user: any;
}

export function NavbarWrapper({ needNewPayment, userLimit, user }: NavbarWrapperProps) {
  const pathname = usePathname();

  // 👇 List of paths where you want to hide the navbar
  const hiddenPaths = ["/edit", "/preview"];

  // Check if current path matches any
  const shouldHide = hiddenPaths.some((p) => pathname.includes(p));

  if (shouldHide) return null;

  return <Navbar needNewPayment={needNewPayment} userLimit={userLimit} user={user} />;
}
