"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Define el array de blobs fuera del componente para evitar regeneración
const blobs = Array.from({ length: 4 });

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {blobs.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[140px] mix-blend-soft-light"
          style={{
            width: 600,
            height: 600,
            background: `radial-gradient(circle at center, 
              hsl(var(--primary) / 0.15) 0%, 
              transparent 70%
            )`,
            top: `${15 + i * 20}%`,
            left: `${i % 2 === 0 ? "10%" : "65%"}`,
            filter: i % 3 === 1 ? 'hue-rotate(180deg)' : i % 3 === 2 ? 'hue-rotate(280deg)' : 'none',
          }}
          animate={{
            y: [0, 80, 0],
            x: [0, i % 2 === 0 ? 40 : -40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}