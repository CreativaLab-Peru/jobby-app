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
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  otpCode?: string;
}

export const WelcomeEmail = ({ name, otpCode }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Bienvenido a Levely, {name}! Verifica tu cuenta.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Levely<span style={highlight}>.</span></Heading>
        <Text style={text}>Hola {name},</Text>
        <Text style={text}>
          ¡Es genial tenerte con nosotros! Estás a un paso de potenciar tu carrera con nuestra IA.
          Por favor, usa el siguiente código para verificar tu correo:
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{otpCode}</Text>
        </Section>
        <Text style={text}>
          Si no creaste una cuenta en Levely, puedes ignorar este mensaje.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Levely AI — La plataforma para la nueva generación de profesionales.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Estilos (In-line para máxima compatibilidad)
const main = { backgroundColor: "#09090b", fontFamily: 'sans-serif', padding: "40px 0" };
const container = { backgroundColor: "#121214", border: "1px solid #27272a", borderRadius: "16px", margin: "0 auto", padding: "40px", maxWidth: "480px" };
const h1 = { color: "#ffffff", fontSize: "32px", fontWeight: "900", textAlign: "center" as const, margin: "0 0 30px" };
const highlight = { color: "#8b5cf6" }; // Tu color primary
const text = { color: "#a1a1aa", fontSize: "16px", lineHeight: "24px", textAlign: "left" as const };
const codeContainer = { background: "#1a1a1c", borderRadius: "12px", margin: "24px 0", padding: "20px", textAlign: "center" as const, border: "1px dashed #3f3f46" };
const code = { color: "#ffffff", fontSize: "32px", fontWeight: "bold", letterSpacing: "8px" };
const hr = { borderColor: "#27272a", margin: "30px 0" };
const footer = { color: "#71717a", fontSize: "12px", textAlign: "center" as const };
