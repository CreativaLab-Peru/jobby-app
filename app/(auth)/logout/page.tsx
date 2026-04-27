"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {clearServerCache} from "@/features/authentication/actions/logout";
import { useTaskStore } from "@/store/use-task-store";

export default function LogoutPage() {
  const router = useRouter();
  const resetTasks = useTaskStore(state => state.reset);

  useEffect(() => {
    const logout = async () => {
      // 1. Cierra sesión en Better Auth (Limpia cliente y avisa al servidor)
      await authClient.signOut();

      // 2. Limpia la caché del servidor para que auth() devuelva null
      await clearServerCache();

      // 3. Limpia las tareas en segundo plano del store local
      resetTasks();

      // 4. Redirige
      router.push('/login');
      router.refresh(); // Fuerza a Next.js a re-evaluar la sesión actual
    }
    logout();
  }, [router, resetTasks]);

  return null;
}
