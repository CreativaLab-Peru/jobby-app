"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface AIAvatarProps {
  isSpeaking: boolean;
  isConnected: boolean;
}

export function AIAvatar({ isSpeaking, isConnected }: AIAvatarProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ondas de choque cuando habla */}
      {isSpeaking && (
        <>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute w-48 h-48 rounded-full border border-primary/50"
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
            className="absolute w-48 h-48 rounded-full border border-primary/30"
          />
        </>
      )}

      {/* Orbe Central Personalizado */}
      <div className={`
        relative z-10 w-40 h-40 rounded-[3rem] border-4 flex items-center justify-center transition-all duration-700
        ${isSpeaking ? 'border-primary bg-primary/20 shadow-[0_0_50px_rgba(var(--primary),0.4)]' : 'border-secondary bg-secondary/10'}
        ${!isConnected && 'grayscale opacity-50'}
      `}>
        <Bot className={`w-16 h-16 ${isSpeaking ? 'text-primary' : 'text-secondary-foreground'} transition-colors`} />

        {/* Indicador de "Pensando/Escuchando" */}
        {isConnected && (
          <div className="absolute -bottom-2 px-3 py-1 bg-background border border-border rounded-full shadow-lg">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary animate-pulse">
              {isSpeaking ? "IA Hablando" : "Escuchando..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
