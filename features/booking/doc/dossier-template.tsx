"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { RouteDossier } from "@/features/booking/actions/get-route-dossier";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreSection: {
    marginVertical: 20,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  // --- Sistema de Tabla Antisolapamiento ---
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 10,
    minHeight: 40, // Asegura espacio para textos largos
  },
  columnMain: {
    flex: 3, // 60% del ancho
    paddingRight: 10,
  },
  columnStats: {
    flex: 1, // 20% del ancho
    textAlign: "right",
    justifyContent: "center",
  },
  columnDate: {
    flex: 1, // 20% del ancho
    textAlign: "right",
    justifyContent: "center",
  },
  // --- Tipografía ---
  textName: { fontSize: 10, fontWeight: "bold", color: "#0F172A" },
  textSub: { fontSize: 8, color: "#64748B", marginTop: 2 },
  textMatch: { fontSize: 10, fontWeight: "bold", color: "#2563EB" },
  textDate: { fontSize: 8, color: "#64748B" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#94A3B8",
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
  }
});

interface DossierPDFProps {
  data: Extract<RouteDossier, { success: true }>["data"];
}

export const DossierPDF = ({ data }: { data: any }) => {
  const generatedDate = "27 MAR. 2026"; // [cite: 6]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.title}>Dossier de Candidato</Text>
            <Text style={{ fontSize: 11, color: "#64748B" }}>{data.userName}</Text>
          </View>
          <Text style={{ fontSize: 8, color: "#94A3B8" }}>
            GENERADO: {generatedDate}
          </Text>
        </View>

        {/* Resumen Ejecutivo */}
        <View style={styles.scoreSection}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Levely Score: {data.cv.score}/100
          </Text>
          <Text style={styles.textSub}>
            Email: {data.userEmail}
          </Text>
        </View>

        {/* Listado de Oportunidades [cite: 9] */}
        <View>
          <Text style={styles.sectionTitle}>Oportunidades Estratégicas</Text>

          {data.opportunities.map((opp: any, index: number) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              {/* Columna Principal: Título y Empresa */}
              <View style={styles.columnMain}>
                <Text style={styles.textName}>{opp.title}</Text>
                <Text style={styles.textSub}>{opp.company}</Text>
              </View>

              {/* Columna de Match */}
              <View style={styles.columnStats}>
                <Text style={styles.textMatch}>{opp.match}% Match</Text>
              </View>

              {/* Columna de Fecha */}
              <View style={styles.columnDate}>
                <Text style={styles.textDate}>
                  {opp.deadline ? "mar. 2026" : "N/A"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer Informativo [cite: 51] */}
        <Text style={styles.footer} fixed>
          Este documento es una evaluación preliminar. Generado por Levely Career Pilot.
        </Text>
      </Page>
    </Document>
  );
};
