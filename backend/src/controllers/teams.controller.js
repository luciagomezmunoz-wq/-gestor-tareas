
// Lucía Gómez Muñoz - 20/11/2026
const db = require('../config/db');

// Listar equipos
exports.listar = async (req, res, next) => {
  try {
    const equipos = await db('teams').select('*');
    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

// Obtener un equipo
exports.obtener = async (req, res, next) => {
  try {
    const equipo = await db('teams')
      .where({ id: req.params.id })
      .first();

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

// Crear un equipo
exports.crear = async (req, res, next) => {
  try {
    const { nombre, created_by } = req.body;

    if (!nombre || !created_by) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios'
      });
    }

    const [id] = await db('teams').insert({
      nombre,
      created_by
    });

    const equipo = await db('teams').where({ id }).first();
    res.status(201).json(equipo);
  } catch (error) {
    next(error);
  }
};

// Eliminar un equipo
exports.eliminar = async (req, res, next) => {
  try {
    const eliminados = await db('teams')
      .where({ id: req.params.id })
      .del();

    if (!eliminados) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
