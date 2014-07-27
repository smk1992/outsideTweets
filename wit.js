var request = require('request');
var witAuth = require('./secrets.js').wit_auth;


var wit = {
  getWitForMessage: function(message, callback) {
    // remove invalid messages
    if (!message.text.length) { 
      return;
    }

    var url = 'https://api.wit.ai/message?v=20140726&q=' + encodeURIComponent(message.text);

    var options = {
      url: url,
       headers: {
        'Authorization': 'Bearer ' + witAuth,
        'Accept': 'application/vnd.wit.20140620'
      }
    };

    request(options, function(error, response, body) {
      if (error) {
        console.log("Error getting Wit: " + error);
      } else {

        body = JSON.parse(body);
        console.log(body._text, body['outcomes'][0]['entities']);
        callback({
          message: message, 
          intent: body["outcomes"][0]["intent"], 
          entities: body['outcomes'][0]['entities']
        });
      }

    });
  }
};



module.exports = wit;