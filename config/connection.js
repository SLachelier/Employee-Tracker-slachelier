// get the client
require('dotenv').config();
const mysql = require('mysql2');
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
// create the connection to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: db_user,
        password: db_pass,
        database: 'emptracker_db'
    }
)
module.exports = connection;