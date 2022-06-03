const mysql = require('mysql')
const Config = require('./config')

const db = mysql.createConnection({
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  user: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_DATABASE
})

db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('Connected to database')
})

module.exports = db