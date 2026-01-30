import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeMasterEmailProps {
  userName: string;
}

// DEFINICIÓN DE TOKENS (Convertidos de tu globals.css)
const colors = {
  background: "#0d1526", // Fondo oscuro (hsl 220 30% 10%)
  card: "#192233",       // Superficie card (hsl 220 30% 14%)
  primary: "#3b82f6",    // Azul Levely (hsl 214 92% 60%)
  secondary: "#bef264",  // Verde Lima (hsl 92 90% 65%)
  foreground: "#fcfcfd", // Texto principal
  muted: "#a1a1aa",      // Texto secundario
  border: "#334155",     // Bordes (hsl 220 20% 25%)
};

export const WelcomeMasterEmail = ({ userName }: WelcomeMasterEmailProps) => {
  return (
    <Html>
      <Head>
        {/* Forzamos que Poppins se intente cargar en clientes que lo soportan (Apple Mail) */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Preview>Bienvenido a la era de la empleabilidad con IA 🚀</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Logo - Usamos la versión light porque el fondo del correo es oscuro */}
          <Section style={logoContainer}>
            <Img
              src="https://www.joinlevely.com/logo_dark.png"
              width="140"
              height="auto"
              alt="Levely Logo"
              style={logoImage}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>¡Hola, {userName}!</Heading>
            <Text style={text}>
              Estamos emocionados de tenerte a bordo. <strong style={{ color: colors.secondary }}>Levely</strong> no es solo un editor de CVs, es tu copiloto de carrera con IA.
            </Text>

            <Section style={buttonContainer}>
              {/* El Button de react-email renderiza un <a> con estilos inline, lo más seguro */}
              <Button style={button} href="https://joinlevely.com/dashboard">
                Comenzar ahora
              </Button>
            </Section>
          </Section>

          <Section style={stepsSection}>
            <Text style={stepTitle}>Tu camino al éxito PRO</Text>

            <table
              style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
              cellPadding="0"
              cellSpacing="0"
            >
              <tr>
                <td align="center"> {/* Este 'align="center"' es clave para emails */}
                  <table style={{ width: "auto", maxWidth: "100%" }} cellPadding="0" cellSpacing="0">

                    {/* PASO 1 */}
                    <tr>
                      <td style={{ padding: "10px 0" }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tr>
                            <td style={{ width: "40px", verticalAlign: "middle" }}>
                              <div style={stepBadge}>1</div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <Text style={stepTextInline}>
                                <strong>Sube tu CV:</strong> Analizaremos tus puntos fuertes.
                              </Text>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    {/* PASO 2 */}
                    <tr>
                      <td style={{ padding: "10px 0" }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tr>
                            <td style={{ width: "40px", verticalAlign: "middle" }}>
                              <div style={stepBadge}>2</div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <Text style={stepTextInline}>
                                <strong style={{ color: colors.secondary }}>Modo PRO:</strong>{" "}
                                Adapta tu perfil en segundos.
                              </Text>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Has recibido este correo porque te registraste en Levely.
            </Text>
            <div style={{ textAlign: "center" as const }}>
              <Link href="https://joinlevely.com/dashboard" style={footerLink}>Panel de Control</Link>
              <span style={{ color: colors.border, padding: "0 10px" }}>•</span>
              <Link href="https://joinlevely.com/pro" style={footerLink}>Pasar a PRO</Link>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeMasterEmail;

// ESTILOS DE INGENIERÍA (Email-Safe)
const main = {
  backgroundColor: colors.background,
  fontFamily: 'Poppins, "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "40px",
  width: "580px",
  backgroundColor: colors.card,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
};

const logoContainer = { textAlign: "center" as const, marginBottom: "32px" };
const logoImage = { display: "block", margin: "0 auto" };
const content = { padding: "0 10px" };

const h1 = {
  color: colors.foreground,
  fontSize: "28px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0 0 15px 0",
};

const text = {
  color: colors.muted,
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
  padding: "0 10px",
};

const buttonContainer = { textAlign: "center" as const, margin: "32px 0" };

const button = {
  backgroundColor: colors.primary, // Fallback para Outlook
  backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  // Shadow hack para email
  border: `1px solid ${colors.primary}`,
};

const stepsSection = {
  padding: "24px",
  margin: "24px 0",
};

const stepTitle = {
  color: colors.secondary,
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const stepBadge = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: colors.primary,
  color: "#ffffff",
  textAlign: "center" as const,
  fontSize: "14px",
  fontWeight: "bold",
  lineHeight: "28px",
};

const hr = { borderColor: colors.border, margin: "32px 0" };
const footer = { textAlign: "center" as const };
const footerText = { color: colors.muted, fontSize: "12px" };
const footerLink = { color: colors.primary, textDecoration: "none", fontSize: "12px", fontWeight: "600" };

const stepTextInline = {
  color: colors.foreground,
  fontSize: "14px",
  margin: "0", // Importante: eliminar márgenes por defecto de <Text>
  lineHeight: "1.4",
};
