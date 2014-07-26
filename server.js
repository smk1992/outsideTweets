var app = require('express')();
var twit = require('twit');

var consumer_key = require('./secrets.js').consumer_key;
var consumer_secret = require('./secrets.js').consumer_secret;
var access_token = require('./secrets.js').access_token_key;
var access_token_secret = require('./secrets.js').access_token_secret;

console.log('c key', consumer_key)
console.log('c secret', consumer_secret)
console.log('a token', access_token)
console.log('a secret', access_token_secret)

var t = new twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

t.get('users/suggestions/:slug', { slug: 'funny' }, function (err, data, response) {
  console.log(data)
});

var port = process.env.port || 3000;

app.get('/', function(req, res) {
  res.send("go outside tweets!!!")
})

var server = app.listen(port, function() {
  console.log('listening on port 3000');
})

