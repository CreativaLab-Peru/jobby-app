# 📄 Documentación de Base de Datos (Entity Relationship)

Esta documentación técnica describe la arquitectura de datos del sistema de gestión de CVs, procesado de IA y suscripciones basada en el esquema de Prisma.

---

## 🏗️ 1. Dominio de Identidad y Acceso (Auth)

### `user` (Mapeado como `user`)
Es el núcleo del sistema. Almacena el estado de autenticación, cumplimiento legal y flags de seguridad.
- **Campos Críticos:** `isBlocked` (Seguridad), `acceptedTermsAt` (Legal), `happensAfterPayment` (Flujo de negocio).
- **Relaciones:** Implementa relaciones en cascada para cumplir con normativas de privacidad (GDPR).
### `session` & `account`
- **`account`**: Almacena vinculaciones OAuth (Google, etc.) o credenciales.
- **`session`**: Control de estado de sesión con persistencia de metadatos del cliente (`ipAddress`, `userAgent`).

---

## 📄 2. Dominio de Contenido (Resume Core)

### `cv` (Mapeado como `cv`)
Documento principal que puede ser de diferentes categorías (`CvType`) e idiomas (`Language`).
- **`extractedJson`**: Almacena la data estructurada resultante del parseo inicial.
- **`fullTextSearch`**: Campo optimizado para búsquedas globales de texto.

### `cv_section`
Representa los bloques modulares de un CV (Experiencia, Educación, etc.).
- **Atributo `order`**: Controla la jerarquía visual en el cliente de Next.js.

---

## 🧠 3. Dominio de Inteligencia y Análisis

### `cv_evaluation`
Contenedor de resultados de IA para un CV específico.
- **`overallScore`**: Promedio ponderado del perfil.
- **`status`**: Controla el ciclo de vida del análisis (`PENDING`, `IN_PROGRESS`, `SUCCEEDED`, `FAILED`).

### `evaluation_score` & `recommendation`
- **`evaluation_score`**: Desglose técnico numérico por cada sección del CV.
- **`recommendation`**: Sugerencias accionables con nivel de severidad (`severity`) para el usuario.

---

## 💳 4. Dominio de Negocio (Monetización) 

### `user_credit_balance` y `credit_transaction` agregados para un sistema de créditos más flexible.
- **`user_credit_balance`**: Saldo actual de créditos del usuario.
- **`credit_transaction`**: Historial detallado de transacciones de créditos (adiciones y deducciones).
- **`TransactionType`:** Enum para diferenciar tipos de transacciones (`PURCHASE`, `CONSUMPTION`, `REFUND`).
- **`CreditBalanceType`:** Enum para clasificar saldos (`MANAGE_CVS`, `AI_ACTIONS`).
### Example Workflows de Créditos:
- **Adquisición de Créditos:** Compra de paquetes de créditos que incrementan `user_credit_balance`.
- **Consumo de Créditos:** Deducción de créditos al procesar CVs para evaluaciones de IA, reflejado en `credit_transaction`.
- **Recarga Automática:** Si el saldo de créditos cae por debajo de un umbral, se puede activar una recarga automática (si está habilitada).

---

## 🛠️ 5. Infraestructura y Auditoría

### `queue_job`
Gestión de tareas asíncronas para el procesamiento pesado de IA.
- **Resiliencia:** Maneja `attempts` y `maxAttempts` para reintentos automáticos tras fallos.

### `log_entry`
Registro de auditoría inmutable para debugging y seguridad.
- **Acciones:** `AUTH`, `PAYMENT`, `EVALUATION`, `FILE_UPLOAD`.

---

## 🚦 Diccionario de Tipos (Enums Clave)

| Enum | Propósito |
| :--- | :--- |
| `Language` | Soporte multilingüe (EN, ES). |
| `OpportunityType` | Clasifica el CV según el objetivo (Full-time, Freelance, etc.). |
| `CvSectionType` | Identificadores únicos para bloques del CV. |
| `JobStatus` | Ciclo de vida de tareas asíncronas. |
| `LogAction` | Categorización de eventos de sistema para logs. |

---

## 🚀 Comandos de Mantenimiento

1. **Sincronizar Esquema:** `npx prisma migrate dev`
2. **Explorar Datos:** `npx prisma studio`
3. **Generar Cliente:** `npx prisma generate`
