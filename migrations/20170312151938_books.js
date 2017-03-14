//when you run the migration
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable().defaultTo('');
    table.string('author', 255).notNullable().defaultTo('');
    table.string('genre', 255).notNullable().defaultTo('');
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
}

//when you run rollback
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("books");
}
