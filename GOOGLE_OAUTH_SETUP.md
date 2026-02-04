# 🚀 Guía de Configuración - Autenticación con Google OAuth

## ✅ Implementación Completada

La autenticación con Google OAuth ha sido implementada exitosamente en tu aplicación. A continuación, los pasos para completar la configuración.

---

## 📋 Pasos para Configurar Google OAuth

### 1️⃣ Obtener Credenciales de Google

1. **Ir a Google Cloud Console**
   - URL: https://console.cloud.google.com/

2. **Crear o Seleccionar un Proyecto**
   - Si no tienes proyecto, crea uno nuevo
   - Nombre sugerido: "Jobby App" o similar

3. **Habilitar Google+ API (o Google Identity)**
   - Menú lateral: "APIs y servicios" → "Biblioteca"
   - Busca "Google+ API" o "Google Identity Services"
   - Click en "Habilitar"

4. **Configurar Pantalla de Consentimiento OAuth**
   - Ve a: "APIs y servicios" → "Pantalla de consentimiento de OAuth"
   - Tipo de usuario: **Externo**
   - Información de la aplicación:
     - Nombre: "Jobby"
     - Email de soporte: tu email
     - Logo (opcional)
   - Ámbitos: Selecciona los básicos:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Guarda y continúa

5. **Crear Credenciales OAuth 2.0**
   - Ve a: "APIs y servicios" → "Credenciales"
   - Click en "Crear credenciales" → "ID de cliente de OAuth 2.0"
   - Tipo de aplicación: **Aplicación web**
   - Nombre: "Jobby Web Client"

6. **Configurar URLs Autorizadas**

   **Orígenes de JavaScript autorizados:**
   - Desarrollo: `http://localhost:3000`
   - Producción: `https://tudominio.com`

   **URIs de redireccionamiento autorizados:**
   - Desarrollo: `http://localhost:3000/api/auth/callback/google`
   - Producción: `https://tudominio.com/api/auth/callback/google`

7. **Copiar Credenciales**
   - Aparecerá un modal con:
     - ✅ **Client ID** (ej: `123456789-abc123.apps.googleusercontent.com`)
     - ✅ **Client Secret** (ej: `GOCSPX-abc123xyz`)
   - ⚠️ **Guárdalas en un lugar seguro**

---

### 2️⃣ Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local` en la raíz del proyecto:

```bash
# ===========================================
# GOOGLE OAUTH - CREDENCIALES
# ===========================================
GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui

# ===========================================
# AUTENTICACIÓN - Better Auth
# ===========================================
# Generar secret con: openssl rand -base64 32
BETTER_AUTH_SECRET=tu-secret-key-generada-aqui

# URLs de la aplicación
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Para generar `BETTER_AUTH_SECRET`:**
```bash
openssl rand -base64 32
```

---

### 3️⃣ Instalar Dependencias (si es necesario)

Las dependencias ya están en el proyecto, pero por si acaso:

```bash
npm install better-auth
# o
pnpm install better-auth
```

---

### 4️⃣ Actualizar Base de Datos

Better Auth ya está configurado con Prisma y debería funcionar automáticamente. El modelo `Account` ya está preparado para OAuth.

Si necesitas recrear la base de datos:

```bash
npx prisma migrate dev
```

---

## 🎯 Cómo Funciona

### Flujo de Registro con Google:

1. **Usuario hace clic en "Registrarse con Google"** (en `/onboarding/talents`)
2. Se abre ventana de Google OAuth
3. Usuario selecciona cuenta de Google
4. Google redirige a `/api/auth/callback/google`
5. Better Auth crea el usuario automáticamente
6. Usuario es redirigido al onboarding para completar preferencias
7. El paso de "Crear cuenta" detecta que viene de OAuth:
   - ✅ Email autocompletado (read-only)
   - ✅ Nombre autocompletado desde Google
   - ❌ NO pide contraseña (se autentica con Google)
8. Al finalizar → redirige a `/dashboard`

### Flujo de Login con Google:

1. **Usuario hace clic en "Continuar con Google"** (en `/login`)
2. Se abre ventana de Google OAuth
3. Usuario selecciona cuenta de Google
4. Si el usuario ya existe → redirige a `/dashboard`
5. Si el usuario es nuevo → redirige a onboarding

---

## 📁 Archivos Modificados/Creados

### ✅ Archivos Creados:
- `app/api/auth/[...all]/route.ts` - API handler de Better Auth _(ya existía)_
- `features/authentication/components/google-oauth-button.tsx` - Botón de Google
- `utils/oauth-utils.ts` - Utilidades para detectar usuarios OAuth
- `.env.example` - Template de variables de entorno

### ✅ Archivos Modificados:
- `lib/auth.ts` - Configuración de Google OAuth en Better Auth
- `lib/auth-client.ts` - Cliente con baseURL configurada
- `features/authentication/components/login-form.tsx` - Botón de Google agregado
- `features/onboarding/components/welcome-step.tsx` - Botón de Google en onboarding
- `features/onboarding/components/account-step.tsx` - Detecta usuarios OAuth
- `features/onboarding/components/talent-onboarding-form.tsx` - Maneja registro OAuth
- `features/onboarding/schemas/index.ts` - Contraseñas opcionales para OAuth

---

## 🧪 Testing

### Desarrollo Local:

1. **Asegúrate de tener las variables de entorno configuradas**
2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. **Prueba el flujo:**
   - Ve a `http://localhost:3000/login`
   - Click en "Continuar con Google"
   - Deberías ver la ventana de autenticación de Google

### Errores Comunes:

**❌ "redirect_uri_mismatch"**
- Solución: Verifica que `http://localhost:3000/api/auth/callback/google` esté en Google Console

**❌ "Invalid client"**
- Solución: Verifica `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en `.env.local`

**❌ Variables de entorno no se cargan**
- Solución: Reinicia el servidor de desarrollo después de modificar `.env.local`

---

## 🚀 Despliegue a Producción

### En Vercel/Netlify:

1. **Agregar variables de entorno en el dashboard:**
   ```
   GOOGLE_CLIENT_ID=tu-client-id
   GOOGLE_CLIENT_SECRET=tu-client-secret
   BETTER_AUTH_SECRET=tu-secret
   BETTER_AUTH_URL=https://tudominio.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://tudominio.com
   ```

2. **Actualizar URLs en Google Cloud Console:**
   - Orígenes: `https://tudominio.com`
   - Redirección: `https://tudominio.com/api/auth/callback/google`

3. **Redesplegar la aplicación**

---

## 📊 Características Implementadas

✅ Login con Google  
✅ Registro con Google  
✅ Onboarding para usuarios OAuth  
✅ Detección automática de usuarios OAuth  
✅ Contraseñas opcionales para OAuth  
✅ Botón con logo de Google  
✅ Manejo de errores  
✅ Redirección inteligente post-autenticación  
✅ Datos autocompletados desde Google (email, nombre)  

---

## 🔐 Seguridad

- ✅ Las credenciales de Google nunca se almacenan en el código
- ✅ Better Auth maneja los tokens de forma segura
- ✅ Los secrets están en variables de entorno
- ✅ HTTPS requerido en producción
- ✅ Validación de redirect URIs por Google

---

## 📞 Soporte

Si encuentras algún problema:

1. Verifica las variables de entorno
2. Revisa la consola del navegador para errores
3. Verifica los logs del servidor
4. Confirma que las URLs en Google Console son correctas

---

## 🎉 ¡Listo!

Tu aplicación ahora soporta autenticación con Google OAuth. Los usuarios pueden:
- Registrarse con Google
- Iniciar sesión con Google
- Completar el onboarding después de autenticarse

**Siguiente paso:** Configura las credenciales de Google y prueba el flujo completo.
