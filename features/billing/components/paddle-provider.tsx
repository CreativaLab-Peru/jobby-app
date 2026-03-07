"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type Paddle, initializePaddle, type Environments } from "@paddle/paddle-js"

interface PaddleContextValue {
  paddle: Paddle | undefined
  openCheckout: (transactionId: string) => void
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
      eventCallback(event) {
        if (event.name === "checkout.completed") {
          window.location.href = `${window.location.origin}/dashboard?payment=success`
        }
      },
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance)
    })
  }, [])

  const openCheckout = (transactionId: string) => {
    paddle?.Checkout.open({ transactionId })
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
