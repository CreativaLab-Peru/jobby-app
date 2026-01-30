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
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  otpCode?: string;
}

// TOKENS DE COLOR (Consistentes con tu globals.css y Welcome Email)
const colors = {
  background: "#0d1526", // hsl(220 30% 10%)
  card: "#192233",       // hsl(220 30% 14%)
  primary: "#3b82f6",    // Azul Levely
  secondary: "#bef264",  // Verde Lima Levely
  foreground: "#fcfcfd",
  muted: "#a1a1aa",
  border: "#334155",
};

export const VerificationEmail = ({ name, otpCode }: WelcomeEmailProps) => (
  <Html>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet" />
    </Head>
    <Preview>¡Bienvenido a Levely, {name}! Verifica tu cuenta.</Preview>
    <Body style={main}>
      <Container style={container}>

        {/* Header con Logo */}
        <Section style={{ textAlign: "center" as const, marginBottom: "32px" }}>
          <Img
            src="https://www.joinlevely.com/logo_dark.png"
            width="130"
            height="auto"
            alt="Levely"
            style={{ margin: "0 auto" }}
          />
        </Section>

        <Heading style={h1}>Verifica tu cuenta</Heading>

        <Text style={text}>Hola <strong>{name}</strong>,</Text>

        <Text style={text}>
          ¡Es genial tenerte con nosotros! Estás a un paso de potenciar tu carrera con nuestra IA.
          Por favor, usa el siguiente código para verificar tu correo electrónico:
        </Text>

        {/* Contenedor del Código OTP con estética IA */}
        <Section style={codeContainer}>
          <Text style={code}>{otpCode}</Text>
        </Section>

        <Text style={{ ...text, fontSize: "14px", textAlign: "center" as const }}>
          Este código expirará pronto. Si no creaste una cuenta en Levely, puedes ignorar este mensaje.
        </Text>

        <Hr style={hr} />

        <Section style={footerContainer}>
          <Text style={footer}>
            <strong>Levely AI</strong> — La plataforma para la nueva generación de profesionales.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// ESTILOS DE INGENIERÍA
const main = {
  backgroundColor: colors.background,
  fontFamily: 'Poppins, -apple-system, sans-serif',
  padding: "40px 0"
};

const container = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "480px"
};

const h1 = {
  color: colors.foreground,
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0 0 24px",
  letterSpacing: "-0.02em"
};

const text = {
  color: colors.muted,
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const
};

const codeContainer = {
  background: "rgba(59, 130, 246, 0.05)", // Sutil tinte azul primary
  borderRadius: "12px",
  margin: "32px 0",
  padding: "24px",
  textAlign: "center" as const,
  border: `2px dashed ${colors.primary}` // Borde punteado con el azul de la marca
};

const code = {
  color: colors.secondary, // Código en Verde Lima para máximo contraste y look IA
  fontSize: "40px",
  fontWeight: "900",
  letterSpacing: "10px",
  margin: "0",
  fontFamily: "monospace" // Monospace ayuda a la legibilidad de códigos
};

const hr = {
  borderColor: colors.border,
  margin: "32px 0"
};

const footerContainer = {
  textAlign: "center" as const,
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  lineHeight: "18px"
};
