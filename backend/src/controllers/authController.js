import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const registrar = async (req, res) => {
  const { nombre, correo, clave } = req.body;

  try {
    // Verificar si el correo ya existe
    const usuarioExistente = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Hashear la clave
    const claveHash = await bcrypt.hash(clave, 10);

    // Insertar nuevo usuario
    const nuevoUsuario = await db.query(
      'INSERT INTO usuarios (nombre, correo, clave) VALUES ($1, $2, $3) RETURNING id, nombre, correo, rol',
      [nombre, correo, claveHash]
    );

    const usuario = nuevoUsuario.rows[0];

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver token y nombre del usuario
    res.status(201).json({
      token,
      id: usuario.id,
      nombre: usuario.nombre,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};


export const iniciarSesion = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    // Buscar usuario
    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = resultado.rows[0];
    console.log('Usuario:', usuario);

    // Verificar clave
    const claveValida = await bcrypt.compare(clave, usuario.clave);

    if (!claveValida) {
      return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver token y datos del usuario
    res.json({
      token,
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};
