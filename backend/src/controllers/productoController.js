import db from '../db.js';

// Obtener todos los productos (público)
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await db.query('SELECT * FROM productos');
    res.json({ productos: productos.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// Crear producto (solo admin)
export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, url_imagen, categoria } = req.body;
  try {
    const nuevoProducto = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, url_imagen, categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio, url_imagen, categoria]
    );
    res.status(201).json({ producto: nuevoProducto.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// Actualizar producto (solo admin)
export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, url_imagen, categoria } = req.body;
  try {
    const productoActualizado = await db.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, url_imagen = $4, categoria = $5 WHERE id = $6 RETURNING *',
      [nombre, descripcion, precio, url_imagen, categoria, id]
    );
    if (productoActualizado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ producto: productoActualizado.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// Eliminar producto (solo admin)
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await db.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    if (eliminado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado', producto: eliminado.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};
