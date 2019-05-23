exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('likes').del()
      .then(function () {
        return knex('links').del().then(function () {
            return knex('user_credentials').del().then(function () {
            });
        });
    });
};
  