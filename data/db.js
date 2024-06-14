
var mysql = require('mysql');
var db = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE
});

db.connect();



module.exports = db;

