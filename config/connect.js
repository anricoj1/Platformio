var mysql = require('mysql');
var dbconfig = require('./database');

let pool;
const createPool = async () => {
    pool = await mysql.createPool({
        user : process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: 3306
    });
};


module.exports = createPool;
