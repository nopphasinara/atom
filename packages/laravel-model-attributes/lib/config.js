module.exports = {
   "mysqlDatabaseHost":{
      "description":"the host for you MySQL database (usually localhost)",
      "type":"string",
      "default":""
   },
   "databaseName":{
      "description":"Name for Database (Required)",
      "type":"string",
      "default":""
   },
   "username":{
      "description":"Username for accessing the database (Required)",
      "type":"string",
      "default":""
   },
   "showNotifications":{
      "description":"Do you want to show notifications?",
      "type":"boolean",
      "default":false
   },
   "password":{
      "description":"Password (Required)",
      "type":"string",
      "default":""
   }
};
