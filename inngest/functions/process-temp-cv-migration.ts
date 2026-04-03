import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {JobStatus, RouteStatus} from "@prisma/client";
import {getActiveRoute} from "@/features/routes/actions/get-active-route";

export const processTempCvMigration = inngest.createFunction(
  {id: "migrate-temp-cv", name: "Migrate Temporary CV to User"},
  {event: "cv/migrate-temporary"},
  async ({event, step}) => {
    const {
      tempCvEvaluationId,
      temporalUserId,
      userId,
      cvId,
      jobId,
    } = event.data;

    await step.run("validate-active-route", async () => {
      const activeRoute = await getActiveRoute();
      if (!activeRoute) {
        await prisma.route.create({
          data: {
            name: "Mi primera ruta",
            userId,
            cvId, // Vinculamos al CV que ya existe
            status: RouteStatus.CV_CREATED
          }
        });
      }
    })

    await step.run("trigger-cv-upload", async () => {
      // 1. Validar data temporal
      const tempEval = await prisma.tempCvWithEvaluation.findUnique({
        where: { id: tempCvEvaluationId },
      });

      if (!tempEval || tempEval.tempUserId !== temporalUserId) {
        throw new Error("Datos temporales no válidos.");
      }

      // 2. Extraer de forma segura el contenido del JSON
      // Prisma tipa extractorOutput como JsonValue, por lo que forzamos el tipo aquí
      const extractorOutput = tempEval.extractorOutput as any;

      // 3. Validar específicamente la propiedad whichSectionsContain
      // Usamos el operador de encadenamiento opcional y un fallback a array vacío
      const selectedSections = Array.isArray(extractorOutput?.whichSectionsContain)
        ? (extractorOutput.whichSectionsContain as string[])
        : [];

      console.log("Secciones seleccionadas:", selectedSections);

      // 4. Enviar el evento
      await inngest.send({
        name: "cv/uploaded",
        data: {
          cvId,
          attachmentUrl: tempEval.fileUrl,
          userId,
          targetSections: selectedSections // Ahora garantizado como string[]
        },
      });
    });

    // 2. ESPERAR a que la función que procesa "cv/uploaded" termine
    // Debes asegurarte que esa otra función envíe "cv/upload.completed" al final
    const uploadResult = await step.waitForEvent("wait-for-upload", {
      event: "cv/upload.completed",
      timeout: "2m", // Subimos a 2m por si el procesamiento es lento
      if: `event.data.cvId == '${cvId}'`,
    });

    if (!uploadResult) {
      throw new Error("El procesamiento del CV tardó demasiado o falló.");
    }

    // --- PASO 2: TRIGGER EVALUACIÓN ---
    await step.run("trigger-cv-evaluation", async () => {
      const newEvaluation = await prisma.cvEvaluation.create({
        data: {
          cvId,
          status: JobStatus.IN_PROGRESS
        }
      })

      await inngest.send({
        name: "cv/ready-for-evaluation",
        data: {
          cvId,
          userId,
          evaluationId: newEvaluation.id,
        },
      });
    });

    // --- PASO 3: TRIGGER OPORTUNIDADES ---
    await step.run("trigger-opportunity-match", async () => {
      await inngest.send({
        name: "get.and.save.opportunities",
        data: {
          cvId,
          userId
        },
      });
    });

    step.run("update-job-step", async () => {
      await prisma.queueJob.update({
        where: {id: jobId},
        data: {
          status: JobStatus.SUCCEEDED,
        }
      })
    })

    return {success: true, cvId};
  }
);
