import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js'; // Importar las rutas
import authRoutes from './routes/auth.js'; // Importar las rutas de autenticación
import { verificarToken } from './middlewares/verificarToken.js'; // Importar las rutas de verificación
import productoRoutes from './routes/productos.js'; // Importar las rutas de productos
import pedidosRoutes from './routes/pedidos.js'; // Importar las rutas de pedidos
import dashboardRoutes from './routes/dashboard.js'; // Importar las rutas de dashboard
import usuariosRoutes from './routes/usuarios.js'; // Importar las rutas de usuarios

dotenv.config();

// Configuración de la base de datos
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/productos', productoRoutes); // Rutas de productos
app.use('/api/pedidos', pedidosRoutes); // Rutas de pedidos
app.use('/api/admin/dashboard', dashboardRoutes); // Rutas de dashboard
app.use('/api/usuarios', usuariosRoutes); // Rutas de usuarios

// Endpoint para obtener el perfil del usuario autenticado
app.get('/api/usuarios/perfil', verificarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const resultado = await db.query(
      'SELECT id, nombre, correo, rol, creado_en FROM usuarios WHERE id = $1',
      [idUsuario]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ usuario: resultado.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
  }
});



// Endpoint simple para probar si el server corre
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Perfecto!' });
});

// Endpoint para probar la conexión a PostgreSQL
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error('Error en DB:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Endpoint protegido que requiere token
app.get('/api/usuarios', verificarToken, async (req, res) => {
  try {
    const usuarios = await db.query('SELECT id, nombre, correo, rol, creado_en FROM usuarios');
    res.json({ usuarios: usuarios.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});


// Rutas de la API
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
