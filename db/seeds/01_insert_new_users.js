exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_credentials')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('user_credentials').insert({
          id: 1,
          email: 'kcchaha@gmail.com',
          password: '123'
        }),
        knex('user_credentials').insert({
          id: 2,
          email: 'gizem_ocak@outlook.com',
          password: '123'
        }),
        knex('user_credentials').insert({
          id: 3,
          email: 'adamcraveiro@gmail.com',
          password: '123'
        })
      ]);
    });
};
