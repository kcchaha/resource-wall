exports.up = function(knex, Promise) {  
    return Promise.all([
      knex.schema.table('links', function(table){
        table.date('created_at')
      })
    ])
  };
  
  exports.down = function(knex, Promise) {  
    return Promise.all([
      knex.schema.table('links', function(table) {
        table.dropColumn('created_at')
      })
    ])
  };