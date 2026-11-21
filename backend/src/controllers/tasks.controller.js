
 // Lucía Gómez Muñoz - 20/11/2026
const service = require('../services/tasks.service');
const db = require('../config/db');

// Comprobar si el usuario pertenece a un equipo
async function puedeAcceder(usuario, teamId) {
  if (usuario.rol === 'admin') {
    return true;
  }

  const miembro = await db('team_members')
    .where({
      team_id: teamId,
      user_id: usuario.id
    })
    .first();

  return Boolean(miembro);
}

// Comprobar si el usuario asignado pertenece al equipo
async function comprobarAsignacion(teamId, userId) {
  const usuario = await db('users')
    .where({ id: userId })
    .first();

  if (!usuario) {
    return false;
  }

  const miembro = await db('team_members')
    .where({
      team_id: teamId,
      user_id: userId
    })
    .first();

  return Boolean(miembro);
}

// Listar las tareas a las que puede acceder el usuario
exports.listar = async (req, res, next) => {
  try {
    const tareas = await service.listar();

    if (req.usuario.rol === 'admin') {
      return res.json(tareas);
    }

    const equipos = await db('team_members')
      .where({ user_id: req.usuario.id })
      .select('team_id');

    const ids = equipos.map(equipo => equipo.team_id);

    const tareasPermitidas = tareas.filter(tarea =>
      ids.includes(tarea.team_id)
    );

    res.json(tareasPermitidas);
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea
exports.obtener = async (req, res, next) => {
  try {
    const tarea = await service.obtener(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    if (!(await puedeAcceder(req.usuario, tarea.team_id))) {
      return res.status(403).json({
        error: 'No tienes permiso para acceder a esta tarea'
      });
    }

    res.json(tarea);
  } catch (error) {
    next(error);
  }
};

// Crear y asignar una tarea
exports.crear = async (req, res, next) => {
  try {
    const { titulo, descripcion, estado, team_id, assigned_to } = req.body;
    const teamId = Number(team_id);

    if (
      typeof titulo !== 'string' ||
      !titulo.trim() ||
      !Number.isInteger(teamId) ||
      teamId <= 0
    ) {
      return res.status(400).json({
        error: 'Título o equipo incorrecto'
      });
    }

    const equipo = await db('teams')
      .where({ id: teamId })
      .first();

    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    if (!(await puedeAcceder(req.usuario, teamId))) {
      return res.status(403).json({
        error: 'No perteneces a este equipo'
      });
    }

    let usuarioAsignado = null;

    if (assigned_to !== undefined && assigned_to !== null) {
      usuarioAsignado = Number(assigned_to);

      if (
        !Number.isInteger(usuarioAsignado) ||
        usuarioAsignado <= 0 ||
        !(await comprobarAsignacion(teamId, usuarioAsignado))
      ) {
        return res.status(400).json({
          error: 'El usuario asignado debe pertenecer al equipo'
        });
      }
    }

    const tarea = await service.crear({
      titulo: titulo.trim(),
      descripcion,
      estado: estado || 'pendiente',
      team_id: teamId,
      assigned_to: usuarioAsignado
    });

    // Notificación simulada
    if (usuarioAsignado !== null) {
      console.log(
        `Notificación: tarea "${titulo}" asignada al usuario ${usuarioAsignado}`
      );
    }

    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
};

// Actualizar una tarea
exports.actualizar = async (req, res, next) => {
  try {
    const tareaActual = await service.obtener(req.params.id);

    if (!tareaActual) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    if (!(await puedeAcceder(req.usuario, tareaActual.team_id))) {
      return res.status(403).json({
        error: 'No tienes permiso para modificar esta tarea'
      });
    }

    const datos = {};
    const campos = ['titulo', 'descripcion', 'estado', 'assigned_to'];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        datos[campo] = req.body[campo];
      }
    }

    if (Object.keys(datos).length === 0) {
      return res.status(400).json({
        error: 'No hay datos válidos para actualizar'
      });
    }

    if (
      datos.titulo !== undefined &&
      (typeof datos.titulo !== 'string' || !datos.titulo.trim())
    ) {
      return res.status(400).json({
        error: 'El título no es válido'
      });
    }

    if (datos.titulo !== undefined) {
      datos.titulo = datos.titulo.trim();
    }

    if (
      datos.assigned_to !== undefined &&
      datos.assigned_to !== null
    ) {
      const userId = Number(datos.assigned_to);

      if (
        !Number.isInteger(userId) ||
        userId <= 0 ||
        !(await comprobarAsignacion(tareaActual.team_id, userId))
      ) {
        return res.status(400).json({
          error: 'El usuario asignado debe pertenecer al equipo'
        });
      }

      datos.assigned_to = userId;
    }

    const tarea = await service.actualizar(req.params.id, datos);

    if (
      datos.assigned_to != null &&
      Number(datos.assigned_to) !== Number(tareaActual.assigned_to)
    ) {
      console.log(
        `Notificación: tarea "${tareaActual.titulo}" asignada al usuario ${datos.assigned_to}`
      );
    }

    res.json(tarea);
  } catch (error) {
    next(error);
  }
};

// Eliminar una tarea
exports.eliminar = async (req, res, next) => {
  try {
    const tarea = await service.obtener(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        error: 'Tarea no encontrada'
      });
    }

    if (!(await puedeAcceder(req.usuario, tarea.team_id))) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar esta tarea'
      });
    }

    await service.eliminar(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Estadísticas de tareas por estado
exports.estadisticas = async (req, res, next) => {
  try {
    const teamId = Number(req.params.teamId);

    if (!Number.isInteger(teamId) || teamId <= 0) {
      return res.status(400).json({
        error: 'Identificador de equipo incorrecto'
      });
    }

    const equipo = await db('teams')
      .where({ id: teamId })
      .first();

    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    if (!(await puedeAcceder(req.usuario, teamId))) {
      return res.status(403).json({
        error: 'No tienes acceso a este equipo'
      });
    }

    const estadisticas = await service.contarPorEstado(teamId);

    res.json({
      equipo: equipo.nombre,
      estadisticas
    });
  } catch (error) {
    next(error);
  }
};
