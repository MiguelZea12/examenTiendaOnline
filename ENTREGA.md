# 📋 CHECKLIST DE ENTREGA - EXAMEN

Lista de verificación para asegurarte de que entregas todo correctamente.

---

## ✅ Requisitos del examen cumplidos

- [x] **Aplicación web en Svelte** ✓
- [x] **Usuario vendedor puede:**
  - [x] Publicar artículos con stock
  - [x] Ver artículos pedidos
  - [x] Ver datos de clientes que hicieron pedidos
- [x] **Usuario cliente puede:**
  - [x] Ver artículos disponibles
  - [x] Hacer pedidos
  - [x] Registrar nombre, dirección y teléfono
- [x] **Frontend y backend en proyectos separados** ✓
- [x] **Autenticación (Login/Register)** ✓
- [x] **Firebase integrado** ✓

---

## 📦 Archivos a entregar

### Código fuente

- [ ] Carpeta `backend/` completa (sin node_modules)
- [ ] Carpeta `frontend/` completa (sin node_modules, dist)
- [ ] Archivo `.gitignore` en raíz
- [ ] README.md principal con toda la documentación

### Documentación

- [ ] `README.md` - Documentación principal
- [ ] `backend/README.md` - Instrucciones del backend
- [ ] `frontend/README.md` - Instrucciones del frontend
- [ ] `FIREBASE_SETUP.md` - Configuración de Firebase paso a paso
- [ ] `DEPLOY.md` - Instrucciones de despliegue
- [ ] `QUICKSTART.md` - Inicio rápido
- [ ] Este archivo: `ENTREGA.md`

### Archivos de configuración (sin datos sensibles)

- [ ] `backend/.env.example` - Plantilla de variables de entorno
- [ ] `frontend/.env.example` - Plantilla de variables de entorno
- [ ] `backend/package.json`
- [ ] `frontend/package.json`

---

## 🌐 Enlaces requeridos

Actualiza el README.md principal con estos enlaces:

### Obligatorio

- [ ] **Frontend desplegado**: `https://tu-app.vercel.app` o similar
  - Debe estar funcionando y accesible públicamente
  - Login/Register debe funcionar

### Opcional

- [ ] **Repositorio GitHub**: `https://github.com/tu-usuario/tienda-online`
- [ ] **Backend desplegado**: Si lo desplegaste (Railway, Render, etc.)

---

## 🧪 Funcionalidades a verificar

### Como Vendedor

- [ ] Puedo registrarme como vendedor
- [ ] Puedo iniciar sesión
- [ ] Puedo crear artículos con:
  - [ ] Nombre
  - [ ] Descripción
  - [ ] Precio
  - [ ] Stock
  - [ ] Imagen (URL)
- [ ] Puedo ver mis artículos
- [ ] Puedo editar mis artículos
- [ ] Puedo eliminar mis artículos
- [ ] Puedo ver pedidos recibidos con:
  - [ ] Datos del artículo
  - [ ] Nombre del cliente
  - [ ] Dirección del cliente
  - [ ] Teléfono del cliente
  - [ ] Cantidad pedida
  - [ ] Total
- [ ] Puedo cambiar estado de pedidos
- [ ] Puedo cerrar sesión

### Como Cliente

- [ ] Puedo registrarme como cliente
- [ ] Puedo iniciar sesión
- [ ] Puedo ver todos los artículos disponibles
- [ ] Puedo ver detalles de cada artículo
- [ ] Puedo hacer un pedido con:
  - [ ] Seleccionar cantidad
  - [ ] Ingresar mi nombre
  - [ ] Ingresar mi dirección
  - [ ] Ingresar mi teléfono
- [ ] El stock se actualiza después de un pedido
- [ ] Puedo ver mis pedidos realizados
- [ ] Puedo ver el estado de mis pedidos
- [ ] Puedo cerrar sesión

### Validaciones

- [ ] No puedo comprar más que el stock disponible
- [ ] Los campos requeridos están validados
- [ ] Los vendedores no pueden hacer pedidos
- [ ] Los clientes no pueden crear artículos
- [ ] Los usuarios solo ven sus propios datos

---

## 📝 Documentación a incluir

### En README.md principal

- [ ] Descripción del proyecto
- [ ] Tecnologías utilizadas
- [ ] Arquitectura (frontend/backend separados)
- [ ] Instrucciones de instalación
- [ ] Instrucciones de configuración Firebase
- [ ] Instrucciones para ejecutar localmente
- [ ] Instrucciones de despliegue
- [ ] **Enlace público del frontend**
- [ ] Estructura de datos (Firestore)
- [ ] Endpoints de la API
- [ ] Cuentas de prueba sugeridas
- [ ] Solución de problemas comunes
- [ ] Capturas de pantalla (opcional pero recomendado)

### En cada README específico

- [ ] Backend: API, endpoints, configuración Firebase Admin
- [ ] Frontend: Componentes, rutas, configuración Firebase Web

---

## 🔐 Seguridad - IMPORTANTE

### NO INCLUIR EN LA ENTREGA

- [ ] ❌ Archivos `.env` con credenciales reales
- [ ] ❌ Archivos JSON de Firebase Service Account
- [ ] ❌ Carpetas `node_modules/`
- [ ] ❌ Carpetas `dist/` o `build/`
- [ ] ❌ Tokens o API keys en el código

### SÍ INCLUIR

- [ ] ✅ Archivos `.env.example` como plantilla
- [ ] ✅ Instrucciones de dónde obtener credenciales
- [ ] ✅ `.gitignore` configurado correctamente

---

## 📸 Capturas recomendadas (Opcional)

Incluye en el README o en una carpeta `screenshots/`:

- [ ] Pantalla de Login/Register
- [ ] Panel de vendedor con artículos
- [ ] Panel de vendedor con pedidos
- [ ] Panel de cliente viendo tienda
- [ ] Panel de cliente haciendo pedido
- [ ] Panel de cliente viendo sus pedidos
- [ ] Firebase Console mostrando datos

---

## 🧪 Tests antes de entregar

### Test local

1. [ ] Backend inicia sin errores
2. [ ] Frontend inicia sin errores
3. [ ] Puedo registrar vendedor
4. [ ] Puedo registrar cliente
5. [ ] Puedo crear artículos (vendedor)
6. [ ] Puedo ver artículos (cliente)
7. [ ] Puedo hacer pedido (cliente)
8. [ ] Veo el pedido (vendedor)
9. [ ] Datos se guardan en Firebase
10. [ ] Consola del navegador sin errores críticos

### Test en producción

1. [ ] Frontend desplegado abre correctamente
2. [ ] Puedo registrar usuarios
3. [ ] Puedo iniciar sesión
4. [ ] No hay errores en la consola del navegador
5. [ ] Firebase Authentication funciona
6. [ ] Si backend está desplegado, todo funciona

---

## 📦 Formato de entrega

### Opción 1: Repositorio GitHub (Recomendado)

```
📁 Repositorio: tienda-online
├── 📁 backend/
├── 📁 frontend/
├── 📄 README.md (con enlace público)
├── 📄 FIREBASE_SETUP.md
├── 📄 DEPLOY.md
├── 📄 QUICKSTART.md
└── 📄 .gitignore
```

**Entrega el enlace**: `https://github.com/tu-usuario/tienda-online`

### Opción 2: Archivo comprimido

```
📦 tienda-online.zip
├── 📁 backend/ (sin node_modules)
├── 📁 frontend/ (sin node_modules, dist)
├── 📄 README.md (con enlace público)
├── 📄 FIREBASE_SETUP.md
├── 📄 DEPLOY.md
├── 📄 QUICKSTART.md
└── 📄 ENTREGA.txt (con enlaces y notas)
```

---

## 📋 Información para ENTREGA.txt

Si entregas en ZIP, incluye un archivo `ENTREGA.txt` con:

```txt
PROYECTO: TIENDA ONLINE - EXAMEN
ESTUDIANTE: [Tu nombre]
FECHA: [Fecha de entrega]

═══════════════════════════════════════════

ENLACES:

Frontend desplegado: https://tu-app.vercel.app
Repositorio GitHub: https://github.com/tu-usuario/tienda-online
(Si backend desplegado): https://tu-backend.com

═══════════════════════════════════════════

CUENTAS DE PRUEBA:

Vendedor:
  Email: vendedor@test.com
  Password: 123456

Cliente:
  Email: cliente@test.com
  Password: 123456

═══════════════════════════════════════════

TECNOLOGÍAS UTILIZADAS:

Frontend: Svelte, Vite, Firebase Authentication
Backend: Node.js, Express, Firebase Admin SDK
Base de datos: Firestore
Despliegue: Vercel (frontend)

═══════════════════════════════════════════

NOTAS:

- Backend corre en localhost:3000
- Frontend desplegado en Vercel
- Todos los requisitos del examen cumplidos
- Documentación completa en README.md

═══════════════════════════════════════════

INSTRUCCIONES DE EJECUCIÓN:

Ver QUICKSTART.md para inicio rápido (5 min)
Ver README.md para documentación completa
Ver FIREBASE_SETUP.md para configurar Firebase
Ver DEPLOY.md para instrucciones de despliegue

═══════════════════════════════════════════
```

---

## ✅ Checklist final antes de enviar

1. [ ] Todo el código funciona localmente
2. [ ] Frontend está desplegado y accesible
3. [ ] README.md actualizado con enlace público
4. [ ] No hay credenciales sensibles en el código
5. [ ] `.gitignore` configurado correctamente
6. [ ] Documentación completa y clara
7. [ ] Archivos `.env.example` incluidos
8. [ ] He probado que otro compañero pueda ejecutarlo siguiendo el README
9. [ ] Todas las funcionalidades requeridas funcionan
10. [ ] Entrega lista para enviar ✅

---

## 🎯 Criterios de evaluación esperados

Probablemente evalúen:

- **Funcionalidad (40%)**
  - Todo funciona como se pidió
  - Sin errores críticos
  - Roles funcionan correctamente

- **Código (30%)**
  - Código limpio y organizado
  - Proyectos separados (frontend/backend)
  - Buena estructura de archivos

- **Documentación (20%)**
  - README claro y completo
  - Instrucciones funcionales
  - Fácil de ejecutar

- **Despliegue (10%)**
  - Frontend accesible públicamente
  - Enlace funcionando

---

## 🎉 ¡Listo para entregar!

Si has completado todo este checklist, tu proyecto está listo.

**Última verificación:**
1. Abre el frontend desplegado en modo incógnito
2. Regístrate y prueba las funcionalidades
3. Si funciona → ¡Envía!

¡Mucha suerte en tu examen! 🎓🚀
