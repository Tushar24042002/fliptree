const mysql = require('mysql2');
const env  = require('dotenv');
env.config();
const pool = mysql.createPool({
    connectionLimit: 100,       
    host: process.env.DB_HOST,     
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port : process.env.DB_PORT  
});

module.exports = pool;