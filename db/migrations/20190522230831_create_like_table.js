exports.up = function(knex, Promise) {
    return knex.schema.createTable('likes', function (table) {
        table.increments('id');
        table.integer('link_id').references('id').inTable('links');
        table.integer('user_id').references('id').inTable('user_credentials');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('likes');
};