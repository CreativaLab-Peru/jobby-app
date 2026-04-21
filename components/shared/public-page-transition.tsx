import type { ReactNode } from "react";
import { ViewTransition } from "react";

interface PublicPageTransitionProps {
  children: ReactNode;
}

export function PublicPageTransition({ children }: PublicPageTransitionProps) {
  return (
    <ViewTransition enter="scale-in" exit="scale-out" default="none">
      {children}
    </ViewTransition>
  );
}
