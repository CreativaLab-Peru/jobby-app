import { PrismaClient, ScholarshipType } from "@prisma/client";

export async function seedCountriesAndOpportunities(prisma: PrismaClient) {
  try {
    // Countries
    const countries = [
      { name: "Reino Unido", code: "UK", flag: "🇬🇧" },
      { name: "Estados Unidos", code: "US", flag: "🇺🇸" },
      { name: "Alemania", code: "DE", flag: "🇩🇪" },
      { name: "Francia / Europa", code: "EU", flag: "🇫🇷" },
      { name: "Japón", code: "JP", flag: "🇯🇵" },
    ];

    const createdCountries: Record<string, string> = {};

    for (const country of countries) {
      const created = await prisma.country.upsert({
        where: { code: country.code },
        update: { name: country.name, flag: country.flag },
        create: { name: country.name, code: country.code, flag: country.flag },
      });
      createdCountries[country.code] = created.id;
    }

    // Scholarship Opportunities
    const opportunities = [
      // UK - Reino Unido
      {
        countryCode: "UK",
        name: "Chevening",
        type: ScholarshipType.FELLOWSHIP,
        requirements: [
          "Licenciatura completada",
          "2+ años de experiencia profesional",
          "Dominio del inglés (IELTS 6.5+)",
          "Liderazgo y compromiso social",
        ],
        benefits: [
          "Tuición completa (tuition fees)",
          "Bolsa de living mensual",
          "Vuelos de ida y vuelta",
          "Asistencia para visado",
        ],
        url: "https://www.chevening.org/",
      },
      {
        countryCode: "UK",
        name: "Commonwealth",
        type: ScholarshipType.MASTER,
        requirements: [
          "Ciudadano de país Commonwealth",
          "Licenciatura con alto rendimiento",
          "Compromiso de retorno al país de origen",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa de living",
          "Vuelos",
          "Allowance para materiales",
        ],
        url: "https://www.commonwealthscholarships.org/",
      },
      {
        countryCode: "UK",
        name: "British Council",
        type: ScholarshipType.MASTER,
        requirements: [
          "Ciudadano de país elegible",
          "Licenciatura completada",
          "INGLÉS B1+",
        ],
        benefits: [
          "Becas parciales y completas",
          "Vuelos",
          "Support académico",
        ],
        url: "https://www.britishcouncil.org/",
      },

      // US - Estados Unidos
      {
        countryCode: "US",
        name: "Fulbright",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura completada",
          "Examen de inglés (TOEFL/IELTS)",
          "Experiencia profesional relevante",
          "Plan de estudios claro",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa de living anual",
          "Vuelos",
          "Seguro médico",
        ],
        url: "https://fulbrightprogram.org/",
      },
      {
        countryCode: "US",
        name: "Hubert Humphrey",
        type: ScholarshipType.FELLOWSHIP,
        requirements: [
          "10+ años de experiencia profesional",
          "Liderazgo en sector público/privado",
          "Inglés avanzado",
          "Compromiso de retorno",
        ],
        benefits: [
          "Programa de desarrollo liderazgo",
          "Tuición completa",
          "Bolsa de living",
          "Vuelos",
        ],
        url: "https://www.huberthumphreyfellowship.org/",
      },

      // DE - Alemania
      {
        countryCode: "DE",
        name: "DAAD",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura completada",
          "Inglés B2+ o Alemán C1+",
          "CV y cartas de recomendación",
          "Plan de investigación",
        ],
        benefits: [
          "Bolsa mensual (~850-1200€)",
          "Tuición en universidades públicas",
          "Vuelos parciales",
          "Seguro de salud",
        ],
        url: "https://www.daad.de/en/",
      },
      {
        countryCode: "DE",
        name: "Heinrich Böll",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura completada",
          "Fuertes convicciones ambientales/sociales",
          "Inglés B2+ o Alemán B2+",
          "Compromiso demostrable",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa de living",
          "Vuelos",
          "Red de alumni",
        ],
        url: "https://www.boell.de/en/",
      },
      {
        countryCode: "DE",
        name: "Humboldt",
        type: ScholarshipType.PHD,
        requirements: [
          "Maestría completada",
          "Propuesta de investigación",
          "Mentor de universidad alemana",
          "Inglés o Alemán avanzado",
        ],
        benefits: [
          "Bolsa mensual (~1200-2000€)",
          "Vuelos",
          "Soporte de investigación",
          "Red académica",
        ],
        url: "https://www.humboldt-foundation.de/en/",
      },

      // EU - Francia/Europa
      {
        countryCode: "EU",
        name: "Eiffel",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura menor a 30 años",
          "Inglés B2+ o Francés B2+",
          "Aceptación de universidad francesa",
          "Excelente expediente académico",
        ],
        benefits: [
          "Bolsa mensual (~1100-1400€)",
          "Tuición reducida",
          "Vuelos",
          "Seguro médico",
        ],
        url: "https://www.campusfrance.org/en/eiffel-program",
 },
      {
        countryCode: "EU",
        name: "Erasmus Mundus",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura completada",
          "Inglés B2+",
          "Aplicación a programa conjunto",
          "Expediente académico destacado",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa de living",
          "Vuelos",
          "Movilidad entre universidades europeas",
        ],
        url: "https://erasmus-plus.ec.europa.eu/",
      },
      {
        countryCode: "EU",
        name: "Becas UE",
        type: ScholarshipType.MASTER,
        requirements: [
          "Ciudadano de país第三世界",
          "Licenciatura completada",
          "Inglés B2+",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa de living",
          "Vuelos",
          "Seguro médico",
        ],
        url: "https://ec.europa.eu/",
      },

      // JP - Japón
      {
        countryCode: "JP",
        name: "MEXT",
        type: ScholarshipType.MASTER,
        requirements: [
          "Licenciatura completada",
          "Inglés o Japonés según programa",
          "Edad menor a 35 años",
          "Examen de aptitud académico",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa mensual (~120,000-150,000 ¥)",
          "Vuelos de ida y vuelta",
          "Seguro médico completo",
        ],
        url: "https://www.studyinjapan.go.jp/",
 },
      {
        countryCode: "JP",
        name: "JICA",
        type: ScholarshipType.FELLOWSHIP,
        requirements: [
          "Experiencia profesional en área指定ada",
          "Nombramiento por gobierno",
          "Inglés B2+",
          "Edad 25-45 años",
        ],
        benefits: [
          "Programa de capacitación",
          "Bolsa de living",
          "Vuelos",
          "Alojamiento",
 ],
        url: "https://www.jica.go.jp/",
      },
      {
        countryCode: "JP",
        name: "Monbukagakusho",
        type: ScholarshipType.PHD,
        requirements: [
          "Maestría completada",
          "Propuesta de investigación",
          "Japonés N2+ o Inglés avanzado",
          "Capacidad de investigación demostrada",
        ],
        benefits: [
          "Tuición completa",
          "Bolsa mensual completa",
          "Vuelos",
          "Alojamiento",
 ],
        url: "https://www.studyinjapan.go.jp/",
      },
    ];

    for (const opp of opportunities) {
      const countryId = createdCountries[opp.countryCode];
      if (!countryId) continue;

      await prisma.scholarshipOpportunity.upsert({
        where: {
          id: `${opp.countryCode}-${opp.name.toLowerCase().replace(/\s+/g, "-")}`,
        },
        update: {
          countryId,
          name: opp.name,
          type: opp.type,
          requirements: opp.requirements,
          benefits: opp.benefits,
          url: opp.url,
          isActive: true,
        },
        create: {
          id: `${opp.countryCode}-${opp.name.toLowerCase().replace(/\s+/g, "-")}`,
          countryId,
          name: opp.name,
          type: opp.type,
          requirements: opp.requirements,
          benefits: opp.benefits,
          url: opp.url,
          isActive: true,
        },
      });
    }

    console.log("[SEED] Countries and opportunities seeded successfully");
  } catch (e) {
    console.error("[ERROR_SEED_COUNTRIES_OPPORTUNITIES]", e);
  }
}
