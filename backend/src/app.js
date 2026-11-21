
// Lucía Gómez Muñoz - 20/11/2026
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const db = require('./config/db');
const permitirRoles = require('./middleware/roles');
const autenticar = require('./middleware/auth');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const teamAccess = require('./middleware/teamAccess');

const teamsRoutes = require('./routes/teams.routes');
const tasksRoutes = require('./routes/tasks.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Configuración de seguridad
app.disable('x-powered-by');

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json({ limit: '10kb' }));
app.use(logger);

// Limitar los intentos de inicio de sesión
const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos. Inténtalo más tarde.'
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Gestor de tareas funcionando'
  });
});

// Comprobar el acceso a un equipo
app.get('/api/teams/:teamId/acceso', autenticar, teamAccess, (req, res) => {
  res.json({
    mensaje: 'Puedes acceder a este equipo'
  });
});

// Rutas de equipos
app.use('/api/teams', teamsRoutes);

// Rutas de tareas
app.use('/api/tasks', tasksRoutes);

// Aplicar límite al inicio de sesión
app.use('/api/auth/login', limitarLogin);

// Rutas de registro e inicio de sesión
app.use('/api/auth', authRoutes);

// Ruta privada
app.get('/api/privado', autenticar, (req, res) => {
  res.json({
    mensaje: 'Acceso autorizado'
  });
});

// Ruta exclusiva de administradores
app.get('/api/admin', autenticar, permitirRoles('admin'), (req, res) => {
  res.json({
    mensaje: 'Acceso permitido al administrador'
  });
});

// Listar usuarios (solo administradores)
app.get('/api/admin/usuarios', autenticar, permitirRoles('admin'), async (req, res, next) => {
  try {
    const usuarios = await db('users')
      .select('id', 'nombre', 'email', 'rol');

    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

// Middleware de errores
app.use(errorHandler);

module.exports = app;

