"use client";

import {redirect, useRouter} from "next/navigation";
import {Loader2} from "lucide-react";
import * as React from "react";
import {useEffect} from "react";

export default function RegisterPage() {

  const router = useRouter();
  useEffect(() => {
    router.push('/onboarding/talents');
  }, []);
  return (
    <div className="flex items-center justify-center h-[90vh] bg-muted/30 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Generando vista previa...</p>
      </div>
    </div>
  )

  // TODO: Commented for onboarding purposes
  // return (
  //   <div className="relative flex items-center justify-center min-h-screen">
  //     <div className="relative z-10">
  //
  //       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
  //         <div className="container mx-auto max-w-md">
  //           <div className="text-center mb-8">
  //             <h1 className="text-4xl font-bold mb-4">
  //               Crea tu <span className="text-gradient">cuenta gratis</span>
  //             </h1>
  //             <p className="text-muted-foreground">
  //               Empieza a construir tu CV profesional en minutos
  //             </p>
  //           </div>
  //           <Card className="p-8 bg-card shadow-glow">
  //             <RegisterForm />
  //           </Card>
  //         </div>
  //       </section>
  //     </div>
  //   </div>
  // );
}
