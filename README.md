# 🛍️ Tienda Online - Proyecto Completo

Sistema completo de tienda online con roles de vendedor y cliente, desarrollado con Svelte (Frontend) y Express + Firebase (Backend).

## 📋 Descripción

Aplicación web que permite:

- **Vendedores**: Crear y gestionar artículos, ver y gestionar pedidos de clientes
- **Clientes**: Ver artículos disponibles, realizar pedidos con datos de envío, seguir el estado de sus pedidos

## 🏗️ Arquitectura

```
├── backend/          # API REST con Express.js + Firebase Admin SDK
└── frontend/         # Aplicación Svelte con Firebase Authentication
```

## 🚀 Tecnologías utilizadas

### Backend
- Node.js + Express.js
- Firebase Admin SDK
- Firestore (Base de datos)
- CORS

### Frontend
- Svelte 4
- Vite
- Firebase Authentication
- Svelte Routing

## 📦 Instalación rápida

### 1. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** con Email/Password
3. Habilita **Firestore Database**
4. Genera credenciales de Service Account (para backend)
5. Copia la configuración web (para frontend)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales de Firebase
npm run dev
```

El servidor estará en `http://localhost:3000`

Ver [backend/README.md](backend/README.md) para instrucciones detalladas.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edita .env con tu configuración de Firebase
npm run dev
```

La aplicación estará en `http://localhost:5173`

Ver [frontend/README.md](frontend/README.md) para instrucciones detalladas.

## 📱 Guía de uso

### Primer uso

1. Abre `http://localhost:5173`
2. Regístrate como **vendedor** en una cuenta
3. Regístrate como **cliente** en otra cuenta (usa otro email)

### Como Vendedor

1. Inicia sesión con la cuenta de vendedor
2. Crea artículos:
   - Nombre del producto
   - Descripción
   - Precio
   - Stock inicial
   - URL de imagen (opcional)
3. Gestiona tus artículos (editar/eliminar)
4. Ve los pedidos recibidos de clientes
5. Actualiza el estado de los pedidos

### Como Cliente

1. Inicia sesión con la cuenta de cliente
2. Navega por los artículos disponibles
3. Haz clic en "Comprar" en un artículo
4. Completa el formulario:
   - Cantidad
   - Nombre completo
   - Dirección de envío
   - Teléfono
5. Confirma el pedido
6. Ve el estado de tus pedidos en "Mis Pedidos"

## 🌐 Despliegue

### Backend (Localhost)

El backend puede quedarse en localhost. Asegúrate de:
- Mantenerlo corriendo cuando uses la aplicación
- Usar `http://localhost:3000/api` en la variable `VITE_API_URL` del frontend

### Frontend (Vercel - Recomendado)

#### Opción 1: CLI

```bash
cd frontend
npm i -g vercel
npm run build
vercel --prod
```

#### Opción 2: GitHub + Vercel

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa el repositorio
4. Configura las variables de entorno (todas las `VITE_*`)
5. Despliega

#### Variables de entorno en Vercel

En el dashboard de Vercel, añade:

```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Frontend (Netlify - Alternativa)

```bash
cd frontend
npm run build
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Configura las mismas variables de entorno en Netlify Dashboard.

## 🔐 Seguridad

- **IMPORTANTE**: Nunca subas archivos `.env` a Git
- El `.gitignore` ya está configurado para ignorarlos
- En producción, usa variables de entorno seguras
- Actualiza las reglas de Firestore para producción

### Reglas de Firestore recomendadas para producción

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer su propia información
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Artículos
    match /articulos/{articuloId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'vendedor';
    }
    
    // Pedidos
    match /pedidos/{pedidoId} {
      allow read: if request.auth != null && (
        resource.data.clienteId == request.auth.uid ||
        resource.data.vendedorId == request.auth.uid
      );
      allow create: if request.auth != null 
        && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'cliente';
      allow update: if request.auth != null 
        && resource.data.vendedorId == request.auth.uid;
    }
  }
}
```

## 📊 Estructura de datos en Firestore

### Colección: usuarios

```javascript
{
  email: "usuario@example.com",
  nombre: "Juan Pérez",
  rol: "vendedor" | "cliente",
  fechaRegistro: "2024-01-15T10:30:00.000Z"
}
```

### Colección: articulos

```javascript
{
  nombre: "Laptop HP",
  descripcion: "Laptop de 15 pulgadas...",
  precio: 899.99,
  stock: 10,
  imagen: "https://...",
  vendedorId: "uid-del-vendedor",
  vendedorNombre: "Juan Pérez",
  fechaCreacion: "2024-01-15T10:30:00.000Z"
}
```

### Colección: pedidos

```javascript
{
  articuloId: "id-del-articulo",
  articuloNombre: "Laptop HP",
  articuloPrecio: 899.99,
  cantidad: 1,
  total: 899.99,
  clienteId: "uid-del-cliente",
  clienteNombre: "María García",
  clienteDireccion: "Calle Principal 123, Madrid",
  clienteTelefono: "+34 123 456 789",
  vendedorId: "uid-del-vendedor",
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado",
  fechaPedido: "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Info del usuario actual

### Artículos
- `GET /api/articulos` - Listar artículos disponibles
- `GET /api/articulos/mis-articulos` - Artículos del vendedor
- `POST /api/articulos` - Crear artículo
- `PUT /api/articulos/:id` - Actualizar artículo
- `DELETE /api/articulos/:id` - Eliminar artículo

### Pedidos
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/vendedor` - Pedidos del vendedor
- `GET /api/pedidos/cliente` - Pedidos del cliente
- `PATCH /api/pedidos/:id/estado` - Actualizar estado

## 🐛 Solución de problemas comunes

### Backend no inicia
- Verifica que Node.js esté instalado (`node --version`)
- Revisa que las credenciales de Firebase en `.env` sean correctas
- Asegúrate de que el puerto 3000 no esté en uso

### Frontend no conecta con backend
- Verifica que el backend esté corriendo
- Revisa la variable `VITE_API_URL` en `.env`
- Abre la consola del navegador para ver errores

### Error al registrar usuarios
- Verifica que Authentication esté habilitado en Firebase
- Revisa que el proveedor Email/Password esté activo
- La contraseña debe tener al menos 6 caracteres

### Errores CORS
- El backend ya tiene CORS configurado
- Si siguen los errores, verifica que la URL del frontend esté permitida

## 📝 Notas importantes

- **Backend en localhost**: El backend NO necesita ser desplegado, puede quedarse en localhost
- **Frontend público**: Solo el frontend debe ser publicado (Vercel/Netlify)
- **Imágenes**: Las URLs de imágenes deben ser públicas (puedes usar Imgur, Cloudinary, etc.)
- **Firebase gratis**: El plan gratuito de Firebase es suficiente para desarrollo

## 👥 Cuentas de prueba sugeridas

Crea estas cuentas para probar:

**Vendedor:**
- Email: vendedor@test.com
- Password: 123456
- Rol: Vendedor

**Cliente:**
- Email: cliente@test.com
- Password: 123456
- Rol: Cliente

## 📄 Licencia

Este proyecto fue creado con fines educativos.

## ✅ Checklist de entrega

- [x] Backend con Express + Firebase
- [x] Frontend con Svelte
- [x] Autenticación (Login/Register)
- [x] Panel de Vendedor (CRUD artículos, ver pedidos)
- [x] Panel de Cliente (ver artículos, hacer pedidos)
- [x] Proyectos separados (backend/frontend)
- [x] README con instrucciones
- [ ] Frontend desplegado (enlace público)
- [ ] Backend configurado (puede estar en localhost)

## 🔗 Enlaces

- **Frontend desplegado**: [Actualiza este enlace después de desplegar]
- **Backend**: http://localhost:3000 (localhost)
- **Repositorio**: [Tu repositorio de GitHub]

---

**Desarrollado para examen universitario** 🎓
