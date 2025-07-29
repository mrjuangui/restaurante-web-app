import express from 'express';
import db from '../db.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo el administrador puede ver el dashboard.' });
  }

  try {
    // Total de pedidos
    const totalPedidos = (await db.query('SELECT COUNT(*) FROM pedidos')).rows[0].count;

    // Pedidos por estado
    const pedidosPorEstado = (await db.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM pedidos
      GROUP BY estado
    `)).rows;

    // Total ventas
    const totalVentasQuery = await db.query(`
      SELECT COALESCE(SUM(pp.cantidad * p.precio), 0) AS total_ventas
      FROM productos_pedidos pp
      JOIN productos p ON pp.producto_id = p.id
    `);
    const totalVentas = parseFloat(totalVentasQuery.rows[0].total_ventas);

    // Top productos vendidos
    const topProductos = (await db.query(`
      SELECT pr.nombre AS producto, SUM(pp.cantidad) AS cantidadVendida
      FROM productos_pedidos pp
      JOIN productos pr ON pp.producto_id = pr.id
      GROUP BY pr.nombre
      ORDER BY cantidadVendida DESC
      LIMIT 5
    `)).rows;

    // Total de clientes
    const totalClientes = (await db.query(`
      SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente'
    `)).rows[0].count;

    res.json({
      totalPedidos: parseInt(totalPedidos),
      pedidosPorEstado,
      totalVentas,
      topProductos,
      totalClientes: parseInt(totalClientes)
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener métricas del dashboard.' });
  }
});

export default router;
