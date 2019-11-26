var mysql = require('mysql');


let config = {
    user : process.env.DB_USER,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASS
}

if (process.env.DB_INSTANCE_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.DB_INSTANCE_NAME}`;
}

let connection = mysql.createConnection(config);

module.exports = connection;
