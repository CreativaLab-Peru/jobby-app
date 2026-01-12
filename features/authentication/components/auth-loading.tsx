"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import {useEffect, useState} from "react";

export default function AuthLoading() {
  
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, []);
  
  if (!isMounted) {
    return null; // Prevents rendering on the server
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="inline-block"
          >
            <Loader2 className="w-16 h-16 text-blue-600" />
          </motion.div>
        </motion.div>
        
        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Verificando
        </motion.h1>
        
        {/* Puntos animados */}
        <div className="flex justify-center items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
        
        {/* Mensaje */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 mt-6 text-lg"
        >
          Por favor espera un momento...
        </motion.p>
      </div>
    </div>
  )
}
