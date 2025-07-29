import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Verificamos si el token está presente
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Si viene con Bearer lo quitamos
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verificamos el token con el secreto
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

    // Guardamos los datos del token en req para usarlos después si queremos
    req.usuario = verificado;

    next(); // continuar con la ruta
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};
