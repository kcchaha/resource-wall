
exports.seed = function(knex, Promise) {
  return knex('comments')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('comments').insert({id: 1, link_id: 1, user_id: 1, comment: 'So tired!'}),
        knex('comments').insert({id: 2, link_id: 2, user_id: 2, comment: 'We need some food'}),
        knex('comments').insert({id: 3, link_id: 3, user_id: 3, comment: 'come and get some strawberries'})
      ]);
    });
};