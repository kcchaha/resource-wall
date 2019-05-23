
exports.up = function(knex, Promise) {
    return knex.schema.createTable('comments', function (table) {
        table.increments('id');
        table.integer('link_id').references('id').inTable('links');
        table.integer('user_id').references('id').inTable('user_credentials');
        table.string('comment');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('comments');
};