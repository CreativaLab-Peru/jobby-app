"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50/30 dark:bg-transparent text-gray-700 dark:text-gray-400">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-orange-100 dark:border-orange-900/30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 pb-8 border-b border-orange-50 dark:border-orange-950/30">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              POLÍTICA DE PRIVACIDAD
            </h1>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-400 font-sans">
              CREATIVA TALENT COMPANY S.A.C. – LEVELY
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-8 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">1. EXPOSICIÓN DE MOTIVOS</h2>
              <div className="space-y-4">
                <p>
                  CREATIVA TALENT COMPANY S.A.C. (en adelante, “LA EMPRESA”), reconoce la importancia
                  de proteger la información personal de sus usuarios, participantes, colaboradores,
                  mentores, postulantes, empresas aliadas, reclutadores e interesados en sus
                  servicios.
                </p>
                <p>
                  LA EMPRESA desarrolla, administra y opera la plataforma digital denominada LEVELY,
                  la cual constituye su marca comercial y ecosistema tecnológico orientado a la
                  formación, aceleración de talento digital, empleabilidad, mentorías especializadas,
                  matching laboral, programas educativos y vinculación con oportunidades
                  profesionales, académicas y empresariales.
                </p>
                <p>
                  En ese sentido, LA EMPRESA declara que cumple con sus obligaciones en materia de
                  protección de datos personales conforme a lo establecido en:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  <li>Ley N.º 29733 – Ley de Protección de Datos Personales del Perú.</li>
                  <li>Reglamento aprobado mediante Decreto Supremo N.º 016-2024-JUS.</li>
                  <li>Normativa complementaria vigente.</li>
                </ul>
                <p>
                  Con la finalidad de garantizar un tratamiento responsable, transparente y seguro de
                  los datos personales, se establece la presente Política de Privacidad.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">2. OBJETO</h2>
              <p className="mb-4">
                Regular el tratamiento, almacenamiento, recopilación, uso, transferencia y
                protección de los datos personales recopilados por LA EMPRESA a través de:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                <li>Plataforma LEVELY.</li>
                <li>Sitios web y micrositios.</li>
                <li>Aplicaciones digitales.</li>
                <li>Formularios físicos o virtuales.</li>
                <li>Programas educativos, mentorías, eventos o convocatorias.</li>
                <li>Servicios de matching laboral, académico o empresarial.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">3. ALCANCE</h2>
              <p className="mb-4">
                La presente política aplica a toda persona natural cuyos datos personales sean
                tratados por LA EMPRESA, incluyendo:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                <li>Usuarios registrados en LEVELY.</li>
                <li>Participantes de programas educativos o mentorías.</li>
                <li>Postulantes a oportunidades laborales, académicas o becas.</li>
                <li>Mentores, docentes, consultores o expertos.</li>
                <li>Empresas, reclutadores y organizaciones aliadas.</li>
                <li>Participantes en comunidades digitales o eventos.</li>
                <li>Visitantes de las plataformas digitales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">4. DEFINICIONES</h2>
              <ul className="space-y-4">
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Banco de datos personales: </strong>
                  Conjunto organizado de datos personales, automatizado o no, independientemente del soporte,
                  sea este físico, magnético, digital, óptico u otros que se creen, cualquiera fuere
                  la forma o modalidad de su creación, formación, almacenamiento, organización y
                  acceso. CREATIVA TALENT COMPANY S.A.C. declara que cuenta con bancos de datos
                  personales inscritos ante la Autoridad Nacional de Protección de Datos Personales,
                  y se mantiene en constante revisión y actualización de los mismos.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Datos personales: </strong>
                  Toda información sobre una persona natural que la identifica o la hace identificable, a través de medios que
                  pueden ser razonablemente utilizados.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Datos sensibles: </strong>
                  Datos personales constituidos por los datos biométricos que por sí mismos pueden identificar al
                  titular; datos referidos al origen racial y étnico; ingresos económicos; opiniones
                  o convicciones políticas, religiosas, filosóficas o morales; afiliación sindical,
                  e información relacionada a la salud o a la vida sexual.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Flujo transfronterizo de datos personales: </strong>
                  Transferencia internacional de datos personales a un destinatario situado en un país distinto al
                  país de origen de los datos personales, sin importar el soporte en que estos se
                  encuentren, los medios por los cuales se efectuó la transferencia ni el
                  tratamiento que reciban.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Principio de consentimiento: </strong>
                  En atención al principio de consentimiento, el tratamiento de los datos personales es lícito
                  cuando el titular del dato personal hubiere prestado su consentimiento libre,
                  previo, expreso, informado e inequívoco. No se admiten fórmulas de consentimiento
                  en las que este no sea expresado de forma directa, como aquellas en las que se
                  requiere presumir o asumir la existencia de una voluntad que no ha sido expresa.
                  Incluso el consentimiento prestado con otras declaraciones deberá manifestarse en
                  forma expresa y clara.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Titular de datos personales: </strong>
                  Persona natural a la que corresponde la información personal objeto de tratamiento.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-200">Tratamiento de datos personales: </strong>
                  Cualquier operación que permita recopilar, registrar, almacenar, conservar, consultar,
                  utilizar, bloquear, transferir o suprimir datos personales.
                </li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">5. DISPOSICIONES SOBRE EL TRATAMIENTO DE DATOS</h2>
              <p>
                LA EMPRESA podrá recopilar diferentes datos personales, a través de sus múltiples
                plataformas, incluidos los canales web, los cuales serán almacenados en los
                correspondientes bancos de datos, ubicados en su domicilio fiscal, y que han sido
                debidamente declarados a la Autoridad Nacional de Protección de Datos Personales,
                perteneciente al Ministerio de Justicia. Asimismo, CREATIVA TALENT COMPANY S.A.C.
                recopila información relacionada de las visitas realizadas por los usuarios en su
                página web y otras plataformas digitales de su titularidad para las finalidades
                indicadas en esta política. La información recopilada puede incluir detalles
                respecto a las subpáginas accedidas en el sitio web de CREATIVA TALENT COMPANY
                S.A.C. y las páginas externas que dirigieron al usuario a su página web, así como
                datos sobre el navegador utilizado y la ubicación geográfica del usuario. Esta
                información permite ofrecer una mejor experiencia de navegación y determinar
                aspectos tales como el formato a emplear en la página web, los productos y servicios
                que puede brindar de manera virtual, la solución de problemas que pueda presentar el
                sitio web para determinados usuarios y el constante mejoramiento de los servicios en
                línea. Cuando el usuario registra sus datos personales, de acuerdo con el
                requerimiento de los formularios del sitio web, garantiza que la información
                proporcionada es exacta, veraz y se encuentra vigente. En caso de proporcionar datos
                personales inexactos, erróneos o falsos, CREATIVA TALENT COMPANY S.A.C. no podrá
                ponerse en contacto con el usuario para cumplir con las finalidades para las que se
                tomaron estos.
              </p>

              <div className="pl-4 md:pl-6 border-l-2 border-orange-100 dark:border-orange-900/40 space-y-8">
                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">5.1 Datos que pueden recopilarse</h3>
                  <p>
                    En todos los casos, el consentimiento para el tratamiento de datos personales se
                    obtendrá de manera libre, previa, expresa inequívoca e informada. Estas
                    características son indispensables para que CREATIVA TALENT COMPANY S.A.C. pueda
                    dar tratamiento a los datos personales de los usuarios. Así pues, CREATIVA TALENT
                    COMPANY S.A.C. informará siempre al usuario, de manera previa a la recopilación de
                    sus datos personales, sobre las finalidades para las que estos serán tratados. El
                    usuario reconoce que, al aceptar los avisos correspondientes previstos en cada
                    formulario web, está otorgando su consentimiento expreso para que CREATIVA TALENT
                    COMPANY S.A.C. trate sus datos personales según las finalidades descritas en cada
                    formulario web y en esta política. Por medio de la publicación de la presente
                    política y su aceptación, el usuario otorga su consentimiento para que CREATIVA
                    TALENT COMPANY S.A.C. realice el tratamiento de sus datos personales, según las
                    finalidades complementarias de los formularios web y que se describen en esta
                    política.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">5.2 Finalidad del tratamiento de los datos personales</h3>
                  <p className="mb-4">
                    CREATIVA TALENT COMPANY S.A.C. comunica que los datos personales recopilados serán
                    tratados con las siguientes finalidades, dependiendo del perfil del usuario:
                  </p>
                  <ol className="space-y-4 list-none [counter-reset:finalidad]">
                    <li className="flex gap-4">
                      <span className="font-bold text-levely-dark dark:text-white flex-shrink-0 min-w-[1.5rem] before:[counter-increment:finalidad] before:content-[counter(finalidad,lower-alpha)')']" />
                      <div>
                        <strong className="block text-gray-900 dark:text-gray-200">Estudiantes y egresados:</strong>
                        <p>
                          Gestión académica y administrativa, seguimiento académico, otorgamiento de
                          certificados y constancias, acceso a bolsas de trabajo, difusión de actividades,
                          comunicaciones institucionales y oportunidades de networking.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-levely-dark dark:text-white flex-shrink-0 min-w-[1.5rem] before:[counter-increment:finalidad] before:content-[counter(finalidad,lower-alpha)')']" />
                      <div>
                        <strong className="block text-gray-900 dark:text-gray-200">Personal docente, mentores y administrativo:</strong>
                        <p>
                          Gestión contractual, pago de remuneraciones, evaluaciones de desempeño,
                          capacitaciones, bienestar laboral, cumplimiento de obligaciones legales y de
                          seguridad social.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-levely-dark dark:text-white flex-shrink-0 min-w-[1.5rem] before:[counter-increment:finalidad] before:content-[counter(finalidad,lower-alpha)')']" />
                      <div>
                        <strong className="block text-gray-900 dark:text-gray-200">Postulantes e interesados en las actividades de CREATIVA TALENT COMPANY S.A.C.</strong>
                        <p>
                          Gestión de inscripciones, envío de información sobre programas, eventos y
                          servicios, seguimiento de procesos de admisión y atención de consultas.
                        </p>
                      </div>
                    </li>
                  </ol>
                  <p className="mt-4">
                    Asimismo, CREATIVA TALENT COMPANY S.A.C. declara que, bajo ninguna circunstancia,
                    el tratamiento de los datos personales de sus usuarios se extenderá a una
                    finalidad distinta a aquellas para las que fueron recopiladas. De requerir tratar
                    los datos personales para un fin diferente o adicional para el que originalmente
                    se otorgó el consentimiento, CREATIVA TALENT COMPANY S.A.C. se contactará con el
                    usuario y obtendrá el consentimiento de este, de manera previa. Los datos
                    personales recopilados serán conservados por CREATIVA TALENT COMPANY S.A.C. por el
                    plazo máximo de sesenta (60) años, o el que se considere necesario para el
                    cumplimiento de las finalidades descritas, o por el tiempo que indique alguna
                    norma específica al respecto. Asimismo, los datos personales podrán ser cancelados
                    a solicitud del usuario, salvo que exista una disposición normativa que impida la
                    cancelación.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">5.3 Uso de inteligencia artificial</h3>
                  <p>LEVELY podrá utilizar sistemas automatizados y algoritmos de inteligencia artificial para:</p>
                  <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                    <li>Recomendar oportunidades laborales o educativas.</li>
                    <li>Analizar perfiles profesionales.</li>
                    <li>Optimizar procesos de matching.</li>
                  </ul>
                  <p className="mt-4">
                    Las decisiones finales relacionadas a contratación o admisión dependerán
                    exclusivamente de las organizaciones aliadas o empleadores.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">5.4 Transferencia de datos a terceros</h3>
                  <p>
                    Teniendo en cuenta las finalidades descritas y los perfiles de usuario, CREATIVA
                    TALENT COMPANY S.A.C. podrá compartir, ceder, encargar o transferir los datos
                    personales de los usuarios a universidades o instituciones educativas en el
                    territorio nacional y extranjero (con quienes mantenga un convenio o acuerdo de
                    colaboración en beneficio de sus estudiantes o comunidad universitaria);
                    asociaciones de egresados; ecosistema de emprendimientos, asociaciones sin fines
                    de lucro, Consorcio de Startups; potenciales empleadores y reclutadoras;
                    instituciones vinculadas a CREATIVA TALENT COMPANY S.A.C. para el cumplimiento de
                    sus fines y obligaciones legales y contractuales; instituciones que realizan:
                  </p>
                  <ol className="list-decimal list-outside ml-5 mt-3 space-y-2">
                    <li>Actividades de telemarketing para promover productos y servicios que ofrece
                      CREATIVA TALENT COMPANY S.A.C.
                    </li>
                    <li>Evaluaciones de financiamiento educativo y condiciones socioeconómicas.</li>
                    <li>Gestiones de cobranza.</li>
                    <li>Entrega (delivery) de documentación y otros artículos; e instituciones que
                      permitan a CREATIVA TALENT COMPANY S.A.C. cumplir con las finalidades precitadas
                      para cada perfil de usuario y en tanto el usuario no revoque la presente
                      autorización.
                    </li>
                  </ol>
                  <p className="mt-4">
                    CREATIVA TALENT COMPANY S.A.C., en cumplimiento de imperativos legales o de algún
                    requerimiento judicial o administrativo, puede encontrarse en la necesidad de
                    compartir los datos personales de sus usuarios con juzgados y otras autoridades
                    para cumplir con procedimientos judiciales o de requerimientos de una autoridad
                    pública.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">5.5 Transferencia internacional de datos</h3>
                  <p>
                    Los datos personales podrán ser transferidos a servidores o plataformas
                    tecnológicas ubicadas fuera del Perú cuando sea necesario para el funcionamiento
                    de LEVELY.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">5.6 Uso de imágenes y contenido audiovisual</h3>
                  <p>
                    En los eventos que organice o coorganice CREATIVA TALENT COMPANY S.A.C., el
                    usuario autoriza a CREATIVA TALENT COMPANY S.A.C. a utilizar su imagen (en
                    fotografía o video) en su portal institucional, redes sociales, afiches u otro
                    medio de difusión, y que su imagen sea parte de las actividades para la promoción
                    de las actividades y los eventos que se organicen. Las imágenes que recopile
                    CREATIVA TALENT COMPANY S.A.C. no reflejarán datos biométricos o sensibles.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">5.7 Menores de edad</h3>
                  <p>
                    En el caso de estudiantes, postulantes, interesados o cualquier menor de edad,
                    entre los catorce (14) y menores de dieciocho (18) años, que registre sus datos
                    personales en las plataformas de CREATIVA TALENT COMPANY S.A.C., declararán que
                    han leído esta política, que sus términos son comprensibles y, en función a ello,
                    otorgará su consentimiento para el uso y tratamiento de sus datos personales, de
                    conformidad con las finalidades y el perfil de usuario que corresponda. En el caso
                    de menores de catorce (14) años, CREATIVA TALENT COMPANY S.A.C. solicitará que los
                    padres o tutores legales sean quienes otorgan el consentimiento para el
                    tratamiento de los datos personales de los menores de edad que registren sus datos
                    en cualquiera de las plataformas o los formularios de CREATIVA TALENT COMPANY
                    S.A.C.; de lo contrario, CREATIVA TALENT COMPANY S.A.C. se encontrará
                    imposibilitada de realizar cualquier tipo de tratamiento de sus datos personales.
                    CREATIVA TALENT COMPANY S.A.C. implementará medidas razonables para verificar la
                    edad de quienes registren los datos personales, y garantizar que el contenido y
                    los servicios son apropiados.
                  </p>
                </section>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">6. MEDIDAS DE SEGURIDAD</h2>
              <p>
                CREATIVA TALENT COMPANY S.A.C. ha adoptado las medidas de seguridad exigidas por el
                ordenamiento jurídico vigente y se compromete a tratar los datos personales como
                información confidencial, a fin de prevenir e impedir el acceso o divulgación no
                autorizada y asegurar el uso apropiado de la información. La privacidad y la
                seguridad son consideraciones clave en la prestación de los servicios de CREATIVA
                TALENT COMPANY S.A.C.. Se han asignado responsabilidades específicas para abordar
                los asuntos relativos a privacidad y seguridad. Se harán cumplir las políticas
                internas y la guía a través de la elección apropiada de actividades, incluso la
                gestión de riesgos tanto proactiva como reactiva, la ingeniería de seguridad, la
                capacitación y las evaluaciones. Se tomarán las medidas apropiadas para abordar la
                seguridad en línea, la seguridad física, el riesgo de la pérdida de datos y otros
                similares, teniendo en cuenta el riesgo que representan el procesamiento y la
                naturaleza de los datos bajo protección. Además, el acceso a las bases de datos que
                contienen datos personales se restringe a las personas autorizadas que tengan
                necesidad de acceder a dicha información. CREATIVA TALENT COMPANY S.A.C. no se hace
                responsable sobre el riesgo de sustracción de información de datos personales que
                pueda ser realizada por terceros al momento que el usuario realice la transferencia
                de información hacia los servidores en los que se encuentra alojada la página web y
                las cuentas de correo electrónico de CREATIVA TALENT COMPANY S.A.C., ya sea que
                dicha transferencia se produzca a través de su computadora o dispositivo móvil.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">7. DERECHOS DE INFORMACIÓN, REVOCATORIA Y DERECHOS DE ACCESO, RECTIFICACIÓN, CANCELACIÓN Y OPOSICIÓN (ARCO)</h2>
              <div className="space-y-4">
                <p>
                  CREATIVA TALENT COMPANY S.A.C. pone a disposición de los usuarios la posibilidad de
                  ejercer sus derechos al amparo de la legislación vigente, mediante comunicación
                  escrita dirigida a la oficina de Data Intelligence de CREATIVA TALENT COMPANY
                  S.A.C..
                </p>
                <p>
                  Dicha solicitud se podrá obtener escribiendo a <a href="mailto:contacto@joinlevely.com" className="font-bold text-levely-dark dark:text-levely-green hover:underline">contacto@joinlevely.com</a>. Los usuarios
                  podrán ejercer cualquiera de los siguientes derechos:
                </p>
                <ol className="space-y-4 list-decimal list-outside ml-5">
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Información: </strong>Derecho del titular de datos
                    personales para ser informado sobre la finalidad para la cual sus datos personales
                    están siendo tratados, así como los destinatarios de los mismos y el banco de
                    datos donde se almacenan sus datos personales.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Revocatoria: </strong>El usuario podrá revocar su
                    consentimiento brindado para el tratamiento de sus datos personales en cualquier
                    momento, sin justificación previa y sin que le atribuyan efectos retroactivos.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Acceso: </strong>El usuario tiene derecho a obtener la
                    información relativa a sus datos personales objeto de tratamiento, así como la
                    forma, los motivos y las condiciones de su recopilación.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Rectificación:</strong>El usuario podrá solicitar la
                    corrección de aquellos datos que se encuentren errados o resulten inexactos o
                    falsos.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Cancelación: </strong>El usuario podrá solicitar la
                    supresión de sus datos personales de las bases de datos de CREATIVA TALENT COMPANY
                    S.A.C. cuando ya no sean necesarios o pertinentes para la finalidad para los que
                    fueron recopilados, el plazo para su tratamiento hubiere vencido, el usuario haya
                    revocado su consentimiento o cuando no sean tratados conforme a la legislación de
                    la materia.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-200">Oposición: </strong>El usuario tiene derecho a que no se
                    traten sus datos personales o se cese su tratamiento cuando no haya prestado su
                    consentimiento para el mismo o cuando estos se hubieran obtenido de una fuente de
                    acceso público. Cuando el usuario hubiera prestado su consentimiento, podrá
                    oponerse al tratamiento de sus datos por motivos fundados y legítimos. En caso el
                    usuario desee autorizar a una tercera persona para que ejerza los precitados
                    derechos, la solicitud deberá encontrarse acompañada de una carta poder con firma
                    legalizada.
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">8. EMPLEO DE COOKIES CREATIVA TALENT COMPANY S.A.C.</h2>
              <p>
                LEVELY podrá utilizar cookies para mejorar la experiencia del usuario, análisis
                estadístico y personalización de contenidos. Otorgará a la información obtenida por
                medio de cookies el mismo tratamiento que le brinda a la información de datos
                personales. Las finalidades de la recopilación de información a través de cookies
                son las mismas por las que se recolecta información personal. La información
                recopilada a través de cookies será transferida a terceros dentro de los mismos
                límites que la información personal. CREATIVA TALENT COMPANY S.A.C. mantendrá esta
                información segura, de acuerdo con la ley, y le otorgará también carácter de
                confidencial. Los usuarios cuentan con los mismos derechos sobre la información
                recogida por medio de cookies, así como sobre aquellos datos personales otorgados
                directamente. Los usuarios se encuentran en la capacidad de deshabilitar la mayoría
                de cookies que son enviadas a las computadoras y los dispositivos móviles por medio
                del cambio de las configuraciones predispuestas para sus navegadores y sistemas
                operativos. Deshabilitar las cookies en su navegador puede originar que la página
                web de CREATIVA TALENT COMPANY S.A.C. no ofrezca contenido personalizado a sus
                usuarios.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">9. PLATAFORMAS DIGITALES DE CREATIVA TALENT COMPANY S.A.C.</h2>
              <p>
                CREATIVA TALENT COMPANY S.A.C. declara que esta política es aplicable a todos los
                sitios y micrositios web de su titularidad.
              </p>

              <div className="pl-4 md:pl-6 border-l-2 border-orange-100 dark:border-orange-900/40 space-y-8">
                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">9.1. Blogs o foros</h3>
                  <p>
                    CREATIVA TALENT COMPANY S.A.C. no se hace responsable de las publicaciones
                    realizadas por los usuarios dentro de sus blogs o foros. Las opiniones registradas
                    en los blogs o foros no reflejan la posición de CREATIVA TALENT COMPANY S.A.C. y
                    son responsabilidad únicamente del usuario que realizó la publicación. Asimismo,
                    CREATIVA TALENT COMPANY S.A.C. no se hará responsable de los daños y perjuicios
                    causadas por las publicaciones hechas por los usuarios en sus blogs o foros que
                    pudieran ocasionar la reproducción, distribución, publicación de fotos, videos o
                    comentarios que se encuentren bajo la protección de los derechos de propiedad
                    intelectual de terceros. Los usuarios ceden, a favor de CREATIVA TALENT COMPANY
                    S.A.C., los derechos que estos tuviesen sobre sus comentarios, fotos o videos
                    publicados en los blogs o foros. CREATIVA TALENT COMPANY S.A.C. puede emplear la
                    información para los fines que considere pertinentes. CREATIVA TALENT COMPANY
                    S.A.C. se reserva el derecho de eliminar a su discreción aquellas publicaciones
                    que se hagan en sus foros, blogs y el contenido que se encuentre en su página web
                    sin previo aviso.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">9.2. Redes sociales</h3>
                  <p>
                    CREATIVA TALENT COMPANY S.A.C. hace empleo de las redes sociales para otorgar una
                    experiencia de navegación completa a sus usuarios; sin embargo, no se hace
                    responsable de la información contenida en las redes sociales a las que el usuario
                    pueda acceder por medio de la página web de CREATIVA TALENT COMPANY S.A.C.. Las
                    redes sociales de las que participan tanto CREATIVA TALENT COMPANY S.A.C. como el
                    usuario cuentan con sus propias políticas de privacidad que los usuarios de tales
                    redes tendrían que conocer y adherirse, según corresponda. Por las mencionadas
                    razones, se recomienda revisar las Políticas de Privacidad de las redes sociales
                    para asegurarse encontrarse de acuerdo con estas. Asimismo, CREATIVA TALENT
                    COMPANY S.A.C. se libera de toda responsabilidad que pueda ocasionar el incorrecto
                    funcionamiento o el inadecuado uso de las redes sociales, la falsedad del
                    contenido y la ilicitud de la forma en que este fue obtenido, así como de los
                    daños y perjuicios que se pudieran generar por las publicaciones en estas redes,
                    siendo los únicos responsables los usuarios de la red social en la que hayan
                    realizado tales acciones.
                  </p>
                </section>

                <section>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">9.3. Otros sitios web</h3>
                  <p>
                    CREATIVA TALENT COMPANY S.A.C. declara que sus sitios y micrositios web podrían
                    incluir enlaces a páginas web que no son de su titularidad, que no controla, ni
                    mantiene. Por ello, no se responsabiliza de las políticas de privacidad, o
                    prácticas en materia de datos personales, de aquellas páginas web que no son de su
                    titularidad. Siendo así, el titular de los datos personales es responsable de
                    informarse sobre las medidas de protección y políticas de privacidad, en temas de
                    datos personales, de aquellas páginas web.
                  </p>
                </section>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">10. NOTIFICACIÓN DE INCIDENTES DE SEGURIDAD</h2>
              <p>
                En aquellos casos en que CREATIVA TALENT COMPANY S.A.C. detecte un incidente de
                seguridad sobre los datos personales, cumplirá con informar este hecho a la oficina
                designada por la Autoridad Nacional de Protección Datos Personales. Del mismo modo,
                CREATIVA TALENT COMPANY S.A.C. informará al titular de los datos personales sobre el
                incidente, así como las medidas para mitigar sus efectos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">11. LEGISLACIÓN APLICABLE</h2>
              <p>
                Las Políticas de Privacidad se rigen y se interpretan de acuerdo con las leyes vigentes en la República del Perú, sujetándose a la competencia y jurisdicción de los Jueces y Tribunales de Lima, Perú.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">12. MODIFICACIONES</h2>
              <p>
                CREATIVA TALENT COMPANY S.A.C. se reserva el derecho de realizar los cambios que considere pertinentes a su Política de Privacidad en cualquier momento, razón por la cual se invita a revisar esta política periódicamente. Al hacer clic en “acepto” (marcar un aspa en el cuadro o una acción similar), se reconoce haber leído y comprendido los puntos señalados en la presente política. En consecuencia, esta aceptación se entiende como el otorgamiento del consentimiento al tratamiento de los datos personales para los fines que se especificaron en los párrafos anteriores. Si se tiene alguna duda, comentario o pregunta relacionada a la Política de Privacidad, o alguno de los puntos que maneja, se invita a contactar a CREATIVA TALENT COMPANY S.A.C.:
              </p>
            </section>



            <footer className="mt-8 pt-8 border-t border-orange-50 dark:border-orange-950/30 space-y-2 text-gray-600 dark:text-gray-500">
              <p>
                <strong className="text-gray-900 dark:text-gray-300 font-semibold">Dirección:</strong> PSJE WISPAMPA 439 INTERIOR - DISTRITO DE SAN SEBASTIAN, PROVINCIA Y DEPARTAMENTO DEL CUSCO.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-300 font-semibold">Teléfono:</strong> +51986848128.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-300 font-semibold">Email:</strong>{" "}
                <a href="mailto:contacto@joinlevely.com"
                   className="text-levely-dark dark:text-levely-green font-bold dark:text-levely-dark hover:underline">
                  contacto@joinlevely.com
                </a>
              </p>
              <p className="text-xs pt-4 italic">
                Fecha de actualización: 1 de diciembre de 2025
              </p>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
