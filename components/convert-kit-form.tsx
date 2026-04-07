'use client';

import { useEffect, useRef } from 'react';

interface ConvertKitProps {
  uid: string;
}

export default function ConvertKitForm({ uid }: ConvertKitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Evitar duplicados si el script ya existe
    const existingScript = document.querySelector(`script[data-uid="${uid}"]`);
    if (existingScript) {
      // Si ya existe, ConvertKit a veces necesita re-inicializarse
      // pero usualmente basta con no hacer nada si ya se renderizó.
      return;
    }

    // 2. Crear el elemento script manualmente
    const script = document.createElement('script');
    script.src = `https://levely.kit.com/${uid}/index.js`;
    script.async = true;
    script.setAttribute('data-uid', uid);

    // 3. Inyectarlo en el contenedor específico
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Limpieza opcional al desmontar
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [uid]);

  return (
    <div
      ref={containerRef}
      className="min-h-[150px] w-full my-1 justify-center text-red-500"
      id={`ck-wrapper-${uid}`}
    >
      {/* El script se inyectará aquí y ConvertKit pondrá el form justo al lado */}
    </div>
  );
}
