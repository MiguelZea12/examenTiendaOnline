# 🚀 Guía de Deploy - Vercel

## Problema Resuelto

### ✅ Error 500 - Pedidos
- **Causa**: Firestore necesita índices compuestos para queries con `where + orderBy`
- **Solución**: Se eliminó `orderBy` del backend y se ordenan los pedidos en el frontend
- **Archivos modificados**: 
  - `backend/routes/pedidos.js` 
  - `frontend/src/components/Cliente.svelte`
  - `frontend/src/components/Vendedor.svelte`

### ✅ Error 404 - Vercel
- **Causa**: Vercel no maneja correctamente el enrutamiento SPA por defecto
- **Solución**: Agregado `vercel.json` con rewrites para redireccionar todas las rutas a `index.html`
- **Archivos creados**: `frontend/vercel.json`

## 📦 Redeploy en Vercel

### Opción 1: Desde Git (Recomendado)

```bash
# 1. Commitea los cambios
cd /home/miguelzea/Universidad/examen
git add .
git commit -m "Fix: Resuelve error 500 en pedidos y 404 en routing SPA"
git push origin main

# 2. Vercel detectará automáticamente el push y hará redeploy
```

### Opción 2: Desde CLI de Vercel

```bash
# 1. Instalar Vercel CLI si no lo tienes
npm install -g vercel

# 2. Desde el directorio frontend
cd frontend

# 3. Deploy
vercel --prod
```

### Opción 3: Desde Dashboard de Vercel

1. Ve a https://vercel.com/dashboard
2. Encuentra tu proyecto "examen-tienda-online"
3. Click en "Deployments"
4. Click en "Redeploy" en el último deployment
5. O haz un nuevo deployment desde "Settings → Git → Redeploy"

## 🔍 Verificación

Después del deploy, verifica:

1. **Ruta raíz funciona**: `https://tu-app.vercel.app/`
2. **Login funciona**: `https://tu-app.vercel.app/` (debe mostrar Auth)
3. **Rutas SPA funcionan**: Recarga en `/vendedor` o `/cliente` → No debe dar 404

## ⚠️ Importante

**El backend sigue en localhost**, necesitas:

### Para producción completa:

1. **Opción A - Backend en Vercel Serverless**:
   - Convertir backend a funciones serverless
   - Usar `vercel.json` en backend también

2. **Opción B - Backend en Railway/Render** (más fácil):
   ```bash
   # Sube tu backend a Railway o Render
   # Luego actualiza frontend/.env:
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

3. **Opción C - Solo demostración local**:
   - El frontend en Vercel funcionará solo para UI
   - Para probar con datos reales, usa `npm run dev` localmente

## 📝 Cambios Aplicados

```json
// frontend/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Este archivo le dice a Vercel que todas las rutas deben servir `index.html`, permitiendo que Svelte Router maneje el enrutamiento del lado del cliente.
