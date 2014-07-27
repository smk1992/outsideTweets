var Twit = require('twit');
var sentiment = require('sentiment');

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
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];
var keywords = ['outsidelands is','outsideland','outsidelands', 'kanye'];
console.log('listing for outside land');
var stream = twit.stream('statuses/filter', { track : keywords.join(), locations: sanFrancisco});

var once = 0;
stream.on('tweet', function (tweet) {

  if (once < 50) {
    var result = analyzeTweet(tweet);
    console.log('found tweet:', result);
    once++;
  }
});



// Anaylyzing/Processing those tweets and and generating obj with tweets and score
var analyzeTweet = function (tweet) {
  var score = sentiment(tweet.text);
  return {
    'tweet': tweet.text,
    'score' : score.score,
    'createdAt' : tweet.created_at,
    'user' : tweet.user.id
  };
}


// Design A way to Store those tweets.