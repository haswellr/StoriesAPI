var db = require('../db');

/*
	I decided to not format data within the MySQL Query as setting a 
	string to title case is somewhat ugly in MySQL, while it is trivial
	within javascript. Different requests may also call for different
	formatting, which should be handled by the controller.

	I decided to join all fields together rather than run multiple
	select queries, as 1 query with joins is *typically* faster than
	multiple simpler queries. This of course depends on the specifics of
	the problem. In this case, with this little data, it shouldn't really
	matter.
*/
var queries = {
	getAll: "SELECT story.storyId as 'id',story.title, author.fullName as 'author', story.datePublished as 'published' FROM stories story JOIN authors author on (story.authorId = author.id);"
}

exports.getAll = function(callback) {
	db.query(queries.getAll, function (err, rows) {
		if(err)
			callback(err);
		else
			callback(null, rows);
	});
}

//getById

//create

//update

//delete