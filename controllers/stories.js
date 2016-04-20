var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../db');
var config = require('../config');
var async = require('async');
var moment = require('moment');

var author = require('../models/author');
var station = require('../models/station');
var story = require('../models/story');

//Retrieve media from external API
function getMedia(callback){
	var mediaUrl = config.mediaEndpoint;
	request(mediaUrl, function(error, response, body) {
		if(!error && response.statusCode == 200){
			var mediaList = [];
			var parseErr;
			try{
				mediaList = JSON.parse(body);
			}
			catch(err){
				parseErr = "Unable to parse media.";
			}
			if(parseErr)
				callback("Unable to parse media.");
			else
				callback(null, mediaList);
		}
		else
			callback("Unable to retrieve media.");
	});
}

function toTitleCase(text) {
  var i, j, str, lowers, uppers;
  str = text.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
      uppers[i].toUpperCase());

  return str;
}

function formatMedia(media){
	var isImage = (media.type=="jpg");
	var isAudio = (media.type=="mp4");	//mp4 is typically used for video, but based on the instructions of the exercise I am treating it as audio
	var output = {};
	if(isImage){
		output.image = media.href;
		output.credit = media.credit;
		output.caption = media.caption;
	}
	else if(isAudio){
		output.audio = media.href;
		if(media.duration){
			var minutes = Math.floor(media.duration / 60);
			var seconds = media.duration % 60;
			output.duration = ('0'+minutes).slice(-2) + ":" + ('0'+seconds).slice(-2);
		}
	}
	return(output);
}

function formatStory(story) {
	var output = {
		title: toTitleCase(story.title),
		author: toTitleCase(story.author),
		published: moment(story.published).format('dddd, MMMM D, YYYY [at] h:mm A'),
		media: []
	};
	if(story.media){
		var mediaList = [];
		for(var i=0;i<story.media.length;i++){
			mediaList.push(formatMedia(story.media[i]));
		}
		output.media = mediaList;
	}
	return(output);
}

/* GET stories listing. */
router.get('/', function(req, res, next) {
	//Get stories from database and media from API in parallel
	async.parallel([
		story.getAll,
		getMedia
	],
	function(err, results){
		if(err)
			res.send("Unable to retrieve stories.");
		else{
			//We now have stories and media, so combine them
			var stories = results[0];
			var mediaList = results[1];
			var mediaHash = {};
			/*
				Convert mediaList to hash for faster lookups to go from O(n^2) to O(n)
				Ideally the media API would let us look up by story ID or other parameters
				rather than just getting a potentially huge list.
			*/
			for(var i=0;i<mediaList.length;i++){
				var media = mediaList[i];
				if(!mediaHash[media.story])
					mediaHash[media.story] = [];
				mediaHash[media.story].push(media);
			}
			//Now that it is hashed, add the corresponding media to each story and format
			for(var i=0;i<stories.length;i++){
				var story = stories[i];
				story.media = mediaHash[story.id];
				stories[i] = formatStory(story);
			}
			//Send back formatted and joined stories
			res.send(stories);
		}
	});
});

module.exports = router;
