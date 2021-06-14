const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  debug:true,
  // waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

console.log("host :"+process.env.DB_PORT)

module.exports = pool