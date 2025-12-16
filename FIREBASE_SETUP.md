# 🔥 Guía Completa: Configuración de Firebase

Esta guía te llevará paso a paso para configurar Firebase para este proyecto.

## 📋 Índice

1. [Crear proyecto en Firebase](#1-crear-proyecto-en-firebase)
2. [Configurar Authentication](#2-configurar-authentication)
3. [Configurar Firestore Database](#3-configurar-firestore-database)
4. [Obtener credenciales para Backend](#4-obtener-credenciales-para-backend)
5. [Obtener credenciales para Frontend](#5-obtener-credenciales-para-frontend)

---

## 1. Crear proyecto en Firebase

1. **Accede a Firebase Console**
   - Ve a https://console.firebase.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crea un nuevo proyecto**
   - Haz clic en "Agregar proyecto" o "Add project"
   - Nombre del proyecto: `tienda-online` (o el que prefieras)
   - Haz clic en "Continuar"

3. **Google Analytics (Opcional)**
   - Puedes deshabilitarlo para este proyecto de prueba
   - O déjalo habilitado si lo deseas
   - Haz clic en "Crear proyecto"

4. **Espera a que se cree**
   - Tomará unos segundos
   - Haz clic en "Continuar" cuando esté listo

---

## 2. Configurar Authentication

1. **Accede a Authentication**
   - En el menú lateral, haz clic en "Build" > "Authentication"
   - Haz clic en "Get started" o "Comenzar"

2. **Habilita Email/Password**
   - Haz clic en la pestaña "Sign-in method"
   - Busca "Email/Password" en la lista
   - Haz clic en él
   - Activa el switch de "Enable" (Habilitar)
   - **NO** actives "Email link (passwordless sign-in)"
   - Haz clic en "Save" o "Guardar"

✅ **¡Authentication configurado!**

---

## 3. Configurar Firestore Database

1. **Accede a Firestore**
   - En el menú lateral, haz clic en "Build" > "Firestore Database"
   - Haz clic en "Create database" o "Crear base de datos"

2. **Selecciona el modo**
   - Selecciona "Start in **production mode**"
   - Haz clic en "Next" o "Siguiente"

3. **Selecciona la ubicación**
   - Selecciona una ubicación cercana (ej: europe-west1 para Europa)
   - Haz clic en "Enable" o "Habilitar"
   - Espera unos segundos mientras se crea

4. **Configura las reglas de seguridad**
   - Haz clic en la pestaña "Rules" o "Reglas"
   - **Reemplaza** todo el contenido con esto:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   - Haz clic en "Publish" o "Publicar"

   ⚠️ **IMPORTANTE**: Estas reglas permiten acceso total. Son solo para desarrollo. Para producción, usa reglas más restrictivas (ver README.md principal).

✅ **¡Firestore configurado!**

---

## 4. Obtener credenciales para Backend

Estas credenciales son para el **Firebase Admin SDK** que usa el backend.

### Paso 1: Acceder a Service Accounts

1. Haz clic en el ícono de **⚙️ (Settings)** en la parte superior izquierda
2. Selecciona "Project settings" o "Configuración del proyecto"
3. Ve a la pestaña "**Service accounts**"

### Paso 2: Generar clave privada

1. Asegúrate de estar en "Firebase Admin SDK"
2. Selecciona **Node.js** como lenguaje
3. Haz clic en "**Generate new private key**" o "Generar nueva clave privada"
4. Confirma haciendo clic en "Generate key" o "Generar clave"
5. Se descargará un archivo JSON (ej: `tienda-online-abc123.json`)

### Paso 3: Extraer las credenciales

Abre el archivo JSON descargado. Verás algo así:

```json
{
  "type": "service_account",
  "project_id": "tienda-online-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@tienda-online-12345.iam.gserviceaccount.com",
  ...
}
```

### Paso 4: Configurar backend/.env

Copia los valores al archivo `backend/.env`:

```env
PORT=3000
FIREBASE_PROJECT_ID=tienda-online-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@tienda-online-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

**Valores a copiar:**
- `FIREBASE_PROJECT_ID`: valor de `project_id`
- `FIREBASE_CLIENT_EMAIL`: valor de `client_email`
- `FIREBASE_PRIVATE_KEY`: valor completo de `private_key` (con comillas)

⚠️ **IMPORTANTE**: 
- La `FIREBASE_PRIVATE_KEY` debe estar entre comillas dobles
- Debe incluir los `\n` tal como están en el JSON
- NO subas este archivo `.env` a GitHub

✅ **¡Backend configurado!**

---

## 5. Obtener credenciales para Frontend

Estas credenciales son para la **Web App** que usa el frontend.

### Paso 1: Registrar una Web App

1. En Firebase Console, ve a Project Settings (⚙️)
2. En la pestaña "General", baja hasta "Your apps"
3. Si no tienes ninguna app web, verás botones con íconos
4. Haz clic en el ícono de **</>** (Web)

### Paso 2: Registrar la app

1. Dale un nickname: `Tienda Online Web` (o el que prefieras)
2. **NO** marques "Also set up Firebase Hosting"
3. Haz clic en "Register app" o "Registrar app"

### Paso 3: Copiar la configuración

Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "tienda-online-12345.firebaseapp.com",
  projectId: "tienda-online-12345",
  storageBucket: "tienda-online-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Paso 4: Configurar frontend/.env

Copia los valores al archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=tienda-online-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tienda-online-12345
VITE_FIREBASE_STORAGE_BUCKET=tienda-online-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

✅ **¡Frontend configurado!**

---

## 🎉 ¡Configuración completa!

Ahora puedes:

1. **Iniciar el backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Iniciar el frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Abrir en el navegador:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

---

## 🔍 Verificar que todo funciona

### 1. Verificar Backend

Abre en el navegador: http://localhost:3000

Deberías ver:
```json
{"message":"API Tienda funcionando correctamente"}
```

### 2. Verificar Frontend

Abre en el navegador: http://localhost:5173

Deberías ver la página de login/registro.

### 3. Probar Registro

1. Haz clic en "Regístrate"
2. Completa el formulario
3. Si funciona, serás redirigido al panel correspondiente

### 4. Verificar en Firebase Console

**Authentication:**
1. Ve a Firebase Console > Authentication > Users
2. Deberías ver el usuario que acabas de crear

**Firestore:**
1. Ve a Firebase Console > Firestore Database
2. Deberías ver una colección `usuarios` con un documento

---

## 🐛 Problemas comunes

### Error: "Error initializing Firebase" en backend

**Causa**: Credenciales incorrectas en `backend/.env`

**Solución**:
- Verifica que copiaste bien el `project_id`, `client_email` y `private_key`
- Asegúrate de que la `private_key` esté entre comillas dobles
- Verifica que los `\n` estén presentes en la clave

### Error: "Firebase: Error (auth/api-key-not-valid)" en frontend

**Causa**: API Key incorrecta en `frontend/.env`

**Solución**:
- Verifica que copiaste bien la `apiKey` del firebaseConfig
- No debe tener espacios antes o después

### Error: "Cannot find module 'firebase-admin'" en backend

**Causa**: Dependencias no instaladas

**Solución**:
```bash
cd backend
npm install
```

### Error: "Failed to fetch" en frontend

**Causa**: Backend no está corriendo

**Solución**:
- Verifica que el backend esté corriendo en http://localhost:3000
- Verifica que `VITE_API_URL` en `frontend/.env` sea correcta

### Los usuarios se crean en Firebase Auth pero no en Firestore

**Causa**: Las reglas de Firestore son muy restrictivas

**Solución**:
- Ve a Firestore > Rules
- Asegúrate de tener las reglas que se mostraron en el paso 3.4

---

## 📝 Archivos finales

Después de configurar todo, deberías tener:

```
examen/
├── backend/
│   ├── .env  ← Configurado con credenciales de Firebase Admin
│   └── ...
├── frontend/
│   ├── .env  ← Configurado con credenciales de Firebase Web
│   └── ...
└── README.md
```

---

## 🔐 Seguridad

⚠️ **NUNCA** subas a GitHub:
- `backend/.env`
- `frontend/.env`
- El archivo JSON de Service Account

Estos archivos ya están en `.gitignore` para protegerlos.

---

## ✅ Checklist de configuración

- [ ] Proyecto de Firebase creado
- [ ] Authentication habilitado con Email/Password
- [ ] Firestore Database creado
- [ ] Reglas de Firestore configuradas
- [ ] Service Account key descargado
- [ ] `backend/.env` configurado
- [ ] Web App registrada en Firebase
- [ ] `frontend/.env` configurado
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Registro de usuario funciona
- [ ] Usuario aparece en Firebase Console

---

¿Necesitas ayuda? Revisa la sección de problemas comunes o consulta el README.md principal.
