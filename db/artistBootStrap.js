var http = require('http');

var Artist = require('./artists.js');
var Stage = require('./stages.js');


var processArtist = function (data) {
  Artist.findOne({ 'artist' : data.artist } , function (err, found) {
    if (err) {
      console.log(err);
      return;
    }

    if (!found) {
      var performs = [];
      for (var i = 0; i < data.shows.length; i++) {
        var show = data.shows[i];  
        var time = show.time.split('-');
        var from = time[0].trim();
        var to = time[1].trim();

        performs.push({
          'date' : show.date,
          'to' : to,
          'from' : from,
          'stage' : show.stage
        });
      }

      Artist.create({
        'artist': data.artist,
        'performs' : performs
      });
      console.log('created');
    } else {
      console.log("found", found);
    }
  });
};

var processStages = function (stages) {  
  for (var stage in stages) {    
    Stage.findOne({ 'name' : stage}, function (err, found) {
      if (err) {
        console.log("error", err);
      }

      if (!found) {                        
        Stage.create({
          'name' : this.name,
          'lineup' : this.lineup 
        }, function (err, stage) {
            if (err) return console.log(err);

            console.log('created Stage'); 
        });
      } else {

      }
    }.bind(stages[stage]));
  } 
}

http.get('http://static.echonest.com/OutsideLands/lineup_2014.json', function (res) {
  var data = '';  
  var stages = {};
  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {    
    var artists = JSON.parse(data);    
    //
    for (var i = 0; i < artists.length; i++) {      
      processArtist(artists[i]);     
      accumulateStages(artists[i], stages);     
    }
    
    processStages(stages);    
  });

}).on('error', function (error) {
  console.log('Got error:', error.message);
});


function accumulateStages(artist, accum) {

  for (var i = 0; i < artist.shows.length; i++) {      
    accum[artist.shows[i].stage] = accum[artist.shows[i].stage] || {};

    var stage = accum[artist.shows[i].stage];

    stage.name = stage.name || artist.shows[i].stage;
    stage.lineup = stage.lineup || [];

    var show = artist.shows[i];
    var time = show.time.split('-');
    var from = time[0].trim();
    var to = time[1].trim();

    stage.lineup.push({
      'artist' : artist.artist,
      'date' : show.date,
      'from' : from,
      'to' : to
    });
  }
}