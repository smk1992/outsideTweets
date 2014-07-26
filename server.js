var app = require('express')();
var consumer_key = require('./secrets.js').consumer_key;
var consumer_secret = require('./secrets.js').consumer_secret;
var access_token_key = require('./secrets.js').access_token_key;
var access_token_secret = require('./secrets.js').access_token_secret;


var port = process.env.port || 3000;

