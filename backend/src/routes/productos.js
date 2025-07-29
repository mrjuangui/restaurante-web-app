import express from 'express';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { soloAdmin } from '../middlewares/soloAdmin.js';
import db from '../db.js';

const router = express.Router();

// Ruta para actualizar productos recomendados
router.put('/recomendados', verificarToken, soloAdmin, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length > 4) {
    return res.status(400).json({ mensaje: 'Debes enviar un array de máximo 4 IDs de productos.' });
  }

  try {
    await db.query('UPDATE productos SET recomendado = false');
    for (const id of ids) {
      await db.query('UPDATE productos SET recomendado = true WHERE id = $1', [id]);
    }

    res.json({ mensaje: 'Recomendados actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar recomendados:', error);
    res.status(500).json({ mensaje: 'Error al actualizar recomendados' });
  }
});

// Rutas estándar
router.get('/', obtenerProductos); // público
router.post('/', verificarToken, soloAdmin, crearProducto);
router.put('/:id', verificarToken, soloAdmin, actualizarProducto);
router.delete('/:id', verificarToken, soloAdmin, eliminarProducto);

export default router;
