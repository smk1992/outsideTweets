var Twit = require('twit');

var consumer_key = require('../secrets.js').consumer_key;
var consumer_secret = require('../secrets.js').consumer_secret;
var access_token = require('../secrets.js').access_token_key;
var access_token_secret = require('../secrets.js').access_token_secret;


var twit = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

// create stream to get searches 
// var stream = twit.stream('statuses/filter', { track : 'outside land' });

// stream.on('tweet', function (tweet) {
//   console.log('found tweet:', tweet);
// });

var stream = twit.stream('statuses/filter', { track : 'outside land' });

stream.on('tweet', function (tweet) {
  console.log('found tweet:', tweet);
});

// Anaylyzing/Processing those tweets and and generating obj with tweets and score



// Design A way to Store those tweets.