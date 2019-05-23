
exports.up = function(knex, Promise) {
    return knex.schema.createTable('links', function (table) {
        table.increments('id');
        table.string('url');
        table.string('title');
        table.string('description');
        table.string('category');
        table.foreignkey('user_id').references('id').inTable('user_credentials');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('links');
};
