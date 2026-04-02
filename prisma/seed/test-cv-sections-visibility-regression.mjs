import assert from "assert";
import { PrismaClient, CvSectionType, OpportunityType } from "@prisma/client";

const prisma = new PrismaClient();
const TEST_PREFIX = "cv-sections-visibility-test";

function now() {
  return new Date();
}

function buildSectionsPayload(cvData) {
  const payload = [];

  if (cvData.personal) {
    payload.push({
      type: CvSectionType.SUMMARY,
      content: { text: cvData.personal.summary ?? "" },
      defaultTitle: "Resumen",
    });
    payload.push({
      type: CvSectionType.CONTACT,
      content: cvData.personal,
      defaultTitle: "Información de Contacto",
    });
  }

  const map = {
    education: { type: CvSectionType.EDUCATION, title: "Educación" },
    experience: { type: CvSectionType.EXPERIENCE, title: "Experiencia Profesional" },
    projects: { type: CvSectionType.PROJECTS, title: "Proyectos" },
    achievements: { type: CvSectionType.ACHIEVEMENTS, title: "Logros" },
    certifications: { type: CvSectionType.CERTIFICATIONS, title: "Certificaciones" },
    volunteering: { type: CvSectionType.VOLUNTEERING, title: "Voluntariado" },
    complements: { type: CvSectionType.COMPLEMENTS, title: "Complementos" },
    interests: { type: CvSectionType.INTERESTS, title: "Intereses" },
    languages: { type: CvSectionType.LANGUAGES, title: "Idiomas" },
  };

  for (const [key, meta] of Object.entries(map)) {
    const sectionData = cvData[key];
    if (sectionData && "items" in sectionData) {
      payload.push({
        type: meta.type,
        content: sectionData.items,
        defaultTitle: meta.title,
      });
    }
  }

  if (cvData.skills) {
    payload.push({
      type: CvSectionType.SKILLS,
      content: cvData.skills,
      defaultTitle: "Habilidades",
    });
  }

  return payload;
}

async function applyUserSync(cvId, cvData) {
  const existingCv = await prisma.cv.findFirst({
    where: { id: cvId, deletedAt: null },
    include: {
      sections: {
        select: {
          sectionType: true,
          order: true,
          isVisible: true,
          isRecommended: true,
          title: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  assert.ok(existingCv, "CV de prueba debe existir");

  const allowedSectionTypes = existingCv.sections.map((s) => s.sectionType);
  const sectionMetaMap = new Map(existingCv.sections.map((s) => [s.sectionType, s]));
  const allPayload = buildSectionsPayload(cvData);

  const sectionsToUpdate = allPayload.filter(
    (s) => allowedSectionTypes.includes(s.type) || s.type === CvSectionType.SUMMARY,
  );

  await prisma.$transaction(
    sectionsToUpdate.map((section, index) => {
      const sectionMeta = sectionMetaMap.get(section.type);
      return prisma.cvSection.upsert({
        where: {
          cvId_sectionType: {
            cvId,
            sectionType: section.type,
          },
        },
        update: {
          contentJson: section.content,
          updatedAt: new Date(),
        },
        create: {
          cvId,
          sectionType: section.type,
          title: sectionMeta?.title ?? section.defaultTitle,
          order: sectionMeta?.order ?? existingCv.sections.length + index + 1,
          isVisible: sectionMeta?.isVisible ?? true,
          isRecommended: sectionMeta?.isRecommended ?? false,
          contentJson: section.content,
        },
      });
    }),
  );
}

async function createFixture(label) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user = await prisma.user.create({
    data: {
      name: `Test ${label}`,
      email: `${TEST_PREFIX}+${label}-${stamp}@example.com`,
      emailVerified: true,
      createdAt: now(),
      updatedAt: now(),
    },
  });

  const cv = await prisma.cv.create({
    data: {
      userId: user.id,
      opportunityType: OpportunityType.EMPLOYMENT,
      createdAt: now(),
      updatedAt: now(),
    },
  });

  return { user, cv };
}

async function testPreserveSectionVisibilityAndOrder() {
  const { cv } = await createFixture("preserve");

  await prisma.cvSection.createMany({
    data: [
      {
        cvId: cv.id,
        sectionType: CvSectionType.CONTACT,
        title: "Contacto custom",
        contentJson: { fullName: "John" },
        order: 2,
        isVisible: false,
        isRecommended: true,
      },
      {
        cvId: cv.id,
        sectionType: CvSectionType.EXPERIENCE,
        title: "Experiencia custom",
        contentJson: [{ company: "ACME" }],
        order: 3,
        isVisible: true,
        isRecommended: false,
      },
    ],
  });

  const cvData = {
    personal: {
      summary: "Nuevo resumen",
      fullName: "John Test",
      email: "john@example.com",
      phone: "999",
      address: "Lima",
      linkedin: "",
    },
    experience: { items: [{ company: "Updated" }] },
  };

  await applyUserSync(cv.id, cvData);

  const contact = await prisma.cvSection.findUnique({
    where: { cvId_sectionType: { cvId: cv.id, sectionType: CvSectionType.CONTACT } },
  });

  assert.ok(contact, "CONTACT debe existir");
  assert.strictEqual(contact.isVisible, false, "CONTACT debe conservar isVisible=false");
  assert.strictEqual(contact.order, 2, "CONTACT debe conservar order");
  assert.strictEqual(contact.title, "Contacto custom", "CONTACT debe conservar título custom");

  const summary = await prisma.cvSection.findUnique({
    where: { cvId_sectionType: { cvId: cv.id, sectionType: CvSectionType.SUMMARY } },
  });
  assert.ok(summary, "SUMMARY debe crearse si faltaba");
}

async function testDoNotReactivateHiddenSection() {
  const { cv } = await createFixture("hidden");

  await prisma.cvSection.create({
    data: {
      cvId: cv.id,
      sectionType: CvSectionType.SKILLS,
      title: "Habilidades",
      contentJson: { hard: ["TS"] },
      order: 5,
      isVisible: false,
      isRecommended: false,
    },
  });

  const cvData = {
    personal: {
      summary: "Resumen",
      fullName: "Jane",
      email: "jane@example.com",
      phone: "111",
      address: "Cusco",
      linkedin: "",
    },
    skills: { hard: ["Node"], soft: ["Comunicación"] },
  };

  await applyUserSync(cv.id, cvData);

  const skills = await prisma.cvSection.findUnique({
    where: { cvId_sectionType: { cvId: cv.id, sectionType: CvSectionType.SKILLS } },
  });

  assert.ok(skills, "SKILLS debe existir");
  assert.strictEqual(skills.isVisible, false, "SKILLS no debe reactivarse al guardar contenido");
  assert.strictEqual(skills.order, 5, "SKILLS debe conservar order");
}

async function testSectionAbsentInPayloadRemainsUntouched() {
  const { cv } = await createFixture("absent");

  await prisma.cvSection.createMany({
    data: [
      {
        cvId: cv.id,
        sectionType: CvSectionType.PROJECTS,
        title: "Proyectos custom",
        contentJson: [{ name: "Project A" }],
        order: 7,
        isVisible: false,
        isRecommended: true,
      },
      {
        cvId: cv.id,
        sectionType: CvSectionType.CONTACT,
        title: "Contacto",
        contentJson: { fullName: "Laura" },
        order: 1,
        isVisible: true,
        isRecommended: false,
      },
    ],
  });

  const cvData = {
    personal: {
      summary: "Resumen sin proyectos",
      fullName: "Laura",
      email: "laura@example.com",
      phone: "222",
      address: "Arequipa",
      linkedin: "",
    },
    // Omitimos projects para simular deselección/ausencia en payload de usuario
  };

  await applyUserSync(cv.id, cvData);

  const projects = await prisma.cvSection.findUnique({
    where: { cvId_sectionType: { cvId: cv.id, sectionType: CvSectionType.PROJECTS } },
  });

  assert.ok(projects, "PROJECTS debe seguir existiendo cuando no viene en payload");
  assert.strictEqual(projects.isVisible, false, "PROJECTS debe conservar isVisible original");
  assert.strictEqual(projects.order, 7, "PROJECTS debe conservar order original");
  assert.strictEqual(projects.title, "Proyectos custom", "PROJECTS debe conservar título original");
}

async function cleanup() {
  const users = await prisma.user.findMany({
    where: { email: { startsWith: `${TEST_PREFIX}+` } },
    select: { id: true },
  });

  const userIds = users.map((u) => u.id);
  if (!userIds.length) return;

  const cvs = await prisma.cv.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const cvIds = cvs.map((c) => c.id);

  if (cvIds.length) {
    await prisma.cvSection.deleteMany({ where: { cvId: { in: cvIds } } });
    await prisma.cv.deleteMany({ where: { id: { in: cvIds } } });
  }

  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

async function run() {
  try {
    await cleanup();

    await testPreserveSectionVisibilityAndOrder();
    console.log("✅ Caso A OK: conserva visibilidad/order/título en secciones existentes");

    await testDoNotReactivateHiddenSection();
    console.log("✅ Caso B OK: no reactiva secciones ocultas al actualizar contenido");

    await testSectionAbsentInPayloadRemainsUntouched();
    console.log("✅ Caso C OK: sección ausente en payload conserva estado/configuración");

    console.log("\n🎉 Tests de regresión activate/deactivate pasaron");
  } catch (e) {
    console.error("❌ Falló test de regresión activate/deactivate:", e);
    process.exitCode = 1;
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

await run();
