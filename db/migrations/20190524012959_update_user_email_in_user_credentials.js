exports.up = function (knex, Promise) {
  return knex.schema.alterTable('user_credentials', function (table) {
    table.string('email').unique().notNullable().alter();
    table.string('password').notNullable().alter();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('user_credentials', function (table) {
    table.string('email').alter();
    table.string('password').alter();
  })
};
