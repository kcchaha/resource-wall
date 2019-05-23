exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('rating')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('rating').insert({
          id: 1,
          value: 5,
          link_id: 1,
          user_id: 1
        }),
        knex('rating').insert({
          id: 2,
          value: 3,
          link_id: 2,
          user_id: 2
        }),
        knex('rating').insert({
          id: 3,
          value: 2,
          link_id: 3,
          user_id: 3
        })
      ]);
    });
};
