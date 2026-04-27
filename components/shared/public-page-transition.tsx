import type { ReactNode } from "react";
import { ViewTransition } from "react";

interface PublicPageTransitionProps {
  children: ReactNode;
}

export function PublicPageTransition({ children }: PublicPageTransitionProps) {
  return (
    <ViewTransition 
      enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'fade-in' }} 
      exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'fade-out' }} 
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

