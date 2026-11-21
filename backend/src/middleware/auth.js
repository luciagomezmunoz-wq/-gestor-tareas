
 // Lucía Gómez Muñoz - 20/11/2026
const jwt = require('jsonwebtoken');
const config = require('../config/env');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token no proporcionado'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const usuario = jwt.verify(token, config.jwtSecret);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token no válido'
    });
  }
}

module.exports = autenticar;
