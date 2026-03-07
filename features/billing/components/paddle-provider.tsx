"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type Paddle, initializePaddle, type Environments } from "@paddle/paddle-js"
import { authClient } from "@/lib/auth-client"

interface PaddleContextValue {
  paddle: Paddle | undefined
  openCheckout: (transactionId: string, customerEmail?: string) => void
}

const PaddleContext = createContext<PaddleContextValue>({
  paddle: undefined,
  openCheckout: () => {},
})

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    if (!token) return

    const isLiveToken = token.startsWith("live_")

    initializePaddle({
      token,
      environment: (isLiveToken ? "production" : "sandbox") as Environments,
      async eventCallback(event) {
        if (event.name === "checkout.completed") {
          const isNewUserCheckout = sessionStorage.getItem("paddle_new_user_checkout") === "1";
          sessionStorage.removeItem("paddle_new_user_checkout");

          if (isNewUserCheckout) {
            // Pago de cuenta nueva — cerrar sesión actual (si la hay) y pedir login
            await authClient.signOut();
            window.location.href = `${window.location.origin}/login?source=new_payment`;
            return;
          }

          const { data: session } = await authClient.getSession()
          if (session) {
            window.location.href = `${window.location.origin}/dashboard?payment=success`
          } else {
            window.location.href = `${window.location.origin}/login?source=new_payment`
          }
        }
      },
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance)
    })
  }, [])

  const openCheckout = (transactionId: string, customerEmail?: string) => {
    paddle?.Checkout.open({
      transactionId,
      ...(customerEmail ? { customer: { email: customerEmail } } : {}),
    })
  }

  return (
    <PaddleContext.Provider value={{ paddle, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  )
}

export function usePaddle() {
  return useContext(PaddleContext)
}
