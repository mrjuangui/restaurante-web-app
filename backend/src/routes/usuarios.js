// routes/usuarios.js
import express from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';
import db from '../db.js';

const router = express.Router();

// Ruta para obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const userId = req.usuario.id;

    const result = await db.query(
      'SELECT id, nombre, correo, rol, creado_en FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
});

export default router;
