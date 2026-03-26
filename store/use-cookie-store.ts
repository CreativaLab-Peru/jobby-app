import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CookieState {
  hasAccepted: boolean;
  setAccepted: (value: boolean) => void;
}

export const useCookieStore = create<CookieState>()(
  persist(
    (set) => ({
      hasAccepted: false,
      setAccepted: (value) => set({ hasAccepted: value }),
    }),
    {
      name: 'levely-cookie-consent', // Nombre de la key en localStorage
    }
  )
);
