const mysql = require("mysql2");
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Raunak@1234',
    database: 'sql_bench',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = { pool };