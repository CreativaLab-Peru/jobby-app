"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PublicPageTransition } from "@/components/shared/public-page-transition";

export default function TermsPage() {
  return (
    <PublicPageTransition>
      <div className="min-h-screen py-12 px-4 bg-gray-50/30 dark:bg-transparent text-gray-700 dark:text-gray-400">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border border-orange-100 dark:border-orange-900/30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-8 border-b border-orange-50 dark:border-orange-950/30">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                Términos y Condiciones
              </h1>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-400 font-sans">
                CREATIVA TALENT COMPANY S.A.C. – LEVELY
              </p>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
                <p>
                  La utilización de la plataforma www.jpinlevely.com ("Plataforma Levely") operada por CREATIVA TALENT COMPANY S.A.C., está sujeta a los presentes Términos y Condiciones está sujeta a los siguientes Términos y Condiciones. Pueden tener implicaciones en sus derechos y responsabilidades. Si no está de acuerdo con estos Términos y Condiciones, le solicitamos que se abstenga de utilizar Levely
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">2. DESCRIPCIÓN DEL SERVICIO</h2>
                <div className="space-y-4">
                  <p>
                    LEVELY es una plataforma tecnológica orientada a acelerar el desarrollo profesional y empleabilidad del talento mediante:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>Formación y programas educativos.</li>
                    <li>Mentorías especializadas.</li>
                    <li>Creación y optimización de CV y portafolios.</li>
                    <li>Matching laboral mediante inteligencia artificial.</li>
                    <li>Conexión con oportunidades laborales, académicas y empresariales.</li>
                    <li>Acceso a comunidades profesionales y programas internacionales.</li>
                  </ul>
                  <p>
                    LEVELY actúa como intermediario tecnológico entre talento, mentores, empresas y organizaciones aliadas. La plataforma no constituye agencia de empleo ni garantiza la obtención de oportunidades laborales o educativas.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">3. TIPOS DE USUARIOS</h2>
                <p className="mb-4">
                  LEVELY podrá contar con diferentes tipos de usuarios:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  <li>Talentos o participantes.</li>
                  <li>Mentores o expertos.</li>
                  <li>Empresas reclutadoras.</li>
                  <li>Instituciones educativas</li>
                  <li>Aliados estratégicos.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">4. REGISTRO Y VERACIDAD DE LA INFORMACIÓN</h2>
                <div className="space-y-4">
                  <p>
                    El usuario declara que:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>La información proporcionada es veraz y actualizada.</li>
                    <li>Posee capacidad legal para contratar servicios.</li>
                    <li>Mantendrá la confidencialidad de su cuenta.</li>
                  </ul>
                  <p>
                    LEVELY podrá suspender cuentas en caso de detectar información falsa o actividades fraudulentas.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">5. USO DE INTELIGENCIA ARTIFICIAL</h2>
                <div className="space-y-4">
                  <p>
                    LEVELY podrá emplear herramientas automatizadas para:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>Recomendación de oportunidades.</li>
                    <li>Análisis de perfiles profesionales.</li>
                    <li>Procesos de matching laboral o académico.</li>
                  </ul>
                  <p>
                    Los resultados generados por IA constituyen recomendaciones y no garantizan resultados específicos.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">6. SERVICIOS Y PLANES DE ACCESO</h2>
                <div className="space-y-4">
                  <p>
                    LEVELY podrá ofrecer:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>Servicios gratuitos.</li>
                    <li>Programas premium.</li>
                    <li>Mentorías pagadas.</li>
                    <li>Suscripciones o modelos por créditos.</li>
                  </ul>
                  <p>
                    Las condiciones económicas serán informadas previamente al usuario.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">7. POLÍTICA DE PAGOS Y CANCELACIONES</h2>
                <div className="space-y-4">
                  <p>
                    Los servicios contratados podrán estar sujetos a pago previo.
                  </p>
                  <p>
                    No se realizarán devoluciones, salvo cuando:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>El servicio no haya sido prestado.</li>
                    <li>Exista disposición legal aplicable.</li>
                    <li>Se establezcan condiciones específicas en programas o mentorías.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">8. RESPONSABILIDAD DEL USUARIO</h2>
                <p className="mb-4">
                  El usuario se compromete a:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  <li>Utilizar la plataforma de manera ética y legal.</li>
                  <li>No compartir credenciales de acceso.</li>
                  <li>No introducir software malicioso.</li>
                  <li>No utilizar la plataforma para actividades fraudulentas.</li>
                  <li>No copiar ni explotar contenidos o tecnología sin autorización.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">9. RELACIÓN CON EMPRESAS Y OPORTUNIDADES</h2>
                <div className="space-y-4">
                  <p>
                    LEVELY podrá facilitar el contacto entre usuarios y organizaciones externas.
                  </p>
                  <p>
                    LEVELY no es responsable de:
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    <li>Procesos de selección de terceros.</li>
                    <li>Decisiones de contratación.</li>
                    <li>Condiciones laborales ofrecidas por empleadores.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">10. PROPIEDAD INTELECTUAL</h2>
                <div className="space-y-4">
                  <p>
                    Todos los contenidos, diseños, software, algoritmos, marca LEVELY y herramientas tecnológicas son propiedad de CREATIVA TALENT COMPANY S.A.C.
                  </p>
                  <p>
                    Se prohíbe su reproducción o explotación sin autorización escrita.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">11. CAMBIOS EN LOS TÉRMINOS</h2>
                <div className="space-y-4">
                  <p>
                    Nos reservamos el derecho de realizar cambios en estos términos y condiciones en cualquier momento. Notificaremos a los usuarios sobre cambios significativos.
                  </p>
                  <p>
                    Al utilizar nuestros servicios, aceptas estos términos y condiciones. Para obtener más detalles sobre nuestra política de privacidad y otros aspectos, visita nuestras páginas correspondientes.
                  </p>
                </div>
              </section>

              <footer className="mt-8 pt-8 border-t border-orange-50 dark:border-orange-950/30 text-gray-600 dark:text-gray-500">
                <p className="text-xs italic">
                  Fecha de actualización: 20 de Diciembre de 2025
                </p>
              </footer>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageTransition>
  );
}
