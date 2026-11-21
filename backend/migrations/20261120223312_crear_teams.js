
// Lucía Gómez Muñoz - 20/11/2026

exports.up = async function(knex) {
  await knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    table.string('nombre').notNullable();

    table.integer('created_by').unsigned().notNullable()
      .references('id').inTable('users');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('teams');
};
