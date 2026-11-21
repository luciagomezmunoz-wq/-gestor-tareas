
 // Lucía Gómez Muñoz - 20/11/2026
exports.up = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('nombre').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('rol').notNullable().defaultTo('miembro');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
