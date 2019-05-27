
exports.seed = function(knex, Promise) {
  return knex('comments')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('comments').insert({link_id: 1, user_id: 1, comment: 'So tired!'}),
        knex('comments').insert({link_id: 2, user_id: 2, comment: 'We need some food'}),
        knex('comments').insert({link_id: 3, user_id: 3, comment: 'come and get some strawberries'})
      ]);
    });
};