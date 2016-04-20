var express = require('express');
var router = express.Router();

var mediaData = [
    {
        "story": 1,
        "type": "mp4",
        "duration": 254,
        "href": "http://foo.bar.mp4"
    },
    {
        "story": 1,
        "type": "jpg",
        "caption": "The Boston area ranks sixth for gridlock-plagued commutes in 2014. Here's morning traffic on Route 1 into Boston in February.",
        "credit": "Jesse Costa/WBUR",
        "href": "http://s3.amazonaws.com/media.wbur.org/wordpress/1/files/2015/08/0213_am-traffic02.jpg"
    },
    {
        "story": 4,
        "type": "jpg",
        "caption": "Some news story caption",
        "credit": "AP",
        "href": "http://foo.bar.jpg"
    }
];

/*
	Simulating the fictional API at http://example.api.npr.org/stories/media,
	as the API at that URL seems to be down.
*/
router.get('/', function(req, res, next) {
  res.send(mediaData);
});

module.exports = router;
