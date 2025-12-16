# Frontend - Tienda Online (Svelte)

Frontend de la tienda online desarrollado con Svelte, Vite y Firebase Authentication.

## 🚀 Características

- Autenticación con Firebase (Login/Register)
- Panel de Vendedor: CRUD de artículos y gestión de pedidos
- Panel de Cliente: Ver artículos y realizar pedidos
- Interfaz responsive y moderna
- Rutas protegidas por rol

## 📋 Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- Backend corriendo (ver backend/README.md)

## 🔧 Configuración de Firebase

### 1. Obtener configuración web de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Abre tu proyecto
3. Ve a **Project Settings** (⚙️)
4. En la sección **Your apps**, selecciona el ícono web (`</>`)
5. Si no tienes una app web, crea una nueva
6. Copia los valores de configuración

## ⚙️ Instalación

1. Instala las dependencias:

```bash
cd frontend
npm install
```

2. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

3. Edita `.env` con tu configuración de Firebase:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Todos estos valores los encuentras en Firebase Console > Project Settings > Your apps**

## 🏃‍♂️ Ejecutar la aplicación

### Modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista previa de producción:

```bash
npm run preview
```

## 🌐 Desplegar en Vercel (Recomendado)

### Opción 1: Desde la terminal

1. Instala Vercel CLI:

```bash
npm i -g vercel
```

2. Despliega:

```bash
vercel
```

3. Sigue las instrucciones y configura las variables de entorno en Vercel Dashboard

### Opción 2: Desde GitHub

1. Sube el código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Haz clic en "New Project"
4. Importa tu repositorio
5. Configura las variables de entorno (todas las que empiezan con `VITE_`)
6. Despliega

**Importante:** Recuerda actualizar `VITE_API_URL` con la URL pública de tu backend (si lo despliegas) o mantén localhost si el backend está local.

## 🌐 Desplegar en Netlify

1. Compila el proyecto:

```bash
npm run build
```

2. Instala Netlify CLI:

```bash
npm i -g netlify-cli
```

3. Despliega:

```bash
netlify deploy --prod --dir=dist
```

4. Configura las variables de entorno en Netlify Dashboard

## 📱 Uso de la aplicación

### Registro

1. Abre la aplicación
2. Haz clic en "Regístrate"
3. Completa el formulario y selecciona tu rol:
   - **Vendedor**: Podrá crear y gestionar artículos, ver pedidos
   - **Cliente**: Podrá ver artículos y hacer pedidos

### Como Vendedor

1. Inicia sesión con una cuenta de vendedor
2. **Mis Artículos**:
   - Crea nuevos artículos con nombre, descripción, precio, stock e imagen
   - Edita o elimina tus artículos
3. **Pedidos Recibidos**:
   - Ve todos los pedidos con datos del cliente
   - Actualiza el estado de los pedidos (pendiente, procesando, enviado, entregado, cancelado)

### Como Cliente

1. Inicia sesión con una cuenta de cliente
2. **Tienda**:
   - Navega por los artículos disponibles
   - Haz clic en "Comprar" para realizar un pedido
   - Completa tus datos de envío
3. **Mis Pedidos**:
   - Ve el estado de tus pedidos
   - Revisa los detalles de cada pedido

## 🎨 Estructura del proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth.svelte         # Login/Register
│   │   ├── Vendedor.svelte     # Panel de vendedor
│   │   └── Cliente.svelte      # Panel de cliente
│   ├── lib/
│   │   └── api.js              # Funciones para llamar a la API
│   ├── stores/
│   │   └── auth.js             # Store de autenticación
│   ├── App.svelte              # Componente principal
│   ├── firebase.js             # Configuración de Firebase
│   └── main.js                 # Punto de entrada
├── index.html
├── vite.config.js
└── package.json
```

## 🐛 Solución de problemas

### Error: "Network request failed"

- Verifica que el backend esté corriendo
- Verifica que `VITE_API_URL` en `.env` sea correcta

### Error: "Firebase: Error (auth/...)"

- Verifica las credenciales de Firebase en `.env`
- Asegúrate de que Authentication esté habilitado en Firebase Console

### No se puede registrar usuarios

- Verifica que Email/Password esté habilitado en Firebase Authentication

### Errores CORS

- El backend debe tener CORS habilitado (ya está configurado)
- Verifica que la URL del backend sea correcta

## 📝 Notas

- El frontend necesita que el backend esté corriendo
- Los usuarios se crean en Firebase Authentication
- Los datos adicionales se guardan en Firestore
- Las imágenes se deben proporcionar como URLs (puedes usar servicios como Imgur, Cloudinary, etc.)

## 🔐 Seguridad

- Nunca subas el archivo `.env` a GitHub
- En producción, usa variables de entorno seguras
- Las reglas de Firestore deben ser más restrictivas en producción
