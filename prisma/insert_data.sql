-- =============================================================================
-- SEED: Countries + Scholarship Opportunities
-- Levely — Diagnóstico de Becas
-- =============================================================================
-- ScholarshipType enum values: MASTER | PHD | FELLOWSHIP
-- Run this inside a transaction so it's fully atomic.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. COUNTRIES
-- -----------------------------------------------------------------------------

INSERT INTO country (id, name, code, flag, "updatedAt")
VALUES
  ('country_gb', 'Reino Unido',    'GB', '🇬🇧', NOW()),
  ('country_us', 'Estados Unidos', 'US', '🇺🇸', NOW()),
  ('country_de', 'Alemania',       'DE', '🇩🇪', NOW()),
  ('country_fr', 'Francia',        'FR', '🇫🇷', NOW()),
  ('country_jp', 'Japón',          'JP', '🇯🇵', NOW())
  ON CONFLICT (id) DO UPDATE
                        SET name       = EXCLUDED.name,
                        flag       = EXCLUDED.flag,
                        "updatedAt" = NOW();

-- -----------------------------------------------------------------------------
-- 2. SCHOLARSHIP OPPORTUNITIES
-- -----------------------------------------------------------------------------

-- ── Reino Unido (5) ──────────────────────────────────────────────────────────

INSERT INTO scholarship_opportunity
(id, "countryId", name, type, requirements, benefits, deadline, url, "isActive", "updatedAt")
VALUES
  (
    'opp_uk_chevening',
    'country_gb',
    'Chevening Scholarship',
    'MASTER',
    ARRAY[
      'Título universitario de pregrado',
    'Mínimo 2 años de experiencia laboral',
    'Ciudadano de un país elegible Chevening',
    'Compromiso de retornar al país de origen por 2 años',
    'Potencial de liderazgo demostrado'
      ],
    ARRAY[
      'Matrícula completa en cualquier universidad del Reino Unido',
    'Estipendio mensual de manutención',
    'Pasaje aéreo de ida y vuelta',
    'Visa allowance y otros subsidios',
    'Acceso a red global de alumni Chevening'
      ],
    '2025-11-04 00:00:00',
    'https://www.chevening.org/scholarships/',
    true,
    NOW()
  ),
  (
    'opp_uk_commonwealth',
    'country_gb',
    'Commonwealth Scholarship',
    'MASTER',
    ARRAY[
      'Ciudadano de un país de la Commonwealth de bajos o medianos ingresos',
    'Título universitario con calificaciones sobresalientes',
    'No haber estudiado en el Reino Unido previamente con beca Commonwealth'
      ],
    ARRAY[
      'Matrícula universitaria completa',
    'Estipendio mensual de manutención',
    'Subsidio de instalación',
    'Pasaje aéreo ida y vuelta',
    'Seguro de viaje y salud'
      ],
    '2025-12-15 00:00:00',
    'https://cscuk.fcdo.gov.uk/scholarships/',
    true,
    NOW()
  ),
  (
    'opp_uk_gates_cambridge',
    'country_gb',
    'Gates Cambridge Scholarship',
    'PHD',
    ARRAY[
      'Ciudadano de cualquier país fuera del Reino Unido',
    'Postulación a un programa de posgrado full-time en Cambridge',
    'Excelencia académica sobresaliente',
    'Liderazgo demostrado y compromiso social'
      ],
    ARRAY[
      'Matrícula completa en la Universidad de Cambridge',
    'Estipendio anual de manutención (~£21,000)',
    'Pasaje aéreo de ida y vuelta',
    'Seguro médico completo',
    'Allowance para dependientes si aplica'
      ],
    '2025-10-16 00:00:00',
    'https://www.gatescambridge.org/apply/',
    true,
    NOW()
  ),
  (
    'opp_uk_rhodes',
    'country_gb',
    'Rhodes Scholarship',
    'MASTER',
    ARRAY[
      'Ciudadano de un país elegible Rhodes',
    'Entre 18 y 28 años al momento de la postulación',
    'Título universitario completo con excelencia académica',
    'Evidencia de liderazgo, carácter y compromiso con el servicio'
      ],
    ARRAY[
      'Matrícula completa en la Universidad de Oxford',
    'Estipendio mensual de manutención',
    'Pasaje aéreo de ida y vuelta',
    'Seguro médico'
      ],
    '2025-08-01 00:00:00',
    'https://www.rhodeshouse.ox.ac.uk/scholarships/',
    true,
    NOW()
  ),
  (
    'opp_uk_clarendon',
    'country_gb',
    'Clarendon Fund Scholarship',
    'PHD',
    ARRAY[
      'Postulación simultánea a un programa de posgrado en Oxford',
    'Mérito académico sobresaliente',
    'Ciudadano de cualquier país (incluye UK)'
      ],
    ARRAY[
      'Matrícula completa en la Universidad de Oxford',
    'Estipendio anual de manutención (~£18,000)',
    'Cobertura de college fees'
      ],
    '2026-01-22 00:00:00',
    'https://www.ox.ac.uk/clarendon',
    true,
    NOW()
  ),

-- ── Estados Unidos (4) ───────────────────────────────────────────────────────

  (
    'opp_us_fulbright',
    'country_us',
    'Fulbright Foreign Student Program',
    'MASTER',
    ARRAY[
      'Ciudadano de un país elegible Fulbright',
    'Título universitario de pregrado',
    'Nivel de inglés avanzado',
    'Dos años de residencia en el país de origen después de completar el programa'
      ],
    ARRAY[
      'Matrícula universitaria completa',
    'Estipendio mensual de manutención',
    'Pasaje aéreo de ida y vuelta',
    'Seguro de salud',
    'Enriquecimiento cultural y acceso a red Fulbright'
      ],
    '2025-10-15 00:00:00',
    'https://foreign.fulbrightonline.org/',
    true,
    NOW()
  ),
  (
    'opp_us_humphrey',
    'country_us',
    'Hubert H. Humphrey Fellowship',
    'FELLOWSHIP',
    ARRAY[
      'Mínimo 5 años de experiencia profesional',
    'Título universitario de pregrado',
    'Roles de liderazgo o gestión en sector público o social',
    'Ciudadano de un país elegible',
    'Compromiso de retornar al país de origen'
      ],
    ARRAY[
      'Programa no conducente a grado (professional development)',
    'Matrícula en universidad anfitriona asignada',
    'Estipendio mensual de manutención',
    'Pasaje aéreo de ida y vuelta',
    'Seguro de salud y subsidio para libros'
      ],
    '2025-09-30 00:00:00',
    'https://www.humphreyfellowship.org/apply/',
    true,
    NOW()
  ),
  (
    'opp_us_knight_hennessy',
    'country_us',
    'Knight-Hennessy Scholars — Stanford',
    'MASTER',
    ARRAY[
      'Título universitario con no más de 7 años de antigüedad',
    'Admisión simultánea a un programa de posgrado en Stanford',
    'Liderazgo demostrado y visión de impacto global',
    'Dominio del inglés'
      ],
    ARRAY[
      'Matrícula completa en Stanford University',
    'Estipendio anual de manutención (~$90,000 USD)',
    'Comunidad residencial en Denning House',
    'Pasaje aéreo anual',
    'Acceso a red de líderes globales'
      ],
    '2025-10-09 00:00:00',
    'https://knight-hennessy.stanford.edu/admission',
    true,
    NOW()
  ),
  (
    'opp_us_oas',
    'country_us',
    'OEA — Becas de Posgrado para América Latina',
    'MASTER',
    ARRAY[
      'Ciudadano de un país miembro de la OEA',
    'Título universitario de pregrado',
    'Carta de aceptación de una universidad en EE.UU. o Canadá',
    'Nivel de inglés o francés según destino'
      ],
    ARRAY[
      'Subsidio parcial o total de matrícula según convenio',
    'Estipendio mensual de manutención',
    'Seguro médico básico'
      ],
    '2026-03-31 00:00:00',
    'https://www.oas.org/en/scholarships/',
    true,
    NOW()
  ),

-- ── Alemania (4) ─────────────────────────────────────────────────────────────

  (
    'opp_de_daad',
    'country_de',
    'DAAD — Becas de Posgrado para Latinoamérica',
    'MASTER',
    ARRAY[
      'Título universitario de pregrado con calificaciones sobresalientes',
    'Menos de 6 años de haber egresado del pregrado',
    'Nivel de alemán o inglés según el programa elegido',
    'Ciudadano de un país latinoamericano'
      ],
    ARRAY[
      'Estipendio mensual de €850 (maestría) o €1,200 (doctorado)',
    'Seguro médico completo',
    'Pasaje aéreo de ida y vuelta',
    'Subsidio de instalación',
    'Posible subsidio de alemán previo a los estudios'
      ],
    '2025-10-15 00:00:00',
    'https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships/',
    true,
    NOW()
  ),
  (
    'opp_de_daad_epos',
    'country_de',
    'DAAD — EPOS Desarrollo Sostenible',
    'MASTER',
    ARRAY[
      'Título universitario de pregrado',
    'Mínimo 2 años de experiencia laboral en áreas de desarrollo',
    'Ciudadano de un país en desarrollo o emergente',
    'Nivel de inglés o alemán según programa'
      ],
    ARRAY[
      'Matrícula en programas de maestría orientados al desarrollo',
    'Estipendio mensual de €850',
    'Seguro médico',
    'Pasaje aéreo de ida y vuelta',
    'Cursos de idioma alemán'
      ],
    '2025-09-30 00:00:00',
    'https://www.daad.de/en/studying-in-germany/scholarships/development-related-postgraduate-courses-epos/',
    true,
    NOW()
  ),
  (
    'opp_de_kas',
    'country_de',
    'Fundación Konrad Adenauer — Beca Internacional',
    'MASTER',
    ARRAY[
      'Excelencia académica demostrada',
    'Ciudadano de un país no-UE',
    'Admisión a una universidad alemana',
    'Afinidad con valores democráticos y cristiano-occidentales',
    'Postulación antes del 15 de julio de cada año'
      ],
    ARRAY[
      'Estipendio mensual de €992 (maestría) o €1,400 (doctorado)',
    'Seguro médico y social',
    'Programa de seminarios y mentorías',
    'Acceso a red global KAS',
    'Asesoría académica personalizada'
      ],
    '2026-07-15 00:00:00',
    'https://www.kas.de/en/web/begabtenfoerderung-und-kultur/international-talent-development',
    true,
    NOW()
  ),
  (
    'opp_de_hbs',
    'country_de',
    'Fundación Heinrich Böll — Beca Internacional',
    'PHD',
    ARRAY[
      'Excelencia académica',
    'Ciudadano de un país no-UE',
    'Admisión a una universidad alemana',
    'Compromiso con valores ecologistas, feministas y de derechos humanos'
      ],
    ARRAY[
      'Estipendio mensual de €934 (maestría) o €1,200 (doctorado)',
    'Seguro médico',
    'Programa de eventos y red internacional',
    'Asesoría y acompañamiento académico'
      ],
    '2026-03-01 00:00:00',
    'https://www.boell.de/en/foundation/scholarship-programme',
    true,
    NOW()
  ),

-- ── Francia / Europa (3) ─────────────────────────────────────────────────────

  (
    'opp_fr_eiffel',
    'country_fr',
    'France Excellence — Beca Eiffel',
    'MASTER',
    ARRAY[
      'Ciudadano de un país no-francés',
    'Hasta 25 años para maestría, 30 para doctorado',
    'Postulación presentada por una institución francesa (no directamente)',
    'Excelencia académica sobresaliente'
      ],
    ARRAY[
      'Estipendio mensual de €1,200 (maestría) o €2,100 (doctorado)',
    'Subsidio de transporte internacional y nacional',
    'Seguro médico',
    'Ayuda para búsqueda de alojamiento',
    'Actividades culturales incluidas'
      ],
    '2026-01-08 00:00:00',
    'https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program',
    true,
    NOW()
  ),
  (
    'opp_fr_erasmus',
    'country_fr',
    'Erasmus Mundus Joint Master Degree',
    'MASTER',
    ARRAY[
      'Título universitario de pregrado',
    'Ciudadano de un país fuera de la UE (categoría international)',
    'Nivel de inglés avanzado (IELTS 6.5+ o equivalente)',
    'Aplicar directamente al consorcio de universidades del programa elegido'
      ],
    ARRAY[
      'Matrícula completa cubierta en todas las universidades del consorcio',
    'Estipendio mensual de €1,400',
    'Contribución a viajes entre países del consorcio',
    'Seguro de viaje y médico',
    'Experiencia en mínimo 2 países europeos'
      ],
    '2026-02-28 00:00:00',
    'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-joint-masters_en',
    true,
    NOW()
  ),
  (
    'opp_fr_sciences_po',
    'country_fr',
    'Sciences Po — Beca Émile Boutmy',
    'MASTER',
    ARRAY[
      'Admisión a un programa de maestría en Sciences Po',
    'Ciudadano de un país fuera de la UE',
    'Excelencia académica y potencial de liderazgo',
    'Demostración de necesidad financiera o mérito excepcional'
      ],
    ARRAY[
      'Reducción parcial o total de matrícula (hasta €19,000/año)',
    'Posibilidad de estipendio mensual adicional',
    'Acceso a red Sciences Po y empleadores internacionales'
      ],
    '2026-01-14 00:00:00',
    'https://www.sciencespo.fr/admissions/en/content/financial-aid-scholarships',
    true,
    NOW()
  ),

-- ── Japón (3) ────────────────────────────────────────────────────────────────

  (
    'opp_jp_mext',
    'country_jp',
    'MEXT — Beca del Gobierno Japonés',
    'MASTER',
    ARRAY[
      'Ciudadano de un país con relaciones diplomáticas con Japón',
    'Menor de 35 años al momento de la postulación',
    'Título universitario de pregrado',
    'Interés en aprender japonés (o nivel previo valorado)',
    'Buena salud física y mental'
      ],
    ARRAY[
      'Matrícula completa cubierta por el gobierno japonés',
    'Estipendio mensual de ¥144,000 (maestría) o ¥145,000 (doctorado)',
    'Pasaje aéreo de ida y vuelta',
    'Curso de japonés previo al inicio del programa',
    'Seguro médico básico'
      ],
    '2025-11-28 00:00:00',
    'https://www.mext.go.jp/en/policy/education/highered/title02/detail02/sdetail02/1373897.htm',
    true,
    NOW()
  ),
  (
    'opp_jp_jica',
    'country_jp',
    'JICA — Programa de Becas para América Latina',
    'MASTER',
    ARRAY[
      'Ciudadano de un país elegible JICA en América Latina',
    'Empleado activo de una institución gubernamental o pública',
    'Título universitario de pregrado',
    'Mínimo 2 años de experiencia profesional relevante',
    'Nivel de inglés o japonés según el programa'
      ],
    ARRAY[
      'Matrícula en universidad japonesa asignada',
    'Estipendio mensual de manutención',
    'Pasaje aéreo de ida y vuelta',
    'Seguro médico',
    'Curso de japonés incluido'
      ],
    '2025-10-31 00:00:00',
    'https://www.jica.go.jp/english/our_work/types_of_assistance/tech/training/',
    true,
    NOW()
  ),
  (
    'opp_jp_jasso',
    'country_jp',
    'JASSO — Beca para Estudiantes Internacionales',
    'FELLOWSHIP',
    ARRAY[
      'Admisión a una universidad japonesa',
    'Ciudadano de un país fuera de Japón',
    'Excelencia académica (GPA 2.30/3.00 o superior)',
    'No ser receptor de otra beca del gobierno japonés simultáneamente'
      ],
    ARRAY[
      'Estipendio mensual de ¥48,000',
    'Complemento a otras fuentes de financiamiento',
    'Acceso a servicios de apoyo estudiantil JASSO'
      ],
    '2026-04-30 00:00:00',
    'https://www.jasso.or.jp/en/study_j/scholarships/',
    true,
    NOW()
  );

COMMIT;
