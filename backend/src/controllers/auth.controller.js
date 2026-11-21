
 // Lucía Gómez Muñoz - 20/11/2026
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { cifrarPassword, comprobarPassword } = require('../utils/password');

// Registro de usuarios
exports.registrar = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios'
      });
    }

    const existente = await db('users').where({ email }).first();

    if (existente) {
      return res.status(409).json({
        error: 'El correo ya está registrado'
      });
    }

    const passwordCifrada = await cifrarPassword(password);

    const [id] = await db('users').insert({
      nombre,
      email,
      password: passwordCifrada,
      rol: 'miembro'
    });

    res.status(201).json({
      id,
      nombre,
      email,
      rol: 'miembro'
    });
  } catch (error) {
    next(error);
  }
};

// Inicio de sesión
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Introduce el correo y la contraseña'
      });
    }

    const usuario = await db('users').where({ email }).first();

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const correcto = await comprobarPassword(password, usuario.password);

    if (!correcto) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({
      mensaje: 'Inicio de sesión correcto',
      token
    });
  } catch (error) {
    next(error);
  }
};
