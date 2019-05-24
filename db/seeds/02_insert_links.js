exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  return knex('links')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('links').insert({
          id: 1,
          url: 'https://www.npmjs.com/package/cookie-parser',
          title: 'cookie_parser npm',
          description: 'npm',
          category: 'npm',
          user_id: 1,
          created_at: new Date()
        }),
        knex('links').insert({
          id: 2,
          url: 'https://www.codecademy.com/',
          title: 'codeacedamy',
          description: 'learn coding!',
          category: 'tutorials',
          user_id: 2,
          created_at: new Date()
        }),
        knex('links').insert({
          id: 3,
          url: 'https://getbootstrap.com/',
          title: 'bootstrap',
          description: 'good tool for css design',
          category: 'css',
          user_id: 3,
          created_at: new Date()
        })
      ]);
    });
};
