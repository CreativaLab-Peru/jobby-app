"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
  <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-orange-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Política de Privacidad
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <p>
              En nuestra plataforma, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal.
            </p>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Información que recopilamos</h2>
              <p>
                Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico y datos de tu perfil.
                También podemos recopilar datos de uso, como tu dirección IP y la actividad dentro de la plataforma.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Uso de la información</h2>
              <p>
                Utilizamos tu información para:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Proporcionar y mejorar nuestros servicios.</li>
                <li>Comunicarnos contigo sobre actualizaciones o cambios.</li>
                <li>Garantizar la seguridad de la plataforma.</li>
                <li>Cumplir con obligaciones legales.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Compartir información</h2>
              <p>
                No compartimos tu información personal con terceros, excepto:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cuando sea necesario para cumplir con la ley.</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma.</li>
                <li>Con tu consentimiento explícito.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Seguridad de los datos</h2>
              <p>
                Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados,
                pérdida o alteración. Sin embargo, ningún sistema es completamente seguro.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Tus derechos</h2>
              <p>
                Tienes derecho a acceder, corregir o eliminar tu información personal. También puedes solicitar la limitación de su uso
                o la portabilidad de tus datos.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios importantes a través
                de la plataforma o por correo electrónico.
              </p>
            </section>
            
            <p className="mt-6 text-gray-600">
              Si tienes dudas sobre esta política, por favor contáctanos en{" "}
              <a href="mailto:soporte@tuapp.com" className="text-levely-blue font-bold dark:text-levely-dark hover:underline">
                soporte@tuapp.com
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
