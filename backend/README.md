# Backend - API Tienda Online

Backend API para la tienda online con Express.js y Firebase.

## 🚀 Características

- Autenticación con Firebase Authentication
- API RESTful para artículos y pedidos
- Control de roles (vendedor/cliente)
- Base de datos en Firestore

## 📋 Requisitos previos

- Node.js (v16 o superior)
- Cuenta de Firebase
- npm o yarn

## 🔧 Configuración de Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** con el proveedor de Email/Password
4. Habilita **Firestore Database** en modo producción

### 2. Obtener credenciales

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. Ve a la pestaña **Service Accounts**
3. Haz clic en **Generate new private key**
4. Descarga el archivo JSON

### 3. Configurar reglas de Firestore

En Firestore Database > Rules, pega estas reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Nota:** Para producción, deberías usar reglas más restrictivas.

## ⚙️ Instalación

1. Instala las dependencias:

```bash
cd backend
npm install
```

2. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

3. Edita `.env` con tus credenciales de Firebase:

```env
PORT=3000
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
```

**Obtener los valores:**
- `FIREBASE_PROJECT_ID`: Está en el JSON descargado como `project_id`
- `FIREBASE_CLIENT_EMAIL`: Está en el JSON como `client_email`
- `FIREBASE_PRIVATE_KEY`: Está en el JSON como `private_key` (incluye todo con los saltos de línea `\n`)

## 🏃‍♂️ Ejecutar el servidor

### Modo desarrollo:

```bash
npm run dev
```

### Modo producción:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener información del usuario autenticado

### Artículos

- `GET /api/articulos` - Obtener todos los artículos disponibles
- `GET /api/articulos/mis-articulos` - Obtener artículos del vendedor (requiere auth)
- `POST /api/articulos` - Crear artículo (solo vendedores)
- `PUT /api/articulos/:id` - Actualizar artículo (solo vendedores)
- `DELETE /api/articulos/:id` - Eliminar artículo (solo vendedores)

### Pedidos

- `POST /api/pedidos` - Crear pedido (solo clientes)
- `GET /api/pedidos/vendedor` - Obtener pedidos del vendedor
- `GET /api/pedidos/cliente` - Obtener pedidos del cliente
- `PATCH /api/pedidos/:id/estado` - Actualizar estado del pedido

## 🔐 Autenticación

Los endpoints protegidos requieren un token de Firebase en el header:

```
Authorization: Bearer <token>
```

## 🐛 Solución de problemas

### Error: "Error initializing Firebase"

- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la clave privada incluya los `\n` correctamente

### Error: "Permission denied"

- Verifica las reglas de Firestore
- Asegúrate de que Authentication esté habilitado

## 📝 Notas

- El backend debe estar corriendo para que el frontend funcione
- Por defecto corre en el puerto 3000
- Usa CORS para permitir peticiones del frontend
