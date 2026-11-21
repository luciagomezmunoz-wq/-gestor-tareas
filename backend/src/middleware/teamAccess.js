
 // Lucía Gómez Muñoz - 20/11/2026
const db = require('../config/db');

async function teamAccess(req, res, next) {
  try {
    const teamId = Number(req.params.teamId);

    if (!Number.isInteger(teamId) || teamId <= 0) {
      return res.status(400).json({
        error: 'Identificador de equipo incorrecto'
      });
    }

    if (req.usuario.rol === 'admin') {
      return next();
    }

    const miembro = await db('team_members')
      .where({
        team_id: teamId,
        user_id: req.usuario.id
      })
      .first();

    if (!miembro) {
      return res.status(403).json({
        error: 'No perteneces a este equipo'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = teamAccess;
