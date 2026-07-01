"use client";

import ConvertKitForm from "@/components/convert-kit-form";

const uid = "bfc8a3a54f";

const colors = {
  bg: "#0B1314",
  bg2: "#0f1a1b",
  fg: "#f0fff4",
  fg2: "#F5F5F0",
  fg3: "#F5F5F0",
  green: "#d2ff7d",
  greenLt: "#d2ff7d",
  greenBtn: "#c4f060",
  border: "rgba(255,255,255,0.07)",
  cardBg: "rgba(255,255,255,0.04)",
  inputBg: "rgba(255,255,255,0.06)",
  inputBr: "rgba(255,255,255,0.12)",
};

export function RadarLanding() {
  return (
    <div
      style={{
        background: colors.bg,
        color: colors.fg,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* HERO */}
      <section
        style={{
          padding: "clamp(70px,11vw,120px) clamp(20px,5vw,56px) clamp(60px,9vw,100px)",
          textAlign: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            fontWeight: 500,
            color: colors.fg3,
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            padding: "6px 16px",
            borderRadius: "40px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: colors.green,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Radar de Becas
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(36px, 7vw, 72px)",
            lineHeight: 1.08,
            letterSpacing: "-1px",
            color: colors.fg,
            marginBottom: "22px",
            fontWeight: 400,
          }}
        >
          Otros buscan becas.<br />
          <em style={{ color: colors.green, fontStyle: "normal" }}>Tú las recibes.</em>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "clamp(15px,2vw,18px)",
            color: colors.fg3,
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 auto 44px",
          }}
        >
          Cada mañana escaneamos <strong style={{ color: colors.fg2, fontWeight: 500 }}>más de 100 fuentes internacionales</strong> y te enviamos las mejores oportunidades del día. Becas full funded, maestrías, doctorados, fellowships y más. Solo lo que realmente existe hoy.
        </p>

        {/* Form */}
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ConvertKitForm uid={uid} />
          <p
            style={{
              fontSize: "12px",
              color: colors.fg3,
              textAlign: "center",
              marginTop: "14px",
              lineHeight: 1.65,
            }}
          >
            Únete a +2,000 personas en Perú y Latam<br />
            <a href="/politica-de-privacidad" style={{ color: colors.fg3, borderBottom: `1px solid ${colors.border}` }}>
              Política de privacidad
            </a>
          </p>
        </div>
      </section>

      {/* STATS */}
      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {[
            { num: "+100", label: "fuentes monitoreadas\ncada día" },
            { num: "+200", label: "suscriptores activos\nen Perú y Latam" },
            { num: "1×", label: "vez a la semana\nen tu correo" },
            { num: "100%", label: "becas con link directo\na la fuente oficial" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "28px 20px",
                textAlign: "center",
                borderRight: i < 3 ? `1px solid ${colors.border}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "38px",
                  color: colors.green,
                  lineHeight: 1,
                  marginBottom: "5px",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: colors.fg3,
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMO LLEGA */}
      <section
        style={{
          padding: "clamp(48px,6vw,72px) clamp(20px,5vw,56px)",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Gmail badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "40px",
            padding: "7px 16px",
            marginBottom: "22px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke={colors.fg3} strokeOpacity="0.4" strokeWidth="1.5"/>
            <path d="M2 6L12 13L22 6" stroke={colors.green} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: colors.green, marginBottom: "14px" }}>
          Así llega cada mañana
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: "clamp(26px,4vw,44px)", lineHeight: 1.15, letterSpacing: "-0.3px", marginBottom: "16px", color: colors.fg }}>
          Abres tu correo.<br />
          <em style={{ color: colors.green, fontStyle: "normal" }}>Ya están listas para aplicar.</em>
        </h2>
        <p style={{ fontSize: "15px", color: colors.fg3, lineHeight: 1.75 }}>
          Un correo limpio, con lo que abrió hoy y el link directo a cada convocatoria.
        </p>
      </section>

      {/* TIPOS DE OPORTUNIDADES */}
      <section style={{ padding: "0 clamp(20px,5vw,56px)", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginTop: "48px",
          }}
        >
          {[
            { icon: "🎓", title: "Becas de maestría full funded", desc: "Programas que cubren matrícula, vuelo, alojamiento y manutención mensual. Chevening, DAAD, Erasmus Mundus, Fulbright y más.", tag: "Full funded" },
            { icon: "🔬", title: "Doctorados financiados", desc: "Programas de doctorado con estipendio mensual en universidades de Europa, UK, EEUU, Canadá y Asia. Sin deuda, con salario.", tag: "PhD" },
            { icon: "🌐", title: "Fellowships internacionales", desc: "Programas de liderazgo, innovación e impacto social con financiamiento completo. Para jóvenes profesionales y emprendedores.", tag: "Liderazgo" },
            { icon: "🏛️", title: "Fondos de investigación", desc: "Grants y financiamiento para proyectos de investigación aplicada, ciencia, tecnología e impacto social desde Latinoamérica.", tag: "Research" },
            { icon: "🚀", title: "Aceleradoras y residencias", desc: "Programas de aceleración, residencias internacionales y oportunidades para emprendedores con financiamiento o equity.", tag: "Startups" },
            { icon: "🤝", title: "Intercambios y programas cortos", desc: "Visitas de investigación, programas de verano e intercambios académicos con viaje y alojamiento cubiertos.", tag: "Exchange" },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: "14px",
                padding: "24px 22px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.green)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
            >
              <div style={{ fontSize: "26px", marginBottom: "12px" }}>{card.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: colors.fg, marginBottom: "6px" }}>{card.title}</div>
              <div style={{ fontSize: "13px", color: colors.fg3, lineHeight: 1.65 }}>{card.desc}</div>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: colors.green,
                  background: "rgba(120,200,80,0.1)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                }}
              >
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        style={{
          padding: "clamp(60px,8vw,90px) clamp(20px,5vw,56px)",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: colors.green, marginBottom: "14px" }}>
            Cómo funciona
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: "clamp(26px,4vw,44px)", lineHeight: 1.15, letterSpacing: "-0.3px", marginBottom: "16px", color: colors.fg }}>
            Sin buscar.<br />
            <em style={{ color: colors.green, fontStyle: "normal" }}>Sin perderte nada.</em>
          </h2>
          <p style={{ fontSize: "15px", color: colors.fg3, lineHeight: 1.75 }}>
            Armamos el Radar porque buscar becas manualmente es un trabajo de tiempo completo que nadie tiene. Hay cientos de convocatorias abriéndose cada semana, la mayoría en inglés, dispersas en sitios que nunca revisarías. Nosotros lo hacemos por ti.
          </p>

          <div style={{ marginTop: "32px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: colors.fg3, marginBottom: "14px" }}>
              Algunas fuentes que monitoreamos
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {["🇬🇧 Chevening", "🇺🇸 Fulbright", "🇩🇪 DAAD", "🇪🇺 Erasmus Mundus", "🌎 OEA", "🇯🇵 MEXT", "🇨🇳 CSC", "🇰🇷 GKS Korea", "Fundación Carolina", "ANID Chile", "Pronabec", "Gates Foundation", "Open Society", "+ 90 más"].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "6px 14px",
                    borderRadius: "40px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: colors.fg2,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Steps */}
        <div>
          {[
            { num: "1", title: "Te suscribes en 30 segundos", desc: "Solo tu nombre y tu correo." },
            { num: "2", title: "Cada mañana escaneamos más de 100 fuentes", desc: "El sistema revisa embajadas, universidades, fundaciones, gobiernos y portales especializados. Solo convocatorias abiertas hoy." },
            { num: "3", title: "Recibes lo mejor directo en tu correo", desc: "Un correo semanal con las oportunidades del día. Clasificadas, con descripción clara y el link oficial para aplicar. Tú decides qué te interesa." },
            { num: "4", title: "Aplicas cuando algo encaja contigo", desc: "No tienes que postale a todo. Solo estar informado a tiempo para cuando aparezca la beca que sí es para ti." },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "52px 1fr",
                gap: "20px",
                alignItems: "flex-start",
                padding: "22px 0",
                borderBottom: i < 3 ? `1px solid ${colors.border}` : "none",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "18px",
                  color: colors.green,
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 500, color: colors.fg, marginBottom: "4px" }}>{step.title}</div>
                <div style={{ fontSize: "13px", color: colors.fg3, lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          background: colors.bg2,
          borderTop: `1px solid ${colors.border}`,
          padding: "clamp(60px,8vw,90px) clamp(20px,5vw,56px)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: colors.green, marginBottom: "14px" }}>
            Cancela cuando quieras
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(28px,5vw,50px)",
              lineHeight: 1.15,
              letterSpacing: "-0.3px",
              marginBottom: "14px",
              color: colors.fg,
            }}
          >
            El Radar trabaja.<br />
            <em style={{ color: colors.green, fontStyle: "normal" }}>Tú aplicas.</em>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: colors.fg3,
              lineHeight: 1.75,
              marginBottom: "36px",
              maxWidth: "480px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Mientras trabajas, estudias o duermes, el Radar está monitoreando las becas que pueden cambiar tu trayectoria. Tú solo abres el correo.
          </p>

          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <ConvertKitForm uid={uid} />
            <p
              style={{
                fontSize: "12px",
                color: colors.fg3,
                textAlign: "center",
                marginTop: "14px",
                lineHeight: 1.65,
              }}
            >
              +200 personas ya lo reciben
            </p>
          </div>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 800px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .types-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
