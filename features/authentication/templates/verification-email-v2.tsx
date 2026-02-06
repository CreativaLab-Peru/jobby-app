import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Link,
  Button,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  name: string;
  url: string;
  isPasswordReset?: boolean;
}

const colors = {
  background: "#0d1526",
  card: "#192233",
  primary: "#3b82f6",
  secondary: "#bef264",
  foreground: "#fcfcfd",
  muted: "#a1a1aa",
  border: "#334155",
};

export const LevelyEmail = ({ name, url, isPasswordReset }: EmailProps) => (
  <Html>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet" />
    </Head>
    <Preview>{isPasswordReset ? "Restablece tu contraseña" : `¡Bienvenido a Levely, ${name}!`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: "center", marginBottom: "32px" }}>
          <Img
            src="https://www.joinlevely.com/logo_dark.png"
            width="130"
            alt="Levely"
            style={{ margin: "0 auto" }}
          />
        </Section>

        <Heading style={h1}>
          {isPasswordReset ? "Restablecer contraseña" : "Verifica tu cuenta"}
        </Heading>

        <Text style={text}>Hola <strong>{name}</strong>,</Text>

        <Text style={text}>
          {isPasswordReset
            ? "Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar."
            : "¡Es genial tenerte con nosotros! Estás a un paso de potenciar tu carrera con nuestra IA. Por favor, verifica tu correo haciendo clic abajo:"}
        </Text>

        <Section style={{ textAlign: "center", margin: "32px 0" }}>
          <Button
            href={url}
            style={{
              backgroundColor: colors.secondary,
              color: colors.background,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none",
              textAlign: "center" as const,
              display: "inline-block",
              padding: "16px 32px",
            }}
          >
            {isPasswordReset ? "Cambiar Contraseña" : "Verificar Email"}
          </Button>
        </Section>

        <Text style={{ ...text, fontSize: "14px", textAlign: "center" }}>
          Si el botón no funciona, copia y pega este enlace: <br />
          <Link href={url} style={{ color: colors.primary, fontSize: "12px" }}>{url}</Link>
        </Text>

        <Hr style={hr} />
        <Section style={{ textAlign: "center" }}>
          <Text style={footer}>
            <strong>Levely AI</strong> — La plataforma para la nueva generación de profesionales.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// --- ESTILOS (Se mantienen igual a tu diseño original) ---
const main = { backgroundColor: colors.background, fontFamily: 'Poppins, sans-serif', padding: "40px 0" };
const container = { backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: "16px", margin: "0 auto", padding: "40px", maxWidth: "480px" };
const h1 = { color: colors.foreground, fontSize: "24px", fontWeight: "700", textAlign: "center" as const, margin: "0 0 24px" };
const text = { color: colors.muted, fontSize: "16px", lineHeight: "24px" };
const hr = { borderColor: colors.border, margin: "32px 0" };
const footer = { color: "#71717a", fontSize: "12px" };
