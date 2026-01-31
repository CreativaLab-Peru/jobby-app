"use client"

import { Button } from "@/components/ui/button"
import React from "react"

export default function VideoAnchorButton() {
  const handleClick = () => {
    const el = document.getElementById("video-demo")
    if (el) {
      const rect = el.getBoundingClientRect()
      const header = document.querySelector("header")
      const headerHeight = header ? header.getBoundingClientRect().height : 0

      // Calcular la posición objetivo para centrar el elemento en la ventana,
      // teniendo en cuenta el header fijo si existe.
      const visibleHeight = window.innerHeight - headerHeight
      const target = window.scrollY + rect.top + rect.height / 2 - visibleHeight / 2 - headerHeight

      // Asegurar un top válido
      const safeTarget = Math.max(0, Math.round(target))

      window.scrollTo({ top: safeTarget, behavior: "smooth" })
      history.replaceState(null, "", "#video-demo")
    } else {
      window.location.hash = "#video-demo"
    }
  }

  return (
    <Button className="cursor-pointer" variant="outline" size="lg" onClick={handleClick} aria-controls="video-demo">
      Ver ejemplo
    </Button>
  )
}
