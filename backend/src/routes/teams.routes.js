
 // Lucía Gómez Muñoz - 20/11/2026
const express = require('express');
const router = express.Router();

const autenticar = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const db = require('../config/db');
const teamsController = require('../controllers/teams.controller');

// Consultar los equipos del usuario
router.get('/mis-equipos', autenticar, async (req, res, next) => {
  try {
    const equipos = await db('teams')
      .join('team_members', 'teams.id', 'team_members.team_id')
      .where('team_members.user_id', req.usuario.id)
      .select('teams.*');

    res.json(equipos);
  } catch (error) {
    next(error);
  }
});

// Consultar todos los equipos (solo administradores)
router.get('/todos', autenticar, permitirRoles('admin'), async (req, res, next) => {
  try {
    const equipos = await db('teams').select('*');
    res.json(equipos);
  } catch (error) {
    next(error);
  }
});

// Crear un equipo (solo administradores)
router.post('/nuevo', autenticar, permitirRoles('admin'), async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({
        error: 'El nombre del equipo es obligatorio'
      });
    }

    const [id] = await db('teams').insert({
      nombre: nombre.trim()
    });

    res.status(201).json({
      id,
      nombre: nombre.trim()
    });
  } catch (error) {
    next(error);
  }
});

// Añadir miembros a un equipo (solo administradores)
router.post('/:teamId/miembros', autenticar, permitirRoles('admin'), async (req, res, next) => {
  try {
    const teamId = Number(req.params.teamId);
    const userId = Number(req.body.userId);

    if (
      !Number.isInteger(teamId) || teamId <= 0 ||
      !Number.isInteger(userId) || userId <= 0
    ) {
      return res.status(400).json({
        error: 'Identificadores incorrectos'
      });
    }

    const equipo = await db('teams').where({ id: teamId }).first();
    const usuario = await db('users').where({ id: userId }).first();

    if (!equipo || !usuario) {
      return res.status(404).json({
        error: 'Equipo o usuario no encontrado'
      });
    }

    const existente = await db('team_members')
      .where({
        team_id: teamId,
        user_id: userId
      })
      .first();

    if (existente) {
      return res.status(409).json({
        error: 'El usuario ya pertenece al equipo'
      });
    }

    await db('team_members').insert({
      team_id: teamId,
      user_id: userId
    });

    res.status(201).json({
      mensaje: 'Usuario añadido al equipo'
    });
  } catch (error) {
    next(error);
  }
});

// Rutas generales de equipos
// Se colocan al final para evitar conflictos con las anteriores
router.get('/', teamsController.listar);
router.get('/:id', teamsController.obtener);
router.post('/', teamsController.crear);
router.delete('/:id', teamsController.eliminar);

module.exports = router;
