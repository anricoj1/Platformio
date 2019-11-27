var mysql = require('mysql');
var dbconfig = require('./database');

var connection = mysql.createConnection(dbconfig.connection);

module.exports = connection;
