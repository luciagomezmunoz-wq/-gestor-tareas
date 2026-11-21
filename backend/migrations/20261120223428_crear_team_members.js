
 // Lucía Gómez Muñoz - 20/11/2026

exports.up = async function(knex) {
  await knex.schema.createTable('team_members', (table) => {
    table.integer('team_id').notNullable()
      .references('id').inTable('teams');

    table.integer('user_id').notNullable()
      .references('id').inTable('users');

    table.primary(['team_id', 'user_id']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('team_members');
};
