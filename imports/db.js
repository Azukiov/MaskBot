const mariadb = require('mariadb');
const log = require('./logger.js');

const db = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5
});

db.getConnection()
    .then(conn => {
        log.db(`Connected to database ${process.env.DATABASE_NAME}`);
        conn.release();
    })
    .catch(err => {
        log.error(err);
    });

module.exports = db;