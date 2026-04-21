"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface UseAuthCtaRedirectOptions {
  authenticatedHref: string;
  unauthenticatedHref?: string;
}

export function useAuthCtaRedirect({
  authenticatedHref,
  unauthenticatedHref = "/onboarding/talents",
}: UseAuthCtaRedirectOptions) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [href, setHref] = useState(unauthenticatedHref);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        const nextHref = session?.user ? authenticatedHref : unauthenticatedHref;
        if (isMounted) setHref(nextHref);
      } catch {
        if (isMounted) setHref(unauthenticatedHref);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [authenticatedHref, unauthenticatedHref]);

  const goToCtaDestination = useCallback(() => {
    router.push(href);
  }, [router, href]);

  return {
    isLoading,
    href,
    goToCtaDestination,
  };
}
