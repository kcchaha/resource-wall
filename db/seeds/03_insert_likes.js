exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('likes')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('likes').insert({link_id: 2, user_id: 1}),
        knex('likes').insert({link_id: 3, user_id: 2}),
        knex('likes').insert({link_id: 2, user_id: 3})
      ]);
    });
};
