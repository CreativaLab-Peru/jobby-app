"use client";

import {MENTORIA_PRICE} from "../types/mentoria";
import Image from "next/image";

interface MentoriaLandingScreenProps {
  onStart: () => void;
  requestStatus?: "sent" | "error";
}

// ── Icon components ──────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Stats ───────────────────────────────────────────────────────────────────

const MENTORIA_STATS = [
  {value: "60", label: "minutos de sesión personalizada"},
  {value: "10", label: "universidades y programas para tu perfil"},
  {value: "$80k", label: "cubre Chevening en matrícula, vuelo y más"},
  {value: "1:1", label: "con quien ya pasó por el proceso"},
];

// ── Para quién bullets ───────────────────────────────────────────────────────

const PARA_QUIEN_BULLETS = [
  "Quieres estudiar una maestría fuera con una beca que cubra todo...",
  "Escuchaste hablar de Chevening, Fulbright o DAAD pero nunca tuviste a alguien que te explicara...",
  "No sabes si tu perfil alcanza, qué becas existen para alguien como tú...",
  "Tienes experiencia real — trabajo, voluntariado, proyectos. Solo necesitas que alguien te ayude a leerla...",
];

// ── Features (60 minutos) ───────────────────────────────────────────────────

const MENTORIA_FEATURES = [
  {
    emoji: "🔍",
    title: "Revisión humana de tu perfil",
    body: "Analizamos tu experiencia, formación y metas para identificar exactamente qué becas aplican a tu caso."
  },
  {
    emoji: "🎓",
    title: "Las becas reales que existen para vos",
    body: "Identificamos cuáles aplican a tu caso específico y por qué."
  },
  {
    emoji: "🗺️",
    title: "Tus 10 mejores universidades UK",
    body: "Seleccionadas en sesión según tu área y perfil académico."
  },
  {
    emoji: "⚙️",
    title: "Cómo funciona el proceso — de verdad",
    body: "Qué documentos piden, en qué orden, qué fechas importan."
  },
  {
    emoji: "✉️",
    title: "Cartas y ensayos: qué piden y cómo enfocarlos",
    body: "Revisamos cuáles documentos necesitás y cómo estructurar cada uno."
  },
  {
    emoji: "💬",
    title: "Grupo privado de WhatsApp",
    body: "Acceso exclusivo al grupo de asesorados Levely para resolver dudas."
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────

const MENTORIA_TESTIMONIALS = [
  {
    quote: "No sabía cómo conectar mi experiencia con lo que pedía el programa...",
    name: "Mónica Díaz",
    location: "Lima, Perú",
    badge: "Próximamente con Erasmus Mundus",
  },
  {
    quote: "Siempre pensé que mi perfil técnico no encajaba con lo que buscan estas becas...",
    name: "Andy Marcelo",
    location: "Cusco, Perú",
    badge: "Próximamente con Erasmus Mundus",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function MentoriaLandingScreen({onStart, requestStatus}: MentoriaLandingScreenProps) {
  const [priceInt, priceDec] = String(MENTORIA_PRICE).split(".");

  return (
    <div
      className="min-h-screen text-[#f0ede4] flex flex-col"
      style={{fontFamily: "'Inter', sans-serif"}}
    >
      {/* ── Nav ── */}
      <nav
        className="flex justify-between items-center px-6 md:px-12 py-[18px] border-b border-white/[.06] bg-[#0a0f0c]">
        <span
          className="text-[#c9f563] text-[22px] font-bold italic"
          style={{fontFamily: "'Fraunces', serif"}}
        >
          levely
        </span>
        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#c9f563] text-[#0a0f0c] rounded-full text-[13px] font-semibold hover:bg-[#b8e050] transition-colors"
        >
          Solicitar sesión
        </button>
      </nav>

      {/* ── Avisos de Estado (requestStatus) ── */}
      {requestStatus && (
        <div className="bg-[#0a0f0c] px-6 md:px-12 pt-4">
          <div className="max-w-5xl mx-auto">
            {requestStatus === "sent" && (
              <div
                className="flex items-center gap-3 bg-[#0d1a17] border border-[#c9f563]/30 text-[#c9f563] rounded-xl p-4 text-[14px]">
                <span className="text-lg">✨</span>
                <div>
                  Recibimos tu solicitud. Revisa tu correo para confirmar tu sesión de mentoría 1:1
                  con Dara Mariluz.
                </div>
              </div>
            )}
            {requestStatus === "error" && (
              <div
                className="flex items-center gap-3 bg-[#2a0f0f] border border-red-500/30 text-red-400 rounded-xl p-4 text-[14px]">
                <span className="text-lg">⚠️</span>
                <div>
                  <strong className="font-semibold">Hubo un problema.</strong> No pudimos enviar tu
                  solicitud. Por favor, vuelve a intentarlo o recarga la página.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Hero (dark bg) ── */}
      <section className="bg-[#0a0f0c] px-6 md:px-12 pt-10 md:pt-16 pb-14">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-px bg-[#c9f563]"/>
            <span
              className="text-[11px] font-semibold tracking-[.12em] uppercase text-[rgba(240,237,228,.45)]">
              Mentoría 1:1 · Levely
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[40px] md:text-[52px] font-black leading-[1.05] tracking-[-1.5px] mb-6 max-w-2xl"
            style={{fontFamily: "'Fraunces', serif"}}
          >
            En 60 minutos,<br/>
            la ruta exacta<br/>
            a tu beca<br/>
            <em className="text-[#c9f563]">internacional.</em>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] leading-[1.65] text-[rgba(240,237,228,.55)] max-w-xl mb-10">
            Sesión personalizada con <strong className="text-[rgba(240,237,228,.85)] font-medium">Dara
            Mariluz</strong>, fundadora de Levely. Alguien que ya pasó por el proceso y sabe
            exactamente qué necesitas para ganar.
          </p>

          {/* CTA */}
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-[#c9f563] text-[#0a0f0c] rounded-xl px-6 py-3.5 text-[15px] font-semibold hover:bg-[#b8e050] transition-colors"
          >
            Solicitar mi sesión
            <ArrowRightIcon/>
          </button>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-14">
            {MENTORIA_STATS.map(({value, label}) => (
              <div key={label} className="bg-[#0d1a17] border border-white/[.06] rounded-2xl p-4">
                <p
                  className="text-[28px] md:text-[32px] font-black text-[#c9f563] leading-none mb-1"
                  style={{fontFamily: "'Fraunces', serif"}}
                >
                  {value}
                </p>
                <p className="text-[11px] text-[rgba(240,237,228,.45)] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Para quién es" (cream bg) ── */}
      <section className="bg-[#2ecdf] px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-[32px] md:text-[40px] font-black leading-[1.1] tracking-[-1px] text-[#0a0f0c] mb-4"
            style={{fontFamily: "'Fraunces', serif"}}
          >
            ¿Para quién es esto?
          </h2>
          <p className="text-[15px] leading-[1.6] text-[rgba(10,15,12,.6)] mb-8 max-w-xl">
            La mentoría no es para todos. Es para quienes ya tienen algo que mostrar — y solo
            necesitan que alguien les diga qué hacer con ello.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {PARA_QUIEN_BULLETS.map((bullet) => (
              <div key={bullet}
                   className="flex items-start gap-3 text-[14px] text-[rgba(10,15,12,.75)]">
                <span className="text-[#0a0f0c] mt-0.5">✓</span>
                {bullet}
              </div>
            ))}
          </div>

          {/* Requirement callout */}
          <div className="bg-[#0a0f0c] text-[#f0ede4] rounded-2xl p-5 md:p-6">
            <p className="text-[13px] font-semibold text-[#c9f563] mb-2">REQUISITO MÍNIMO</p>
            <p className="text-[14px] text-[rgba(240,237,228,.65)]">
              Tener al menos un CV básico o experiencia laboral/proyectos demostrables. No necesitas
              hablar perfecto inglés — necesitas saber qué becas existen para tu perfil.
            </p>
          </div>
        </div>
      </section>

      {/* ── "Lo que pasa en los 60 minutos" (cream bg) ── */}
      <section className="bg-[#f5f2eb] px-6 md:px-12 pb-14 md:pb-20 py-10">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-[32px] md:text-[40px] font-black leading-[1.1] tracking-[-1px] text-[#0a0f0c] mb-3"
            style={{fontFamily: "'Fraunces', serif"}}
          >
            ¿Qué pasa en los 60 minutos?
          </h2>
          <p className="text-[15px] text-[rgba(10,15,12,.55)] mb-8">
            Estructura clara. Sin relleno. Solo lo que necesitas saber.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENTORIA_FEATURES.map(({emoji, title, body}) => (
              <div key={title}
                   className="bg-white border border-[rgba(10,15,12,.08)] rounded-2xl p-5">
                <span className="text-2xl mb-3 block">{emoji}</span>
                <h3 className="text-[15px] font-semibold text-[#0a0f0c] mb-2">{title}</h3>
                <p className="text-[13px] text-[rgba(10,15,12,.6)] leading-[1.5]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Tu mentora" (dark bg) ── */}
      <section className="bg-[#0a0f0c] px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Avatar + info */}
            <div className="flex-shrink-0">
              <div
                className="relative h-28 w-28 rounded-full border border-border bg-muted overflow-hidden">
                <Image
                  src="/people/darita.jpeg"
                  alt="Dara Mariluz"
                  className="object-cover" // Quitamos h-full/w-full porque 'fill' se encarga
                  fill
                  sizes="112px" // Optimización: 28 * 4 = 112px
                  priority // Opcional: si es la imagen principal de la página
                />
              </div>
              <div className="mt-4">
                <p className="text-[15px] font-semibold text-[#f0ede4]">Dara Mariluz</p>
                <p className="text-[13px] text-[rgba(240,237,228,.45)]">Fundadora de Levely</p>
                <a
                  href="https://www.linkedin.com/in/soydaramariluz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-[#c9f563] hover:underline"
                >
                  LinkedIn →
                </a>
              </div>
            </div>

            {/* Bio + credentials */}
            <div className="flex-1">
              <h2
                className="text-[32px] md:text-[40px] font-black leading-[1.1] tracking-[-1px] text-[#f0ede4] mb-4"
                style={{fontFamily: "'Fraunces', serif"}}
              >
                Tu mentora
              </h2>
              <p className="text-[14px] leading-[1.7] text-[rgba(240,237,228,.6)] mb-6 max-w-xl">
                Dara fundó Levely después de pasar por el proceso completo de aplicación a becas
                internacionales. Conoce las preguntas que nadie te hace antes de que sea demasiado
                tarde, y sabe exactamente qué buscan los committees de selección porque lo ha vivido
                en primera persona.
              </p>

              <div className="flex flex-col gap-2">
                {[
                  "Aplicó y ganó una beca internacional completa",
                  "Revisó +500 CVs de postulantes a becas",
                  "Ayudó a estudiantes de Perú, Colombia, México y más a conseguir plazas",
                  "Conoce el proceso de Chevening, Fulbright y DAAD desde adentro",
                ].map((cred) => (
                  <div key={cred}
                       className="flex items-center gap-2 text-[13px] text-[rgba(240,237,228,.55)]">
                    <CheckIcon/>
                    {cred}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials (cream bg) ── */}
      <section className="bg-[#f5f2eb] px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-[32px] md:text-[40px] font-black leading-[1.1] tracking-[-1px] text-[#0a0f0c] mb-8"
            style={{fontFamily: "'Fraunces', serif"}}
          >
            Lo que dicen quienes ya pasaron por aquí
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MENTORIA_TESTIMONIALS.map(({quote, name, location, badge}) => (
              <div key={name}
                   className="bg-white border border-[rgba(10,15,12,.08)] rounded-2xl p-6">
                <p className="text-[15px] leading-[1.65] text-[rgba(10,15,12,.75)] mb-6 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#0a0f0c]">{name}</p>
                    <p className="text-[12px] text-[rgba(10,15,12,.45)]">{location}</p>
                  </div>
                  <span
                    className="text-[11px] px-3 py-1 bg-[#c9f563]/10 text-[#0a0f0c] rounded-full font-medium">
                    {badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Price (white/cream bg) ── */}
      <section className="bg-[#f2ecdf] px-6 md:px-12 pb-14 md:pb-20 pt-10 sm:pt-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <p
            className="text-[11px] font-semibold tracking-[.1em] uppercase text-[rgba(10,15,12,.4)] mb-4">
            Inversión
          </p>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[20px] font-semibold text-[#0a0f0c]">S/</span>
            <span
              className="text-[72px] md:text-[88px] font-black leading-none tracking-[-2px] text-[#0a0f0c]"
              style={{fontFamily: "'Fraunces', serif"}}
            >
              {priceInt}
            </span>
            <span
              className="text-[28px] font-bold text-[#0a0f0c] self-start mt-4"
              style={{fontFamily: "'Fraunces', serif"}}
            >
              {priceDec ? `.${priceDec}` : ""}0
            </span>
          </div>

          <p className="text-[13px] text-[rgba(10,15,12,.45)] mb-6">
            Pago único · Sin suscripción
          </p>

          <p className="text-[14px] text-[rgba(10,15,12,.6)] max-w-md mb-8 leading-[1.6]">
            Una sesión de 60 minutos te ahorra meses de investigación incorrecta. Si aplicas a
            Chevening, la beca cubre matrícula, vuelo y estipendio — más de $80k USD. S/ 250 es
            menos del 0.1% de eso.
          </p>

          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-[#0a0f0c] text-[#c9f563] rounded-xl px-8 py-4 text-[15px] font-semibold hover:bg-[#1a2a20] transition-colors"
          >
            Reservar mi sesión
            <ArrowRightIcon/>
          </button>

          <div className="flex items-center gap-6 mt-6 text-[11px] text-[rgba(10,15,12,.35)]">
            <span className="flex items-center gap-1.5">
              <CheckIcon/>
              Pago seguro
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon/>
              Boleta de pago
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon/>
              Empresa registrada en Perú
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0a0f0c] border-t border-white/[.06] px-6 md:px-12 py-6">
        <div
          className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[rgba(240,237,228,.25)]">
          <span className="text-[#c9f563] font-semibold">levely</span>
          <div className="flex items-center gap-4">
            <a href="/politica-de-privacidad"
               className="hover:text-[rgba(240,237,228,.5)] transition-colors">
              Política de privacidad
            </a>
            <span>·</span>
            <span>Levely emite boleta de pago · Empresa registrada en Perú</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
