
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_credentials', function (table) {
        table.increments('id');
        table.string('email');
        table.string('password');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_credentials');
};
