# Plan de Desarrollo: Flujo B2B de invitación para Levely Business

## Objetivo
Implementar un flujo simple, seguro y escalable para crear empresas, compartir un enlace de acceso y gestionar invitaciones B2B usando el esquema existente de Prisma, con un enfoque **KISS** y sin introducir tablas o estados innecesarios.

## Principios de diseño
- Reutilizar al máximo los modelos existentes: `Company`, `CompanyInvitation`, `CompanyMember`, `CompanyNotification` y `CompanyOnboardingStatus`.
- Evitar estados nuevos mientras el MVP pueda resolverse con el esquema actual.
- Priorizar una UX clara: primero crear empresa, luego copiar enlace, después invitar miembros.
- Mantener la lógica de seguridad y expiración dentro del backend.

---

## 1. Flujo corregido del usuario

### Paso 1: Crear empresa
El primer paso del flujo debe ser la creación de la empresa sobre el modelo `Company`.

**Campos obligatorios**
- `name`
- `slug`

**Campos opcionales definidos en el modelo**
- `logoUrl`
- `ruc`
- `website`
- `primaryColor`

**Comportamiento**
- `onboardingStep` inicia en `STEP_1`.
- `isActive` se mantiene en `true` por defecto.
- `seekingTypes` se define en el siguiente paso del onboarding, no en la creación inicial.
- Si el slug ya existe, mostrar validación inmediata antes de guardar.

### Paso 2: Copiar enlace
Una vez creada la empresa, la UI debe mostrar una acción clara para **copiar el enlace**.

**Recomendación**
- Copiar el enlace público basado en `slug`, por ejemplo: `levely.app/join/[slug]`.
- Mostrar feedback visual de éxito al copiar.
- Ofrecer también una vista previa del enlace para compartirlo.

### Paso 3: Completar onboarding de empresa
Después de crear la empresa, continuar con la configuración mínima del negocio.

- `STEP_1`: datos básicos de la empresa.
- `STEP_2`: qué busca la empresa (`seekingTypes`).
- `STEP_3`: invitar miembros.
- `COMPLETED`: onboarding finalizado.

### Paso 4: Invitar miembros
Usar `CompanyInvitation` para generar invitaciones individuales.

- Crear `token` único.
- Generar `code` de 6 dígitos.
- Guardar `codeHash`.
- Definir `expiresAt` con vencimiento por defecto de 48 horas.
- Registrar `invitedBy` para auditoría.

### Paso 5: Verificación y conversión
Cuando el invitado accede al enlace:

- Validar vigencia del token.
- Pedir correo electrónico.
- Enviar OTP por email.
- Comparar el código con `codeHash`.
- Si es correcto, crear `CompanyMember`.
- Marcar la invitación como `ACCEPTED` y guardar `usedAt`.

---

## 2. Backend: orden recomendado de implementación

### Fase A: Empresa y enlace
1. Crear la acción `createCompanyAction`.
2. Validar `name` y `slug` con Zod.
3. Generar slug único o pedirlo explícitamente y validar unicidad.
4. Retornar el enlace copiable para la UI.

### Fase B: Invitaciones
1. Crear el servicio `invitation.service.ts`.
2. Implementar `createInvitation(companyId, email, role, adminId)`.
3. Generar token y OTP.
4. Hashear el OTP con `bcrypt` o `argon2`.
5. Enviar el email con Resend/Postmark.

### Fase C: Validación
1. Implementar `verifyCode(token, code)`.
2. Validar expiración y estado.
3. Marcar la invitación como `ACCEPTED`.
4. Crear el miembro en `CompanyMember`.

### Fase D: Limpieza y seguridad
1. Expirar invitaciones antiguas con un cron job o job programado.
2. Evitar duplicados con `@@unique([companyId, userId])`.
3. Restringir permisos por rol.

---

## 3. Frontend: estructura mínima de pantallas

### Pantalla 1: Crear empresa
- Formulario simple.
- Campos base visibles al inicio.
- Campos opcionales colapsables o secundarios.
- CTA principal: **Crear empresa**.
- Al guardar: mostrar botón **Copiar enlace**.

### Pantalla 2: Invitación
- Lista de invitaciones activas.
- Botón para generar nueva invitación.
- Copia rápida del enlace individual.
- Estado visible de la invitación: pendiente, aceptada, expirada.

### Pantalla 3: Join flow
- Entrada por enlace.
- Verificación de email.
- OTP de 6 dígitos.
- Confirmación final y redirección al onboarding.

---

## 4. Seguridad y permisos

- `ADMIN`: control total de empresa e invitaciones.
- `ENCARGADO`: puede administrar miembros según reglas del negocio.
- `SUB_ENCARGADO`: limitado a invitar `MIEMBRO`.
- `MIEMBRO`: acceso operativo sin permisos administrativos.
- Las invitaciones deben expirar y no reutilizarse.
- El OTP debe almacenarse solo como hash.

---

## 5. Criterios del MVP

Para cerrar la primera versión, el MVP debe incluir:
1. Crear empresa con campos obligatorios y opcionales del modelo.
2. Copiar enlace después de crear la empresa.
3. Generar invitaciones individuales.
4. Verificar invitación con OTP.
5. Crear el `CompanyMember` automáticamente.
6. Marcar la invitación como usada o expirada.

---

## 6. Siguientes pasos inmediatos
1. Implementar `createCompanyAction` y su formulario.
2. Agregar el botón **Copiar enlace** en la vista de empresa creada.
3. Crear el servicio de invitación y el flujo OTP.
4. Construir la página dinámica `/join/[token]`.
5. Preparar el email template para el código de 6 dígitos.

---

## 7. Riesgos y simplificaciones

### Riesgos
- Duplicidad de miembros si no se valida por `companyId + userId`.
- Confusión entre enlace público por `slug` e invitación individual por `token`.
- Expiración no aplicada correctamente si no existe un job de limpieza.

### Simplificación recomendada
- Mantener el enlace copiable basado en `slug` para compartir rápidamente la empresa.
- Mantener el `token` para la invitación individual segura.
- No introducir tablas adicionales hasta que el MVP esté validado.

