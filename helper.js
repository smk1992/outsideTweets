var Artist = require('./db/artists.js');
var Stage = require('./db/stages.js');

var helper = {};

// get artist
helper.getArtistPerforms = function (filter, callback) {
  Artist.find({}, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log(filter);

    if (results) {
      var newResult = [];
      for (var i = 0; i < results.length; i++) {
        var artist = results[i].artist.toLowerCase();
        if (filter.artist.toLowerCase() === artist) {
          newResult.push(results[i]);;
        }
      }
      callback(newResult); 
    }
  });
};

helper.getStagePerformer = function (filter, callback) {
  Stage.findOne(filter, function (err, stage) {
    if (err) {
      console.log(err);
      return;
    }
    
    if (stage) {
      callback(stage); 
    }
  });
};

module.exports = helper;
