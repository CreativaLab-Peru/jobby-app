"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import confetti from "canvas-confetti"

export function usePaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return

    // Lanzar confetti
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#7c3aed", "#a78bfa", "#f9a8d4", "#fbbf24", "#34d399"],
    })

    // Limpiar el query param de la URL sin recargar la página
    const params = new URLSearchParams(searchParams.toString())
    params.delete("payment")
    const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [searchParams, pathname, router])
}
