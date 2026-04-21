import type { ReactNode } from "react";
import { ViewTransition } from "react";

interface PublicPageTransitionProps {
  children: ReactNode;
}

export function PublicPageTransition({ children }: PublicPageTransitionProps) {
  return (
    <ViewTransition enter="fade-in" exit="fade-out" default="none">
      {children}
    </ViewTransition>
  );
}

