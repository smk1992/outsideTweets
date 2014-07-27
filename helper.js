var Artist = require('./db/artists.js');

var helper = {};

// get artist
helper.getArtistPerforms = function (filter, callback) {
  Artist.find(filter, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }

    if (results) {
      callback(results); 
    }
  });
};

module.exports = helper;
