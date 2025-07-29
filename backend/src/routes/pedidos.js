import express from 'express';
import db from '../db.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = express.Router();



// Crear un nuevo pedido
router.post('/', verificarToken, async (req, res) => {
  const { productos } = req.body;
  const usuarioId = req.usuario.id;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Debes incluir productos en el pedido.' });
  }

  try {
    const nuevoPedido = await db.query(
      'INSERT INTO pedidos (id_usuario) VALUES ($1) RETURNING *',
      [usuarioId]
    );

    const pedidoId = nuevoPedido.rows[0].id;

    for (const prod of productos) {
      await db.query(
        'INSERT INTO productos_pedidos (id_pedido, producto_id, cantidad) VALUES ($1, $2, $3)',
        [pedidoId, prod.producto_id, prod.cantidad]
      );
    }

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: {
        id: pedidoId,
        usuario_id: usuarioId,
        productos
      }
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear pedido' });
  }
});



// Obtener todos los pedidos (solo admin)
router.get('/admin', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const pedidos = await db.query(`
      SELECT p.id AS pedido_id, p.estado, p.creado_en, u.nombre AS nombre_cliente, u.correo,
        json_agg(json_build_object(
          'producto_id', pr.id,
          'nombre', pr.nombre,
          'cantidad', pp.cantidad
        )) AS productos
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN productos_pedidos pp ON p.id = pp.id_pedido
      JOIN productos pr ON pp.producto_id = pr.id
      GROUP BY p.id, u.nombre, u.correo
      ORDER BY p.id DESC
    `);

    res.json({ pedidos: pedidos.rows });
  } catch (error) {
    console.error('Error al obtener pedidos del admin:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos del admin' });
  }
});





// Obtener pedidos (admin ve todos, cliente solo los suyos)
router.get('/', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol === 'admin') {
      // Admin ve todos los pedidos con detalle de productos
      const pedidos = await db.query(`
        SELECT p.id AS pedido_id, p.estado, p.creado_en,
          u.nombre AS nombre_cliente, u.correo,
          json_agg(json_build_object(
            'producto_id', pr.id,
            'nombre', pr.nombre,
            'precio', pr.precio,
            'url_imagen', pr.url_imagen,
            'cantidad', pp.cantidad
          )) AS productos
        FROM pedidos p
        JOIN usuarios u ON p.id_usuario = u.id
        JOIN productos_pedidos pp ON p.id = pp.id_pedido
        JOIN productos pr ON pr.id = pp.producto_id
        GROUP BY p.id, u.nombre, u.correo
        ORDER BY p.id DESC
      `);

      res.json({ pedidos: pedidos.rows });
    } else {
      // Cliente ve solo sus pedidos
      const pedidos = await db.query(`
        SELECT p.id AS pedido_id, p.estado, p.creado_en,
          json_agg(json_build_object(
            'producto_id', pr.id,
            'nombre', pr.nombre,
            'precio', pr.precio,
            'url_imagen', pr.url_imagen,
            'cantidad', pp.cantidad
          )) AS productos
        FROM pedidos p
        JOIN productos_pedidos pp ON p.id = pp.id_pedido
        JOIN productos pr ON pp.producto_id = pr.id
        WHERE p.id_usuario = $1
        GROUP BY p.id
        ORDER BY p.id DESC
      `, [req.usuario.id]);

      res.json({ pedidos: pedidos.rows });
    }
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
});





// Cambiar estado (solo admin)
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Solo el administrador puede cambiar el estado de los pedidos.' });
  }

  try {
    await db.query('UPDATE pedidos SET estado = $1 WHERE id = $2', [estado, id]);
    res.json({ mensaje: `Estado del pedido ${id} actualizado a '${estado}'.` });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado del pedido.' });
  }
});



// Eliminar pedido (solo admin)
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Solo el administrador puede eliminar pedidos.' });
  }

  try {
    await db.query('DELETE FROM productos_pedidos WHERE id_pedido = $1', [id]);
    await db.query('DELETE FROM pedidos WHERE id = $1', [id]);
    res.json({ mensaje: `Pedido ${id} eliminado correctamente.` });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ mensaje: 'Error al eliminar pedido.' });
  }
});




export default router;
