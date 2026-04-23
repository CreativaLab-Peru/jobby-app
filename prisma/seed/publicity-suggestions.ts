import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const suggestions = [
    {
      title: "Chevening",
      description: "Beca · Reino Unido · Liderazgo",
      icon: "GraduationCap",
    },
    {
      title: "DAAD",
      description: "Beca · Alemania · Investigación",
      icon: "GraduationCap",
    },
    {
      title: "Fulbright",
      description: "Beca · Estados Unidos · Académica",
      icon: "GraduationCap",
    },
    {
      title: "France Excellence Eiffel",
      description: "Beca · Francia · Excelencia",
      icon: "GraduationCap",
    },
    {
      title: "MAECI",
      description: "Beca · Italia · Gobierno",
      icon: "GraduationCap",
    },
  ];

  console.log("Seeding route publicity suggestions...");

  for (const s of suggestions) {
    await prisma.routePublicitySuggestion.upsert({
      where: { id: `seed-${s.title.toLowerCase().replace(/\s+/g, "-")}` },
      update: s,
      create: {
        id: `seed-${s.title.toLowerCase().replace(/\s+/g, "-")}`,
        ...s,
        isActive: true,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
