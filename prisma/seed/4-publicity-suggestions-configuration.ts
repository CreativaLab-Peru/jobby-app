import {PrismaClient} from "@prisma/client";

export async function publicitySuggestionsConfiguration(prisma: PrismaClient) {
  try {
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
    for (const s of suggestions) {
      await prisma.routePublicitySuggestion.upsert({
        where: {id: `seed-${s.title.toLowerCase().replace(/\s+/g, "-")}`},
        update: s,
        create: {
          id: `seed-${s.title.toLowerCase().replace(/\s+/g, "-")}`,
          ...s,
          isActive: true,
        },
      });
    }
  } catch (e) {
    console.error("[ERROR_PUBLICITY_SUGGESTION_CONFIGURATION]", e);
  }
}
