// const mysql = require('mysql');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootroot',
    database: 'ecommerce_next',
    port: 3306,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
    connection.release(); // Liberar la conexión para que el pool la gestione
});

module.exports = pool;
