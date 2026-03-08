"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function LiveTranscript({ messages }: { messages: Message[] }) {
  // Solo mostramos los últimos 4 para no saturar
  const lastMessages = messages.slice(-4);

  return (
    <div className="w-full max-w-xl space-y-6">
      <AnimatePresence mode="popLayout">
        {lastMessages.map((msg, i) => (
          <motion.div
            key={i + msg.text}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1 - (lastMessages.length - 1 - i) * 0.2, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${msg.role === 'user' ? 'text-primary' : 'text-secondary-foreground/60'}`}>
              {msg.role === 'user' ? 'Candidato' : 'Reclutador AI'}
            </span>
            <div className={`
              px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed
              ${msg.role === 'user'
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-secondary/40 text-foreground backdrop-blur-sm border border-white/5 rounded-tl-none'}
            `}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
