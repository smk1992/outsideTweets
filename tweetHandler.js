var twit = require('twit');
var wit = require('./wit');
var helper = require('./helper.js');
var moment = require('moment');


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
    t.get('/statuses/mentions_timeline', { since_id: since_id}, function(err, data, response){        
      if (err) {
        console.log(err);
        return;
      }
      if (data.length > 0) {
        for(var i = data.length - 1; i >= 0; i--) {
          var currentTweet = data[i];
          if (i === data.length - 1) {
            since_id = currentTweet.id;
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
    
      console.log("intent", witResponse.intent);
      if (witResponse.intent === 'artist_performs') {
        if (!entities.artist) {
          return;
        }
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
                var date = moment(results[i].performs[j].date);
                date.hour(from.split(':')[0]);
                date.minute(from.split(':')[1]);
                responseMsg += 'YO, ' + artist + ' is playing on ' + stage + 
                                                  ' ' + date.fromNow();  

                console.log("responses", responseMsg);                                                                        
                t.post('statuses/update', {status: responseMsg}, function(err){
                  if (err) {
                    console.log(err, this.resp);
                  }
                }.bind({resp: responseMsg}));          
              }              
            }
          
        });        
      } else if (witResponse.intent === 'stage_artist') {        
        var callback = function (result) {
          if (!result) {
            return;
          } 

          var responseMsg = responsePerson;   
          var lineup = result.lineup; 
          var now = moment();

          for (var i = 0; i < lineup.length; i++) {                   
            var fromTime = moment(lineup.date);             
            fromTime.hour(lineup[i].from.split(':')[0]);
            fromTime.minute(lineup[i].from.split(':')[1]);
            
            var toTime = moment(lineup.date);
            toTime.hour(lineup[i].to.split(':')[0]);
            toTime.minute(lineup[i].to.split(':')[1]);
            
            if (now.diff(fromTime) >= 0 && now.diff(toTime) < 0) {              
              responseMsg += 'YO, ' + lineup[i].artist + ' is now performing on ' + 
                                    stage + ' Right Now!';                                                                                    
                t.post('statuses/update', {status: responseMsg}, function(err){
                  if (err) {
                    console.log(err);
                  }
                });          

              return;
            }          
          }
          
          responseMsg += 'YO, No one is playing Right Now!';

          console.log(responseMsg);

          t.post('statuses/update', {status: responseMsg}, function(err){
            if (err) {
              console.log(err, responseMsg);
            }
          });     
        };
        
        if (!entities.stage) { 
          return;
        }
        if (entities.stage[0].value === 'Lands End') {          
          helper.getStagePerformer({
            name : entities.stage[0].value.toString()
          }, callback);        
        }
      }
    });
  }
};
