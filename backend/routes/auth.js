import express from 'express';
import { db, auth } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Registrar usuario con rol
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;

    // Validar rol
    if (!['vendedor', 'cliente'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: nombre
    });

    // Guardar información adicional en Firestore
    await db.collection('usuarios').doc(userRecord.uid).set({
      email,
      nombre,
      rol,
      fechaRegistro: new Date().toISOString()
    });

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      nombre,
      rol
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener información del usuario
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('usuarios').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ uid: userId, ...userDoc.data() });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

export default router;
