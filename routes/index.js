var express = require('express');
var router = express.Router();

var data = {
	title: 'Stories API',
	endpoint: '/api/stories'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', data);
});

module.exports = router;
