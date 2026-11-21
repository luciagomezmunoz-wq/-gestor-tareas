
 // Lucía Gómez Muñoz - 20/11/2026
const db = require('../config/db');

// Listar todas las tareas
const listar = () => {
  return db('tasks').select('*');
};

// Buscar una tarea por su ID
const obtener = (id) => {
  return db('tasks').where({ id }).first();
};

// Crear una tarea
const crear = async (datos) => {
  const [id] = await db('tasks').insert(datos);
  return obtener(id);
};

// Actualizar una tarea
const actualizar = async (id, datos) => {
  const modificadas = await db('tasks').where({ id }).update(datos);
  return modificadas ? obtener(id) : null;
};

// Eliminar una tarea
const eliminar = (id) => {
  return db('tasks').where({ id }).del();
};

 // Consultar tareas con sus usuarios y equipos
const listarConDetalles = () => {
  return db('tasks')
    .join('teams', 'tasks.team_id', 'teams.id')
    .leftJoin('users', 'tasks.assigned_to', 'users.id')
    .select(
      'tasks.id',
      'tasks.titulo',
      'tasks.descripcion',
      'tasks.estado',
      'teams.nombre as equipo',
      'users.nombre as usuario'
    );
};

 // Lucía Gómez Muñoz - 20/11/2026

// Contar las tareas de un equipo según su estado
const contarPorEstado = (teamId) => {
  return db('tasks')
    .where('team_id', teamId)
    .select('estado')
    .count('* as total')
    .groupBy('estado');
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  listarConDetalles,
  contarPorEstado
};
