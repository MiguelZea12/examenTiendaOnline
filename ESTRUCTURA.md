# 📁 Estructura del Proyecto

Visualización completa de todos los archivos y carpetas del proyecto.

```
examen/
│
├── 📄 README.md                    # Documentación principal del proyecto
├── 📄 QUICKSTART.md                # Guía de inicio rápido (5 minutos)
├── 📄 FIREBASE_SETUP.md            # Configuración detallada de Firebase
├── 📄 DEPLOY.md                    # Guía de despliegue en Vercel/Netlify
├── 📄 ENTREGA.md                   # Checklist de entrega para el examen
├── 📄 .gitignore                   # Archivos a ignorar en Git
│
├── 📁 backend/                     # BACKEND - API REST
│   ├── 📄 package.json             # Dependencias del backend
│   ├── 📄 server.js                # Servidor Express principal
│   ├── 📄 .env.example             # Plantilla de variables de entorno
│   ├── 📄 .gitignore               # Archivos a ignorar
│   ├── 📄 README.md                # Documentación del backend
│   │
│   ├── 📁 config/
│   │   └── 📄 firebase.js          # Configuración Firebase Admin SDK
│   │
│   ├── 📁 middleware/
│   │   └── 📄 auth.js              # Middleware de autenticación
│   │
│   └── 📁 routes/
│       ├── 📄 auth.js              # Rutas de autenticación (register, login)
│       ├── 📄 articulos.js         # Rutas de artículos (CRUD)
│       └── 📄 pedidos.js           # Rutas de pedidos
│
└── 📁 frontend/                    # FRONTEND - Aplicación Svelte
    ├── 📄 package.json             # Dependencias del frontend
    ├── 📄 vite.config.js           # Configuración de Vite
    ├── 📄 index.html               # HTML principal
    ├── 📄 .env.example             # Plantilla de variables de entorno
    ├── 📄 .gitignore               # Archivos a ignorar
    ├── 📄 README.md                # Documentación del frontend
    │
    └── 📁 src/
        ├── 📄 main.js              # Punto de entrada de la app
        ├── 📄 App.svelte           # Componente raíz con rutas
        ├── 📄 app.css              # Estilos globales
        ├── 📄 firebase.js          # Configuración Firebase Web SDK
        │
        ├── 📁 components/
        │   ├── 📄 Auth.svelte      # Componente Login/Register
        │   ├── 📄 Vendedor.svelte  # Panel del vendedor
        │   └── 📄 Cliente.svelte   # Panel del cliente
        │
        ├── 📁 lib/
        │   └── 📄 api.js           # Funciones para llamar a la API
        │
        └── 📁 stores/
            └── 📄 auth.js          # Store de estado de autenticación
```

---

## 📊 Desglose por tipo de archivo

### Backend (Express.js + Firebase Admin)

**Configuración:**
- `package.json` - Dependencias (express, firebase-admin, cors, dotenv)
- `server.js` - Servidor Express con rutas y middleware
- `.env.example` - Plantilla de variables de entorno
- `config/firebase.js` - Inicialización de Firebase Admin SDK

**Autenticación y seguridad:**
- `middleware/auth.js` - Verificación de tokens JWT
- `routes/auth.js` - Registro de usuarios, obtener perfil

**Lógica de negocio:**
- `routes/articulos.js` - CRUD completo de artículos
- `routes/pedidos.js` - Crear y gestionar pedidos

### Frontend (Svelte + Firebase)

**Configuración:**
- `package.json` - Dependencias (svelte, firebase, svelte-routing)
- `vite.config.js` - Build tool
- `index.html` - Punto de entrada HTML
- `.env.example` - Plantilla de variables de entorno
- `firebase.js` - Inicialización de Firebase Web SDK

**Componentes principales:**
- `App.svelte` - Router y estructura principal
- `Auth.svelte` - Login y registro con validación
- `Vendedor.svelte` - Panel completo del vendedor
- `Cliente.svelte` - Panel completo del cliente

**Utilidades:**
- `lib/api.js` - Funciones para comunicarse con el backend
- `stores/auth.js` - Estado global de autenticación

---

## 🔄 Flujo de datos

```
Usuario
  ↓
Frontend (Svelte)
  ↓
Firebase Auth (Login/Register)
  ↓
API REST (Backend Express)
  ↓
Firebase Admin SDK
  ↓
Firestore Database
```

---

## 📦 Dependencias principales

### Backend

```json
{
  "express": "^4.18.2",           // Framework web
  "cors": "^2.8.5",               // Permitir peticiones del frontend
  "firebase-admin": "^12.0.0",    // SDK de Firebase para backend
  "dotenv": "^16.3.1"             // Variables de entorno
}
```

### Frontend

```json
{
  "svelte": "^4.2.7",             // Framework UI
  "firebase": "^10.7.1",          // SDK de Firebase para web
  "svelte-routing": "^2.12.0",    // Routing
  "vite": "^5.0.8"                // Build tool
}
```

---

## 🗄️ Estructura de Firestore

### Colecciones:

1. **usuarios**
   - Documento por usuario (uid)
   - Campos: email, nombre, rol, fechaRegistro

2. **articulos**
   - Documento por artículo
   - Campos: nombre, descripcion, precio, stock, imagen, vendedorId, vendedorNombre, fechaCreacion

3. **pedidos**
   - Documento por pedido
   - Campos: articuloId, articuloNombre, articuloPrecio, cantidad, total, clienteId, clienteNombre, clienteDireccion, clienteTelefono, vendedorId, estado, fechaPedido

---

## 🛣️ Rutas de la aplicación

### Frontend (Navegación)

- `/` - Página de login/register
- `/vendedor` - Panel de vendedor (protegida)
- `/cliente` - Panel de cliente (protegida)

### Backend (API Endpoints)

**Autenticación:**
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener perfil

**Artículos:**
- `GET /api/articulos` - Listar artículos disponibles
- `GET /api/articulos/mis-articulos` - Artículos del vendedor (auth)
- `POST /api/articulos` - Crear artículo (auth, vendedor)
- `PUT /api/articulos/:id` - Actualizar artículo (auth, vendedor)
- `DELETE /api/articulos/:id` - Eliminar artículo (auth, vendedor)

**Pedidos:**
- `POST /api/pedidos` - Crear pedido (auth, cliente)
- `GET /api/pedidos/vendedor` - Pedidos del vendedor (auth)
- `GET /api/pedidos/cliente` - Pedidos del cliente (auth)
- `PATCH /api/pedidos/:id/estado` - Actualizar estado (auth, vendedor)

---

## 🎨 Componentes visuales

### Auth.svelte
- Formulario de login
- Formulario de registro
- Selector de rol (vendedor/cliente)
- Validación de formularios
- Manejo de errores

### Vendedor.svelte
- Pestañas: Mis Artículos / Pedidos Recibidos
- CRUD de artículos con modal
- Lista de pedidos con datos de cliente
- Selector de estado de pedidos
- Header con logout

### Cliente.svelte
- Pestañas: Tienda / Mis Pedidos
- Grid de artículos disponibles
- Modal de pedido con formulario
- Lista de pedidos realizados
- Header con logout

---

## 🔐 Variables de entorno

### Backend (.env)

```
PORT=3000
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 📏 Tamaño estimado

```
backend/
├── Código fuente: ~15 KB
└── node_modules: ~50 MB (instalados)

frontend/
├── Código fuente: ~50 KB
├── node_modules: ~200 MB (instalados)
└── dist/ (compilado): ~200 KB

Total sin node_modules: ~65 KB
Total con node_modules: ~250 MB
```

---

## 🚀 Comandos disponibles

### Backend

```bash
npm install        # Instalar dependencias
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo (con nodemon)
```

### Frontend

```bash
npm install        # Instalar dependencias
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de la compilación
```

---

## 📈 Líneas de código aproximadas

- **Backend**: ~600 líneas
  - Routes: ~400 líneas
  - Config/Middleware: ~100 líneas
  - Server: ~40 líneas

- **Frontend**: ~1200 líneas
  - Componentes: ~1000 líneas
  - Utils/Config: ~200 líneas

**Total**: ~1800 líneas de código

---

Esta estructura está diseñada para ser:
- ✅ Fácil de entender
- ✅ Fácil de mantener
- ✅ Escalable
- ✅ Cumple todos los requisitos del examen
