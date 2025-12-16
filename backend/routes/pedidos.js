import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Crear pedido (clientes)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { articuloId, cantidad, nombre, direccion, telefono } = req.body;
    const userId = req.user.uid;

    // Verificar que el usuario es cliente
    const userDoc = await db.collection('usuarios').doc(userId).get();
    if (!userDoc.exists || userDoc.data().rol !== 'cliente') {
      return res.status(403).json({ error: 'Solo los clientes pueden hacer pedidos' });
    }

    // Verificar stock
    const articuloRef = db.collection('articulos').doc(articuloId);
    const articuloDoc = await articuloRef.get();

    if (!articuloDoc.exists) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    const articulo = articuloDoc.data();
    if (articulo.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Crear pedido
    const pedido = {
      articuloId,
      articuloNombre: articulo.nombre,
      articuloPrecio: articulo.precio,
      cantidad: parseInt(cantidad),
      total: articulo.precio * cantidad,
      clienteId: userId,
      clienteNombre: nombre,
      clienteDireccion: direccion,
      clienteTelefono: telefono,
      vendedorId: articulo.vendedorId,
      estado: 'pendiente',
      fechaPedido: new Date().toISOString()
    };

    const docRef = await db.collection('pedidos').add(pedido);

    // Actualizar stock
    await articuloRef.update({
      stock: articulo.stock - cantidad
    });

    res.status(201).json({ id: docRef.id, ...pedido });
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// Obtener pedidos del vendedor
router.get('/vendedor', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('pedidos')
      .where('vendedorId', '==', userId)
      .get();
    
    const pedidos = [];
    snapshot.forEach(doc => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Obtener pedidos del cliente
router.get('/cliente', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('pedidos')
      .where('clienteId', '==', userId)
      .get();
    
    const pedidos = [];
    snapshot.forEach(doc => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Actualizar estado del pedido (vendedor)
router.patch('/:id/estado', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const userId = req.user.uid;

    const docRef = db.collection('pedidos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (doc.data().vendedorId !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para modificar este pedido' });
    }

    await docRef.update({ estado });
    res.json({ id, ...doc.data(), estado });
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

export default router;
