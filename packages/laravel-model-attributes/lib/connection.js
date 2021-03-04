const mysql = require('mysql');

const connectionInstance = null;

function con() {
   return new Promise(function(resolve, reject) {
      var connection = mysql.createConnection({
         host: atom.config.get('laravel-model-attributes.mysqlDatabaseHost'),
         user: atom.config.get('laravel-model-attributes.username'),
         password: atom.config.get('laravel-model-attributes.password'),
         database:atom.config.get('laravel-model-attributes.databaseName'),
      })
      connection.connect(function(err) {
        if (err) {
          reject({message:err.stack});
        }
        else {
           resolve(connection)
        }
      });
   });
}

module.exports = {dbconn:con,connectionInstance:connectionInstance};
