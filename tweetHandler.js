var twit = require('twit');

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
      console.log(data);
      if (data.length > 0) {
        for(var i = 0; i < data.length; i++){
          var currentTweet = data[i];
          //This if statement determines whether we have already handled this specific tweet
          if(!idStrings[currentTweet.id_str]){
           idStrings[currentTweet.id_str] = true;
            var tweetObj = {};
            tweetObj.user =  currentTweet.user.screen_name;
            tweetObj.text = currentTweet.text;
            latestMentions.push(tweetObj);
          }
        }
        module.exports.replyToMentions();
      }
    });
  },

  replyToMentions: function(){  
    for(var i = 0; i < latestMentions.length; i++){
      var currentMention = latestMentions[i];
      //responseTweet is the string we will send to twitter to tweet for us
      var responseTweet = 'Hello @';
      responseTweet += currentMention.user;
      responseTweet += '\nI hope you are having a wonderful day! \n-Your Favorite Node Server';

      //twit will now post this responseTweet to twitter. This function takes a string and a callback
      t.post('statuses/update', { status: responseTweet }, function(err, data, response){
        console.log('posted');
      });
    }
  }

};