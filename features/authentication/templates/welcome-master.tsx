import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeMasterEmailProps {
  userName: string;
}

export const WelcomeMasterEmail = ({ userName }: WelcomeMasterEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a la era de la empleabilidad con IA 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo / Header */}
          <Section style={header}>
            <Heading style={logo}>Levely<span style={accent}>.</span></Heading>
          </Section>

          {/* Hero Section */}
          <Section style={content}>
            <Heading style={h1}>¡Hola, {userName}!</Heading>
            <Text style={text}>
              Estamos emocionados de tenerte a bordo. Levely no es solo un editor de CVs, es tu **copiloto de carrera** diseñado para que nunca más vuelvas a enviar una postulación a ciegas.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href="https://levely.ai/dashboard">
                Subir mi primer CV
              </Button>
            </Section>
          </Section>

          {/* Quick Steps (Onboarding visual) */}
          <Section style={stepsSection}>
            <Text style={stepTitle}>¿Por dónde empezar?</Text>

            <Section style={stepRow}>
              <Text style={stepIcon}>1️⃣</Text>
              <Text style={stepText}>
                <strong>Sube tu CV actual:</strong> Analizaremos tus puntos fuertes y áreas de mejora.
              </Text>
            </Section>

            <Section style={stepRow}>
              <Text style={stepIcon}>2️⃣</Text>
              <Text style={stepText}>
                <strong>Genera versiones Pro:</strong> Adapta tu perfil a cualquier industria en segundos.
              </Text>
            </Section>

            <Section style={stepRow}>
              <Text style={stepIcon}>3️⃣</Text>
              <Text style={stepText}>
                <strong>Encuentra Oportunidades:</strong> Revisa el "Match" de IA con vacantes reales.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Necesitas ayuda? Responde a este correo o únete a nuestra comunidad.
            </Text>
            <Link href="https://levely.ai" style={footerLink}>Configuración de la cuenta</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeMasterEmail;

// Estilos de Ingeniería (Dark Mode & Mobile First)
const main = {
  backgroundColor: "#09090b",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "40px auto",
  padding: "40px",
  width: "560px",
  backgroundColor: "#121214",
  borderRadius: "24px",
  border: "1px solid #27272a",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
  textAlign: "center" as const,
  letterSpacing: "-0.5px",
};

const accent = { color: "#8b5cf6" }; // Tu color primary

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#a1a1aa",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#8b5cf6", // ai-gradient fallback
  borderRadius: "12px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
};

const stepsSection = {
  backgroundColor: "#1a1a1c",
  padding: "20px",
  borderRadius: "16px",
  margin: "20px 0",
};

const stepTitle = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "900",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  marginBottom: "15px",
};

const stepRow = { marginBottom: "12px" };
const stepIcon = { display: "inline-block", marginRight: "10px" };
const stepText = { color: "#a1a1aa", fontSize: "14px", margin: "0", display: "inline" };

const hr = { borderColor: "#27272a", margin: "40px 0" };
const footerText = { color: "#71717a", fontSize: "12px", textAlign: "center" as const };
const footerLink = { color: "#8b5cf6", textDecoration: "underline", fontSize: "12px", display: "block", textAlign: "center" as const, marginTop: "10px" };

const header = { marginBottom: "20px" };
const content = { marginBottom: "30px" };
const footer = { marginTop: "20px" };
