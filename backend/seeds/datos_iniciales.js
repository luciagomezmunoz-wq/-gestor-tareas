
 // Lucía Gómez Muñoz - 20/11/2026
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Borrar datos anteriores
  await knex('tasks').del();
  await knex('team_members').del();
  await knex('teams').del();
  await knex('users').del();

  // Cifrar contraseña de prueba
  const password = await bcrypt.hash('Prueba123!', 12);

  // Crear usuarios
  await knex('users').insert([
    {
      id: 1,
      nombre: 'Lucía',
      email: 'lucia@example.com',
      password,
      rol: 'admin'
    },
    {
      id: 2,
      nombre: 'Ana',
      email: 'ana@example.com',
      password,
      rol: 'miembro'
    },
    {
      id: 3,
      nombre: 'Carlos',
      email: 'carlos@example.com',
      password,
      rol: 'miembro'
    }
  ]);

  // Crear equipos
  await knex('teams').insert([
    { id: 1, nombre: 'Equipo Desarrollo', created_by: 1 },
    { id: 2, nombre: 'Equipo Pruebas', created_by: 1 }
  ]);

  // Relacionar usuarios y equipos
  await knex('team_members').insert([
    { team_id: 1, user_id: 1 },
    { team_id: 1, user_id: 2 },
    { team_id: 2, user_id: 1 },
    { team_id: 2, user_id: 3 }
  ]);

  // Crear tareas
  await knex('tasks').insert([
    {
      id: 1,
      titulo: 'Preparar proyecto',
      descripcion: 'Crear la estructura',
      estado: 'completada',
      team_id: 1,
      assigned_to: 2
    },
    {
      id: 2,
      titulo: 'Probar servidor',
      descripcion: 'Comprobar las rutas',
      estado: 'pendiente',
      team_id: 1,
      assigned_to: 1
    },
    {
      id: 3,
      titulo: 'Revisar errores',
      descripcion: 'Probar la API',
      estado: 'pendiente',
      team_id: 2,
      assigned_to: 3
    }
  ]);
};
