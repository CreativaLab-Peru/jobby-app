import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateOpportunityTypes() {
  console.log("🚀 Iniciando migración de tipos de oportunidad...");

  try {
    await prisma.$transaction(async (tx) => {
      // Mapeo para INTERNSHIP
      const toInternship = ["RESEARCH_FELLOWSHIP", "GRADUATE_PROGRAM"];
      const res1 = await tx.cv.updateMany({
        where: { opportunityType: { in: toInternship} },
        data: { opportunityType: "INTERNSHIP" },
      });
      console.log(`✅ ${res1.count} CVs migrados a INTERNSHIP`);

      // Mapeo para EMPLOYMENT
      const toEmployment = ["FREELANCE", "FULL_TIME", "PART_TIME"];
      const res2 = await tx.cv.updateMany({
        where: { opportunityType: { in: toEmployment } },
        data: { opportunityType: "EMPLOYMENT" },
      });
      console.log(`✅ ${res2.count} CVs migrados a EMPLOYMENT`);

      // IMPORTANTE: Hacer lo mismo en la tabla de Oportunidades guardadas
      await tx.opportunity.updateMany({
        where: { type: { in: [...toInternship, ...toEmployment]} },
        data: { /* Lógica similar si el campo se llama 'type' */ }
      });
    });

    console.log("✨ Migración completada con éxito.");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateOpportunityTypes();
