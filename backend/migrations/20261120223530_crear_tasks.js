
 // Lucía Gómez Muñoz - 20/11/2026

exports.up = async function(knex) {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descripcion');
    table.string('estado').notNullable().defaultTo('pendiente');

    table.integer('team_id').notNullable()
      .references('id').inTable('teams');

    table.integer('assigned_to')
      .references('id').inTable('users');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tasks');
};

