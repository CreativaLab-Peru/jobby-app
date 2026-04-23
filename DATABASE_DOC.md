# 📄 Documentación de Base de Datos (Entity Relationship)

Esta documentación técnica describe la arquitectura de datos del sistema de gestión de CVs, procesado de IA y suscripciones basada en el esquema de Prisma.

---

## 🏗️ 1. Dominio de Identidad y Acceso (Auth)

### `user` (Mapeado como `user`)
Es el núcleo del sistema. Almacena el estado de autenticación, cumplimiento legal y flags de seguridad.
- **Campos Críticos:** `isBlocked` (Seguridad), `acceptedTermsAt` (Legal), `happensAfterPayment` (Flujo de negocio), `role` (USER | ADMIN).
- **Relaciones:** Implementa relaciones en cascada para cumplir con normativas de privacidad (GDPR).

### `temporal_user` (Mapeado como `temporal_user`)
Almacena emails de usuarios temporales (leads) capturados antes de un registro completo.
- **Campos:** `id`, `email` (unique), `date`.
- **Uso:** Pre-registro, captura de interés.

### `temporal_user` (Mapeado como `temporal_user`)
Almacena emails de usuarios temporales (leads) capturados antes de un registro completo.
- **Campos:** `id`, `email` (unique), `date`.
- **Uso:** Pre-registro, captura de interés.

### `session` & `account`
- **`account`**: Almacena vinculaciones OAuth (Google, etc.) o credenciales.
- **`session`**: Control de estado de sesión con persistencia de metadatos del cliente (`ipAddress`, `userAgent`).

### `verification_code` (Mapeado como `verification_code`)
Códigos de verificación para acciones como registro o recuperación de contraseña.
- **Campos:** `id`, `code`, `userId`, `expiresAt`, `createdAt`.
- **Relación:** Cascada con `user`.

### `verification` (Mapeado como `verification`)
Modelo requerido por Better Auth para OAuth y verificación de email.
- **Campos:** `id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt`.

### `magic_link_token` (Mapeado como `magic_link_token`)
Tokens de inicio de sesión por magic link.
- **Campos:** `id`, `userId`, `tokenHash`, `purpose?`, `expiresAt`, `usedAt?`, `usedByIp?`, `usedByUa?`, `metadata?`.
- **Índices:** `[userId]`, `[tokenHash]`.
- **Relación:** Cascada con `user`.

---

## 👤 2. Dominio de Perfil y Preferencias

### `user_preference` (Mapeado como `user_preference`)
Preferencias profesionales del usuario para búsqueda de empleo y matching con oportunidades.
- **Perfil:** `country`, `expLevel`, `preferredRoles[]`, `targetIndustries[]`.
- **Modalidad:** `workModality[]`, `relocation`, `availability[]`, `opportunityTypes[]`.
- **Skills:** `skills` (Json[]) — array de objetos `{ name, level }`.
- **Salario:** `minSalary`, `maxSalary`, `currency`.
- **Portfolio:** `portfolioUrl`.
- **UI:** `theme` ("light" | "dark").
- **Constraint:** `userId` unique — un usuario tiene una sola preferencia.

---

## 📄 3. Dominio de Contenido (Resume Core)

### `cv` (Mapeado como `cv`)
Documento principal que puede ser de diferentes categorías (`CvType`) e idiomas (`Language`).
- **`extractedJson`**: Almacena la data estructurada resultante del parseo inicial.
- **`fullTextSearch`**: Campo optimizado para búsquedas globales de texto.
- **`templateId`**: FK hacia `CvTemplate` (`@default("harvard")`). Define la plantilla visual utilizada para renderizar el CV. Plantillas disponibles: `harvard`, `europass`, `stem`, `fullbright`.

### `cv_section`
Representa los bloques modulares de un CV (Experiencia, Educación, etc.).
- **Atributo `order`**: Controla la jerarquía visual en el cliente de Next.js.

### `attachment` (Mapeado como `attachment`)
Archivos adjuntos asociados a un CV (PDF original subido).
- **Campos:** `id`, `cvId`, `filename`, `mimeType?`, `url`, `size?`, `createdAt`.
- **Índice:** `[cvId]`.

### `cv_preview` (Mapeado como `cv_preview`)
Snapshots de renderizado del CV para vista previa rápida.
- **Campos:** `id`, `cvId`, `snapshotHtml?`, `snapshotJson?`, `createdAt`, `createdBy?`, `note?`.
- **Índice:** `[cvId, createdAt]`.

### `opportunity` (Mapeado como `opportunity`)
Oportunidades laborales encontradas por el motor de matching para un CV específico.
- **Campos:** `id`, `cvId`, `title`, `type`, `deadline?`, `match` (score decimal), `requirements`, `linkUrl`, `company?`, `location?`, `modality?`, `salary?`, `description?`, `benefits?`.
- **Clave primaria compuesta:** `[id, cvId]`.
- **Relación:** Cascada con `cv`.

### `interview_session` (Mapeado como `interview_session`)
Sesiones de simulación de entrevista con IA (Vapi) vinculadas a un CV y una oportunidad.
- **Campos:** `id`, `userId`, `cvId`, `opportunityId`, `vapiCallId?` (unique), `status` (PENDING | COMPLETED | FAILED).
- **KPIs:** `overallScore`, `confidence`, `clarity`, `alignment` (0-100), `feedback`, `transcript` (Json).
- **Índices:** `[userId]`, `[opportunityId, cvId]`.
- **Relación:** Con `user`, `cv`, y `opportunity` (referencia compuesta `[opportunityId, cvId]`).

---

## 🧠 4. Dominio de Inteligencia y Análisis

### `cv_evaluation`
Contenedor de resultados de IA para un CV específico.
- **`overallScore`**: Promedio ponderado del perfil.
- **`status`**: Controla el ciclo de vida del análisis (`PENDING`, `IN_PROGRESS`, `SUCCEEDED`, `FAILED`).

### `evaluation_score` & `recommendation`
- **`evaluation_score`**: Desglose técnico numérico por cada sección del CV.
- **`recommendation`**: Sugerencias accionables con nivel de severidad (`severity`) para el usuario.

---

## 💳 5. Dominio de Negocio (Monetización)

### `subscription_plan` (Mapeado como `subscription_plan` — modelo `PaymentPlan`)
Planes de pago disponibles en la plataforma.
- **Campos:** `id`, `slug` (unique), `name`, `description?`, `paymentType` (SUBSCRIPTION | ONE_TIME | REFUND | FREE), `priceCentsPEN` (Mercado Pago), `priceCentsUSD` (Paddle), `paddleProductId?`, `paddlePriceIdUSD?`, `features?` (Json), `manualCvLimit`, `uploadCvLimit`.
- **Relaciones:** Tiene muchos `UserPayment` y muchos `CreditPackage`.
- **Notas de integración:** precios se almacenan en centavos; para Mercado Pago se convierten a monto PEN al generar la preferencia (`unit_price`).

### `user_subscription` (Mapeado como `user_subscription` — modelo `UserPayment`)
Registro de pagos/suscripciones de usuarios a planes.
- **Campos:** `id`, `userId`, `planId`, `startedAt`, `expiresAt?`, `active`, `manualCvsUsed`, `uploadCvsUsed`, `metadata?` (Json).
- **Índices:** `[userId]`, `[planId]`, `[active]`.

### `user_credit_balance` y `credit_transaction`
Sistema de créditos flexible.
- **`user_credit_balance`**: Saldo actual de créditos del usuario por tipo (`CreditBalanceType`). Constraint unique `[userId, type]`.
- **`credit_transaction`**: Historial detallado de transacciones de créditos (positivo = recarga, negativo = consumo). Campos: `balanceId`, `amount`, `type` (`TransactionType`), `description?`, `metadata?`.

### `credit_package` (Mapeado como `credit_package`)
Paquetes de créditos disponibles para compra.
- **Campos:** `id`, `code`, `name`, `credits`, `priceCents`, `currency`, `active`, `type` (`CreditBalanceType`), `planId?` (FK a `subscription_plan`).
- **Relación:** Tiene muchos `Invoice`. Opcionalmente pertenece a un `PaymentPlan` — permite agrupar paquetes por plan en el panel de administración.
- **Convención actual:** al crear/editar un plan admin se sincronizan 3 paquetes por tipo (`MANAGE_CVS`, `AI_ACTIONS`, `SEARCH_OPPORTUNITIES`) asociados por `planId`.

### `invoice` (Mapeado como `invoice`)
Facturas de pagos realizados por usuarios.
- **Campos:** `id`, `userId`, `amountTotal` (centavos), `currency`, `status` (`PaymentStatus`), `provider` ("STRIPE", "PAYPAL"), `providerTxId?` (unique), `planId?`, `packageId?`.
- **Relación:** Con `user` y opcionalmente con `CreditPackage`.

### Flujos de Créditos:
- **Adquisición de Créditos:** Compra de plan/paquete que recarga `user_credit_balance` según los `credit_package` asociados al `planId`.
- **Consumo de Créditos:** Deducción de créditos al procesar CVs para evaluaciones de IA, reflejado en `credit_transaction`.
- **Fallback de recarga:** si no se encuentran paquetes por plan, el sistema puede usar límites del plan como fallback para evitar pérdida de crédito post-pago.

---

## 🛠️ 6. Infraestructura y Auditoría

### `queue_job` (Mapeado como `queue_job`)
Gestión de tareas asíncronas para el procesamiento pesado de IA.
- **Resiliencia:** Control de `attempts` y `maxAttempts` (default 5).

### `log_entry` (Mapeado como `log_entry`)
Auditoría de eventos (AUTH, PAYMENT, EVALUATION, etc.) para debugging y seguridad.

### `cv_section_configuration` (Mapeado como `cv_section_configuration`)
Motor de reglas que define qué secciones requiere cada tipo de CV según la oportunidad.
- **Unique:** `[cvType, opportunityType]` — Garantiza una configuración única por combinación.

### `temp_cv_with_evaluation` (Mapeado como `temp_cv_with_evaluation`)
Persistencia temporal para usuarios no registrados que prueban la herramienta.
- **Campos:** `tempUserId`, `overallScore`, `extractorOutput`, `fileUrl`.
---

## 📋 7. Dominio de Cumplimiento (Compliance)

### `complaint` (Mapeado como `complaint`)
Almacena los reclamos enviados por usuarios a través del Libro de Reclamaciones (`/complaints`).
- **Campos:** `id`, `userId`, `name`, `email`, `phone?`, `complaint`, `createdAt`.
- **Restricción de negocio:** Solo se permite un reclamo por usuario por día (validado en la server action antes de insertar).
- **Relación:** Cascada con `user` — si el usuario se elimina, sus reclamos también se eliminan.
- **Índice:** `[userId, createdAt]` optimizado para la consulta de límite diario.
- **Flujo:** Al enviar un reclamo, primero se persiste en esta tabla y luego se envía un email a `contacto@joinlevely.com`. Si el email falla, el reclamo queda igualmente registrado en BD.

---

## �️ 8. Dominio de Plantillas y Multimedia

### `cv_template` (Mapeado como `cv_template`)
Catálogo de plantillas visuales disponibles para generar un CV.
- **Campos:** `id`, `name`, `description?`, `category`, `isPremium`, `requiresPhoto`, `isActive`, `displayOrder`, `createdAt`, `updatedAt`.
- **Plantillas iniciales:** `harvard` (profesional), `europass` (europeo), `stem` (técnico), `fullbright` (becas).
- **Relación:** Un `cv` pertenece a una `cv_template` mediante `templateId` (FK RESTRICT, `@default("harvard")`).

### `cv_photo` (Mapeado como `cv_photo`)
Almacena la foto de perfil subida por el usuario para incluirla en plantillas que la requieren (e.g. Europass).
- **Campos:** `id`, `userId`, `url`, `publicId`, `createdAt`.
- **Índice:** `[userId]`.
- **Relación:** Cascada con `user` — si el usuario se elimina, su foto también.

---

## 🗺️ 9. Dominio de Rutas Guiadas

### `route` (Mapeado como `route`)
Representa una ruta guiada del usuario que agrupa un CV, su análisis y oportunidades en un flujo paso a paso.
- **Campos:** `id`, `userId`, `cvId?` (unique, nullable hasta que se cree un CV), `name`, `status` (`RouteStatus`), `isActive`, `createdAt`, `updatedAt`.
- **Índices:** `[userId]`, `[userId, isActive]`.
- **Relaciones:** Pertenece a `user` (CASCADE), opcionalmente vincula a `cv` (1:1).
- **Flujo:** CV_PENDING → CV_CREATED → ANALYSIS_PENDING → ANALYSIS_DONE → OPPORTUNITIES_PENDING → OPPORTUNITIES_DONE → ROADMAP_PENDING → ROADMAP_DONE.

---

## 🗺️ 10. Dominio de Roadmaps

### `roadmap` (Mapeado como `roadmap`)
Roadmap generado por IA para una oportunidad específica. Contiene los pasos que el usuario debe seguir para conseguir esa oportunidad.
- **Campos:** `id`, `userId`, `cvId`, `opportunityId`, `status` (`JobStatus`), `title?`, `summary?` (Text), `createdByJobId?`, `createdAt`, `updatedAt`.
- **Constraint único:** `[opportunityId, cvId, userId]` — máximo un roadmap por oportunidad+cv+usuario.
- **Índices:** `[userId]`, `[cvId]`.
- **Relaciones:** Pertenece a `user` (CASCADE), pertenece a `opportunity` (CASCADE, compuesto por `[opportunityId, cvId]`), tiene muchos `roadmap_step`.

### `roadmap_step` (Mapeado como `roadmap_step`)
Paso individual dentro de un roadmap. Cada paso es accionable y ordenado cronológicamente.
- **Campos:** `id`, `roadmapId`, `order`, `title`, `description` (Text), `actionItems` (Json — array de strings), `estimatedDays?`, `resources?` (Json — array de `{ title, url?, type }`), `isFree` (boolean, default false), `createdAt`.
- **`isFree`:** Determina si el paso es visible para usuarios sin plan de pago. Solo el primer paso es gratuito por defecto.
- **Índice:** `[roadmapId, order]`.
- **Relación:** Pertenece a `roadmap` (CASCADE).

---

## 📢 11. Dominio de Publicidad y Sugerencias

### `route_publicity_suggestion` (Mapeado como `route_publicity_suggestion`)
Sugerencias globales de publicidad o próximos pasos que se muestran en el flujo de creación de rutas.
- **Campos:** `id`, `icon?` (Nombre del icono de Lucide), `title`, `description?`, `isActive`, `createdAt`, `updatedAt`.
- **Uso:** Proporcionar opciones preconfiguradas (ej: "Potenciar Inglés", "Mejorar Soft Skills") durante el onboarding de la ruta para enriquecer la experiencia del usuario.

---

## 🚦 Diccionario de Tipos (Enums Clave)

| Enum | Propósito |
| :--- | :--- |
| `Language` | Soporte multilingüe (EN, ES). |
| `OpportunityType` | Clasifica el tipo de oportunidad: INTERNSHIP, SCHOLARSHIP, EXCHANGE_PROGRAM, EMPLOYMENT, STARTUP. |
| `CvType` | Categoría profesional del CV: TECHNOLOGY_ENGINEERING, DESIGN_CREATIVITY, MARKETING_STRATEGY, etc. |
| `CvSectionType` | Identificadores únicos para bloques del CV: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, etc. |
| `JobStatus` | Ciclo de vida de tareas asíncronas: PENDING, IN_PROGRESS, SUCCEEDED, FAILED, CANCELLED. |
| `LogAction` | Categorización de eventos de sistema: CREATE, UPDATE, DELETE, LOGIN, PAYMENT, EVALUATION, etc. |
| `LogLevel` | Severidad de logs: INFO, WARNING, ERROR, CRITICAL. |
| `UserRole` | Roles de usuario: USER, ADMIN. |
| `PaymentType` | Tipo de pago de un plan: SUBSCRIPTION, ONE_TIME, REFUND, FREE. |
| `PaymentStatus` | Estado de factura: PENDING, PAID, FAILED, REFUNDED. |
| `CreditBalanceType` | Tipo de saldo de créditos: AI_ACTIONS, UPLOADS, MANAGE_CVS, SEARCH_OPPORTUNITIES. |
| `TransactionType` | Tipo de transacción de créditos: RECHARGE, CONSUMPTION, REFUND, BONUS. |
| `RouteStatus` | Ciclo de vida de la ruta guiada: CV_PENDING, CV_CREATED, ANALYSIS_PENDING, ANALYSIS_DONE, OPPORTUNITIES_PENDING, OPPORTUNITIES_DONE, ROADMAP_PENDING, ROADMAP_DONE. |

---

## 🚀 Comandos de Mantenimiento

1. **Sincronizar Esquema:** `npx prisma migrate dev`
2. **Explorar Datos:** `npx prisma studio`
3. **Generar Cliente:** `npx prisma generate`
