var mysql = require('mysql');
var config = require('./config');
var pool = mysql.createPool({
	connectionLimit: 10,
	host: config.database.url,
	port: config.database.port,
	database: config.database.database,
	user: config.database.user,
	password: config.database.password
});

module.exports = pool;