const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

var db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
