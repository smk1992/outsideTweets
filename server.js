var app = require('express')();
var tweetHandler = require('./tweetHandler.js');


// t.get('/statuses/mentions_timeline', function (err, data, response) {
//   console.log(data);
// });

var port = process.env.port || 3000;

app.get('/', function(req, res) {
  res.send("go outside tweets!!!");
})

var server = app.listen(port, function() {
  console.log('listening on port 3000');
})
 

tweetHandler.getMentions();