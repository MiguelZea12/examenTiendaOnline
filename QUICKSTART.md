# ⚡ INICIO RÁPIDO - 5 Minutos

Guía express para ejecutar el proyecto lo más rápido posible.

## 🎯 Objetivo

Tener la aplicación corriendo en **localhost** en 5 minutos.

---

## 📋 Requisitos

- Node.js instalado
- Cuenta de Firebase (gratis)

---

## 🚀 Pasos rápidos

### 1. Configurar Firebase (2 min)

1. Ve a https://console.firebase.google.com/
2. Crea un proyecto nuevo
3. Habilita **Authentication** → Email/Password
4. Habilita **Firestore Database** en modo producción
5. En Firestore Rules, pega:

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

### 2. Backend (2 min)

```bash
cd backend
npm install

# Crear .env
cp .env.example .env
```

Edita `backend/.env` con tus credenciales:
- Ve a Firebase Console → ⚙️ → Service Accounts
- Generate new private key
- Copia `project_id`, `client_email` y `private_key` al `.env`

```bash
# Iniciar backend
npm run dev
```

Debe mostrar: `Servidor corriendo en http://localhost:3000`

### 3. Frontend (1 min)

```bash
cd frontend
npm install

# Crear .env
cp .env.example .env
```

Edita `frontend/.env` con tus credenciales:
- Ve a Firebase Console → ⚙️ → Your apps → Web app (</> icon)
- Copia los valores de `firebaseConfig` al `.env`

```bash
# Iniciar frontend
npm run dev
```

Debe mostrar: `Local: http://localhost:5173`

### 4. Probar (30 seg)

1. Abre http://localhost:5173
2. Regístrate como "vendedor"
3. Regístrate (con otro email) como "cliente"
4. ¡Funciona! ✅

---

## 🎯 Verificación rápida

✅ Backend muestra: `{"message":"API Tienda funcionando correctamente"}`
✅ Frontend muestra pantalla de login
✅ Puedes registrar usuarios
✅ Usuarios aparecen en Firebase Console → Authentication

---

## 🆘 Si algo falla

### Backend no inicia

```bash
# Verifica Node.js
node --version  # Debe ser v16+

# Verifica dependencias
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend no inicia

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error de Firebase

- Revisa que las credenciales en `.env` sean correctas
- Verifica que no haya espacios extra
- La `FIREBASE_PRIVATE_KEY` debe estar entre comillas

---

## 📚 ¿Necesitas más detalles?

- **Configuración completa**: Ver `FIREBASE_SETUP.md`
- **Despliegue**: Ver `DEPLOY.md`
- **Documentación completa**: Ver `README.md`

---

## 🎉 ¡Listo!

Tu aplicación está corriendo localmente. Ahora puedes:

1. **Crear artículos** como vendedor
2. **Hacer pedidos** como cliente
3. **Gestionar todo** desde los paneles

Cuando quieras desplegarla, sigue `DEPLOY.md`
