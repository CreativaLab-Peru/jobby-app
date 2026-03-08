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
- **Campos:** `id`, `slug` (unique), `name`, `description?`, `paymentType` (SUBSCRIPTION | ONE_TIME | REFUND | FREE), `priceCents`, `currency`, `features?` (Json), `manualCvLimit`, `uploadCvLimit`.
- **Relación:** Tiene muchos `UserPayment`.

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
- **Campos:** `id`, `code`, `name`, `credits`, `priceCents`, `currency`, `active`, `type` (`CreditBalanceType`).
- **Relación:** Tiene muchos `Invoice`.

### `invoice` (Mapeado como `invoice`)
Facturas de pagos realizados por usuarios.
- **Campos:** `id`, `userId`, `amountTotal` (centavos), `currency`, `status` (`PaymentStatus`), `provider` ("STRIPE", "PAYPAL"), `providerTxId?` (unique), `planId?`, `packageId?`.
- **Relación:** Con `user` y opcionalmente con `CreditPackage`.

### Flujos de Créditos:
- **Adquisición de Créditos:** Compra de paquetes de créditos que incrementan `user_credit_balance`.
- **Consumo de Créditos:** Deducción de créditos al procesar CVs para evaluaciones de IA, reflejado en `credit_transaction`.
- **Recarga Automática:** Si el saldo de créditos cae por debajo de un umbral, se puede activar una recarga automática (si está habilitada).

---

## 🛠️ 6. Infraestructura y Auditoría

### `queue_job`
Gestión de tareas asíncronas para el procesamiento pesado de IA.
- **Resiliencia:** Maneja `attempts` y `maxAttempts` para reintentos automáticos tras fallos.

### `log_entry`
Registro de auditoría inmutable para debugging y seguridad.
- **Acciones:** `AUTH`, `PAYMENT`, `EVALUATION`, `FILE_UPLOAD`.

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

---

## 🚀 Comandos de Mantenimiento

1. **Sincronizar Esquema:** `npx prisma migrate dev`
2. **Explorar Datos:** `npx prisma studio`
3. **Generar Cliente:** `npx prisma generate`
