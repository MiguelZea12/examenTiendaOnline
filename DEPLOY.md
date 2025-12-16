# 🚀 Guía Rápida de Despliegue en Vercel

Esta guía te ayudará a desplegar el frontend en Vercel paso a paso.

## 📋 Requisitos previos

- Cuenta de GitHub
- Cuenta de Vercel (puedes usar tu cuenta de GitHub)
- Proyecto configurado y funcionando localmente

---

## Método 1: Despliegue con CLI (Más rápido)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Navegar al frontend

```bash
cd frontend
```

### Paso 3: Login en Vercel

```bash
vercel login
```

Selecciona tu método de login (GitHub recomendado) y autoriza.

### Paso 4: Desplegar

```bash
vercel
```

Te hará algunas preguntas:

1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → Selecciona tu cuenta
3. **Link to existing project?** → `N` (No)
4. **What's your project's name?** → `tienda-online` (o el que prefieras)
5. **In which directory is your code located?** → `./` (presiona Enter)
6. **Want to modify settings?** → `N` (No)

Vercel empezará a desplegar. Al terminar te dará una URL como:
```
https://tienda-online-abc123.vercel.app
```

### Paso 5: Configurar variables de entorno

Las variables de entorno no se suben automáticamente por seguridad. Debes agregarlas:

```bash
vercel env add VITE_API_URL
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

Para cada variable:
1. Te preguntará el valor → Pégalo (del archivo `.env`)
2. Te preguntará para qué entornos → Selecciona **Production, Preview, Development** (presiona Espacio para marcar todos)

### Paso 6: Redesplegar con las variables

```bash
vercel --prod
```

✅ **¡Desplegado!** Tu aplicación está en: https://tienda-online-abc123.vercel.app

---

## Método 2: Despliegue con GitHub (Recomendado para actualizaciones automáticas)

### Paso 1: Subir código a GitHub

Si aún no lo has hecho:

```bash
# Inicializa git en la raíz del proyecto
cd ..  # Vuelve a la carpeta examen/
git init

# Añade archivos
git add .
git commit -m "Proyecto tienda online completo"

# Crea repositorio en GitHub y sube
git remote add origin https://github.com/TU-USUARIO/tienda-online.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Ve a https://vercel.com
2. Haz clic en "Add New" → "Project"
3. Selecciona "Import Git Repository"
4. Busca tu repositorio `tienda-online`
5. Haz clic en "Import"

### Paso 3: Configurar el proyecto

En la configuración del proyecto:

**Framework Preset:** Vite
**Root Directory:** `frontend` (muy importante)
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Paso 4: Añadir variables de entorno

En la sección "Environment Variables", añade una por una:

| Variable | Valor (desde tu .env) |
|----------|----------------------|
| `VITE_API_URL` | `http://localhost:3000/api` |
| `VITE_FIREBASE_API_KEY` | Tu API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Tu Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Tu Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Tu Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Tu App ID |

### Paso 5: Desplegar

Haz clic en "Deploy"

Espera 1-2 minutos y ¡listo!

✅ **¡Desplegado!** Vercel te dará una URL como: https://tienda-online-abc123.vercel.app

**Ventaja:** Cada vez que hagas `git push`, Vercel desplegará automáticamente.

---

## Método 3: Despliegue en Netlify (Alternativa)

### Con CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Navegar al frontend y compilar
cd frontend
npm run build

# Login en Netlify
netlify login

# Desplegar
netlify deploy --prod --dir=dist
```

### Con interfaz web

1. Compila el proyecto:
   ```bash
   cd frontend
   npm run build
   ```

2. Ve a https://app.netlify.com
3. Arrastra la carpeta `dist` a la página
4. Netlify desplegará automáticamente

Para variables de entorno:
- Ve a Site Settings → Build & Deploy → Environment
- Añade las mismas variables que en Vercel

---

## 🔧 Configuración post-despliegue

### Backend sigue en localhost

Si tu backend está en localhost, la app desplegada NO podrá conectarse (desde internet no se puede acceder a localhost).

**Opciones:**

**1. Mantener backend local (para desarrollo/pruebas)**
- Usa la app localmente (`http://localhost:5173`)
- La app desplegada solo sirve para mostrar la interfaz

**2. Desplegar backend también (recomendado para producción)**

Opciones para backend:
- **Railway**: https://railway.app (fácil, gratis hasta cierto límite)
- **Render**: https://render.com (gratis con limitaciones)
- **Heroku**: https://heroku.com (gratis básico)
- **Google Cloud Run**: Con Firebase ya estás en GCP

Una vez desplegues el backend, actualiza `VITE_API_URL` en Vercel:

```bash
# Con CLI
vercel env rm VITE_API_URL
vercel env add VITE_API_URL
# Ingresa: https://tu-backend-desplegado.com/api

# Redesplegar
vercel --prod
```

---

## 📊 Verificar el despliegue

### 1. Abrir la URL

Abre la URL que te dio Vercel (ej: https://tienda-online-abc123.vercel.app)

### 2. Verificar consola del navegador

1. Presiona F12 (DevTools)
2. Ve a la pestaña "Console"
3. No debería haber errores de Firebase
4. Si hay errores de red (fetch), es porque el backend está en localhost

### 3. Probar funcionalidad

**Si backend está en localhost:**
- Login/Register funcionará (usa Firebase directamente)
- Ver artículos/pedidos NO funcionará (necesita backend)

**Si backend está desplegado:**
- Todo debería funcionar normalmente

---

## 🎨 Personalizar dominio (Opcional)

### En Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Domains
3. Add Domain
4. Sigue las instrucciones para configurar DNS

Podrás usar algo como: `tienda.tudominio.com`

---

## 🔄 Actualizar el despliegue

### Con CLI:

```bash
cd frontend
vercel --prod
```

### Con GitHub:

```bash
git add .
git commit -m "Actualización"
git push
```

Vercel detectará el push y desplegará automáticamente.

---

## 📝 Información para tu entrega

Después de desplegar, actualiza el README.md principal con:

```markdown
## 🔗 Enlaces del proyecto

- **Frontend desplegado**: https://tu-app.vercel.app
- **Backend**: Corriendo en localhost:3000
- **Repositorio**: https://github.com/tu-usuario/tienda-online

## 🧪 Cuentas de prueba

**Vendedor:**
- Email: vendedor@test.com
- Password: 123456

**Cliente:**
- Email: cliente@test.com  
- Password: 123456
```

---

## 🐛 Solución de problemas

### Error: "Build failed"

**Causa**: Errores en el código o dependencias

**Solución**:
1. Compila localmente: `npm run build`
2. Si falla, corrige los errores
3. Si funciona localmente pero falla en Vercel, revisa los logs

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Causa**: El dominio de Vercel no está autorizado en Firebase

**Solución**:
1. Ve a Firebase Console
2. Authentication → Settings → Authorized domains
3. Añade tu dominio de Vercel (ej: `tienda-online-abc123.vercel.app`)

### La app se ve pero no funciona

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Verifica las variables en Vercel Dashboard
2. Asegúrate de que todas las `VITE_*` están presentes
3. Redesplega después de añadirlas

### Error: "Failed to fetch" o "Network Error"

**Causa**: Backend no accesible

**Solución**:
- Si backend está en localhost, solo funcionará localmente
- Despliega el backend o prueba la app localmente

---

## ✅ Checklist de despliegue

- [ ] Frontend compilado sin errores (`npm run build`)
- [ ] Cuenta de Vercel creada
- [ ] Proyecto desplegado
- [ ] Variables de entorno configuradas
- [ ] Dominio de Vercel añadido a Firebase Authorized Domains
- [ ] App abre correctamente
- [ ] Login/Register funciona
- [ ] README actualizado con enlace público

---

## 🎉 ¡Listo!

Tu aplicación ya está disponible públicamente. Comparte el enlace y prepara tu entrega.

**Estructura de entrega:**
```
📁 Carpeta o repositorio con:
├── backend/          (código fuente)
├── frontend/         (código fuente)
├── README.md         (con enlace público)
├── FIREBASE_SETUP.md (instrucciones Firebase)
└── DEPLOY.md         (este archivo)
```

¡Éxito con tu examen! 🎓
