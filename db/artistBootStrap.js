var http = require('http');

var Artist = require('./artists.js');


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

http.get('http://static.echonest.com/OutsideLands/lineup_2014.json', function (res) {
  var data = '';  
  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {    
    var artists = JSON.parse(data);    
    for (var i = 0; i < artists.length; i++) {      
      processArtist(artists[i]);     
    }    
  });

}).on('error', function (error) {
  console.log('Got error:', error.message);
});