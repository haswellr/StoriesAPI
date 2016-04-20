var db = require('../db');

exports.getById = function(id,callback) {
	db.query('SELECT * FROM stations WHERE id = ?', id, function (err, rows) {
		if(err)
			callback(err);
		else
			callback(null, rows);
	});
}

//getAll

//create

//update

//delete