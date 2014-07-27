var twit = require('twit');
var wit = require('./wit');
var helper = require('./helper.js');

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
          // console.log(data[i].id)
          if (i === data.length - 1) {
            since_id = currentTweet.id + 1;
          }
          //This if statement determines whether we have already handled this specific tweet
          var currentMention = {};
          currentMention.text = currentTweet.text.replace('@outside_tweets', '');
          currentMention.screen_name = currentTweet.user.screen_name;
          module.exports.replyToMentions(currentMention);
        }
      }
    });
  },

  replyToMentions: function(currentMention){

    wit.getWitForMessage(currentMention, function(witResponse) {        
      var responsePerson = '@' + currentMention.screen_name + ": ";            
      var entities = witResponse.entities;
      if (!entities.artist) {
        return;
      }
      
      if (witResponse.intent === 'artist_performs') {
        helper.getArtistPerforms({
          'artist': entities.artist[0].value
        }, function (results) {             
            for (var i = 0; i < results.length; i++) {
              var artist = results[i].artist;
              for (var j = 0; j < results[i].performs.length; j++) {                
                var responseMsg = responsePerson;            
                var from = results[i].performs[j].from;
                var to = results[i].performs[j].to;
                var stage = results[i].performs[j].stage;

                responseMsg += 'YO, ' + artist + ' is playing on ' + stage + 
                                            ' from ' + from + ' - ' + to;               
                t.post('statuses/update', {status: responseMsg}, function(err){
                  console.log(err);
                });          
              }              
            }
          
        });        
      }
    });
  }
};
