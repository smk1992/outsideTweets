var Artist = require('./db/artists.js');
var Stage = require('./db/stages.js');

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
