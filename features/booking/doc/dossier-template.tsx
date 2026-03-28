"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {RouteDossier} from "@/features/booking/actions/get-route-dossier";

// Estilos siguiendo el sistema de diseño Levely (KISS)
const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 9,
    color: "#64748B",
    textTransform: "uppercase",
  },
  scoreSection: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statusBadge: {
    marginTop: 4,
    fontSize: 10,
    color: "#059669",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 8,
    alignItems: "center",
  },
  tableCellTitle: { flex: 2, fontSize: 10, fontWeight: "bold" },
  tableCellMatch: { flex: 1, fontSize: 10, textAlign: "right", color: "#2563EB" },
  tableCellDate: { flex: 1, fontSize: 9, textAlign: "right", color: "#64748B" },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    textAlign: "center",
    fontSize: 8,
    color: "#94A3B8",
  }
});

interface DossierPDFProps {
  data: Extract<RouteDossier, { success: true }>["data"];
}

export const DossierPDF = ({ data }: DossierPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dossier de Candidato</Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{data.userName}</Text>
        </View>
        <Text style={styles.meta}>Generado: {(new Date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
      </View>

      {/* Resumen de Perfil */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreText}>Levely Score: {data.cv.score}/100</Text>
        {/*<Text style={styles.statusBadge}>Estado: {data.status}</Text>*/}
        <Text style={{ fontSize: 10, color: "#64748B", marginTop: 8 }}>
          Email de contacto: {data.userEmail}
        </Text>
      </View>

      {/* Tabla de Oportunidades */}
      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Oportunidades Estratégicas</Text>
        <View style={{ borderTopWidth: 1, borderTopColor: "#0F172A", paddingTop: 4 }}>
          {data.opportunities.map((opp, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellTitle}>{opp.title}</Text>
                <Text style={{ fontSize: 8, color: "#64748B" }}>{opp.company}</Text>
              </View>
              <Text style={styles.tableCellMatch}>{opp.match}% Match</Text>
              <Text style={styles.tableCellDate}>
                {opp.deadline ? new Date(opp.deadline).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' }) : "N/A"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer Legal/Marca */}
      <Text style={styles.footer}>
        Este documento es una evaluación preliminar generada por la IA de Levely.
        Para una validación oficial, agende su sesión con un mentor verificado.
      </Text>
    </Page>
  </Document>
);
