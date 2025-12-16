import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Crear artículo (solo vendedores)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen } = req.body;
    const userId = req.user.uid;

    // Verificar que el usuario es vendedor
    const userDoc = await db.collection('usuarios').doc(userId).get();
    if (!userDoc.exists || userDoc.data().rol !== 'vendedor') {
      return res.status(403).json({ error: 'No tienes permisos para crear artículos' });
    }

    const articulo = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen: imagen || '',
      vendedorId: userId,
      vendedorNombre: userDoc.data().nombre,
      fechaCreacion: new Date().toISOString()
    };

    const docRef = await db.collection('articulos').add(articulo);
    res.status(201).json({ id: docRef.id, ...articulo });
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({ error: 'Error al crear artículo' });
  }
});

// Obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('articulos').where('stock', '>', 0).get();
    const articulos = [];
    
    snapshot.forEach(doc => {
      articulos.push({ id: doc.id, ...doc.data() });
    });

    res.json(articulos);
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

// Obtener artículos de un vendedor
router.get('/mis-articulos', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('articulos').where('vendedorId', '==', userId).get();
    const articulos = [];
    
    snapshot.forEach(doc => {
      articulos.push({ id: doc.id, ...doc.data() });
    });

    res.json(articulos);
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

// Actualizar artículo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen } = req.body;
    const userId = req.user.uid;

    const docRef = db.collection('articulos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    if (doc.data().vendedorId !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para editar este artículo' });
    }

    const updates = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen: imagen || ''
    };

    await docRef.update(updates);
    res.json({ id, ...doc.data(), ...updates });
  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({ error: 'Error al actualizar artículo' });
  }
});

// Eliminar artículo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection('articulos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    if (doc.data().vendedorId !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este artículo' });
    }

    await docRef.delete();
    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando artículo:', error);
    res.status(500).json({ error: 'Error al eliminar artículo' });
  }
});

export default router;
