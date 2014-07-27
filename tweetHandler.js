var twit = require('twit');
var wit = require('wit');

var consumer_key = require('./secrets.js').consumer_key;
var consumer_secret = require('./secrets.js').consumer_secret;
var access_token = require('./secrets.js').access_token_key;
var access_token_secret = require('./secrets.js').access_token_secret;

var t = new twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

var latestMentions = [];  
var idStrings = {}; 

var since_id;

module.exports = {

  getMentions: function() {
    t.get('/statuses/mentions_timeline', { since_id: since_id }, function(err, data, response){  
      // console.log(data)
      if (data.length > 0) {
        for(var i = data.length - 1; i >= 0; i--) {
          var currentTweet = data[i];
          console.log(data[i].id)
          if (i === data.length - 1) {
            since_id = currentTweet.id + 1;
          }
          //This if statement determines whether we have already handled this specific tweet
          var tweetObj = {};
          tweetObj.text = currentTweet.text;
          tweetObj.screen_name = currentTweet.user.screen_name;
        }
      }
    });
  },

  replyToMentions: function(tweetObj){  

    var to = '@' + tweetObj.screen_name + ':';
    var responseText = 'yo sup brah';

    var tweet = to + ' ' + responseText;

    t.post('statuses/update', { status: tweet }, function(err, data, response){
      console.log(err)
      console.log('tweeted');
    });
  }

};