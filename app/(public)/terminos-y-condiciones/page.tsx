"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
  <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-orange-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Términos y Condiciones
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <p>
              Bienvenido a nuestra plataforma. Estos Términos y Condiciones regulan el uso de nuestros servicios.
              Al utilizar nuestra aplicación, aceptas estas condiciones en su totalidad.
            </p>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Uso de la plataforma</h2>
              <p>
                La plataforma está destinada exclusivamente para fines personales y profesionales legítimos.
                No está permitido subir contenido ilegal, ofensivo o que infrinja los derechos de terceros.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Privacidad</h2>
              <p>
                La protección de tus datos es una prioridad para nosotros. Consulta nuestra{" "}
                <a href="/politica-de-privacidad" className="text-levely-blue font-bold dark:text-levely-dark hover:underline">
                  Política de Privacidad
                </a>{" "}
                para más información sobre cómo tratamos tus datos personales.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Propiedad Intelectual</h2>
              <p>
                Todo el contenido disponible en la plataforma, incluyendo texto, gráficos, logotipos y software,
                es propiedad de la compañía o de sus licenciantes y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Limitación de responsabilidad</h2>
              <p>
                No garantizamos que la plataforma esté libre de errores o interrupciones.
                No seremos responsables de ningún daño derivado del uso de nuestros servicios.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Cambios en los términos</h2>
              <p>
                Nos reservamos el derecho de actualizar estos términos en cualquier momento.
                Te notificaremos sobre cambios significativos mediante la plataforma o correo electrónico.
              </p>
            </section>
            
            <p className="mt-6 text-gray-600">
              Si tienes alguna pregunta sobre estos términos, por favor contacta con nuestro equipo de soporte.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
