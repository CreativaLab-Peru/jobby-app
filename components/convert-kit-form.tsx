"use client";

import { useEffect, useRef } from "react";

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
    const script = document.createElement("script");
    script.src = `https://levely.kit.com/${uid}/index.js`;
    script.async = true;
    script.setAttribute("data-uid", uid);

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
      id={`ck-wrapper-${uid}`}
      className={`
        w-full max-w-2xl mx-auto mt-6 flex justify-center
        
        /* 1. OCULTAR BASURA DE CONVERTKIT */
        [&_.formkit-label]:!hidden 
        [&_.formkit-powered-by]:!hidden
        [&_.formkit-guarantee]:!hidden

        /* 2. FORZAR ANCHOS AL 100% EN TODA LA CADENA DE DIVS */
        [&_.formkit-form]:!w-full [&_.formkit-form]:!max-w-full
        /* Buscamos cualquier div interno y le forzamos el ancho */
        [&_.formkit-form_div]:!w-full [&_.formkit-form_div]:!max-w-full
        [&_.formkit-field]:!w-full [&_.formkit-field]:!mb-0

        /* 3. EL GRID MÁGICO (Atacamos directo al contenedor de campos) */
        /* ConvertKit agrupa los inputs en .formkit-fields o [data-element="fields"] */
        [&_.formkit-fields]:!w-full
        [&_.formkit-fields]:!grid [&_.formkit-fields]:!grid-cols-1 sm:[&_.formkit-fields]:!grid-cols-2 
        [&_.formkit-fields]:!gap-4 
        
        /* Por si ConvertKit cambia el nombre de la clase, atacamos el atributo de data */
        [&_[data-element="fields"]]:!grid [&_[data-element="fields"]]:!grid-cols-1 sm:[&_[data-element="fields"]]:!grid-cols-2
        [&_[data-element="fields"]]:!gap-4

        /* 4. ESTILOS DE LOS INPUTS */
        [&_input]:!w-full [&_input]:!px-5 [&_input]:!py-4 [&_input]:!h-[56px]
        [&_input]:!rounded-lg [&_input]:!outline-none [&_input]:!transition-all
        
        /* MODO CLARO */
        [&_input]:!bg-white [&_input]:!text-slate-900 [&_input]:!border [&_input]:!border-slate-200
        [&_input]:placeholder:!text-slate-400
        
        /* MODO OSCURO */
        dark:[&_input]:!bg-[#13181d] dark:[&_input]:!text-slate-100 dark:[&_input]:!border-slate-800
        dark:[&_input]:placeholder:!text-slate-500/80
        
        /* EFECTO FOCUS */
        focus-within:[&_input]:!ring-2 focus-within:[&_input]:!ring-[#CEFF5E] focus-within:[&_input]:!border-transparent

        /* 5. ESTILOS DEL BOTÓN (Ocupar 2 columnas abajo) */
        /* Atacamos tanto al contenedor del botón como al botón mismo por si acaso */
        sm:[&_.formkit-submit]:!col-span-2 sm:[&_.formkit-submit]:!mt-2
        
        [&_button[type='submit']]:!w-full [&_button[type='submit']]:!py-4 [&_button[type='submit']]:!h-[56px]
        [&_button[type='submit']]:!rounded-lg [&_button[type='submit']]:!font-bold 
        [&_button[type='submit']]:!tracking-wide [&_button[type='submit']]:!uppercase
        [&_button[type='submit']]:!transition-transform [&_button[type='submit']]:active:!scale-[0.98]
        
        /* COLORES BOTÓN */
        [&_button[type='submit']]:!bg-[#CEFF5E] [&_button[type='submit']]:!text-[#111827] 
        hover:[&_button[type='submit']]:!bg-[#c2f54a]

        /* 6. ALERTAS (Éxito/Error) */
        sm:[&_.formkit-alert]:!col-span-2 [&_.formkit-alert]:!text-center 
        [&_.formkit-alert]:!text-sm [&_.formkit-alert]:!mt-2
        dark:[&_.formkit-alert]:!text-slate-300
      `}
    />
  );
}
