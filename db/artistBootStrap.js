var http = require('http');

var Artist = require('./artists.js');


// Hard Data For Artist Schedule - Scraped Separately
var scheduleStrFri = '[{"stage":"Lands End","schedule":{"The Soul Rebels":"12:40 - 1:30","Run the Jewels (El-P & Killer Mike)":"2:00 - 2:50","Holy Ghost!":"3:20 - 4:20","Chromeo":"4:50 - 5:50","Disclosure":"6:20 - 7:20","Kanye West":"8:05 - 9:50"}},{"stage":"Sutro","schedule":{"RayLand Baxter":"12:00 - 12:40","Greensky Bluegrass":"1:10 - 2:00","Phosphorescent":"2:30 - 3:30","Nicki Bluhm and The Gramblers":"4:00 - 5:00","Kacey Musgraves":"5:30 - 6:30","Tedeschi Trucks Band":"7:00 - 8:15"}},{"stage":"Twin Peaks","schedule":{"Aer":"12:45 - 1:30","Bleachers":"2:10 - 2:55","Warpaint":"3:40 - 4:30","Grouplove":"5:15 - 6:05","Tegan & Sara":"6:50 - 7:50","Arctic Monkeys":"8:40 - 9:55"}},{"stage":"Panhandle","schedule":{"Night Terrors of 1927":"12:00 - 12:40","USPS Janis Joplin Tribute":"1:30 - 2:10","Nahko and Medicine for the People":"2:55 - 3:35","Mikal Cronin":"4:30 - 5:10","Bear Hands":"6:05 - 6:45","Typhoon":"7:50 - 8:35"}},{"stage":"The House by Heineken","schedule":{"Shouts!":"12:00 - 1:30","DJ Dials":"1:30 - 3:00","Motion Potion":"3:00 - 4:30","Paul Johnson":"4:30 - 6:00","DJ Icey":"6:00 - 8:00"}},{"stage":"The BarbaryCo-Curated by SF Sketchfest","schedule":{"Garfunkel & Oates and Aparna Nancherla":"6:15 - 7:15","Aisha Tyler, Ali Mafi and Matt McCarthy":"2:30 - 3:45","Lewis Black, Rory Albanese and Aparna Nancherla":"4:30 - 5:45"}}]';

var scheduleStrSat = '[{"stage":"Lands End","schedule":{"Dum Dum Girls":"12:20 - 1:10","The Kooks":"1:40 - 2:30","Local Natives":"3:00 - 4:00","Haim":"4:30 - 5:30","Death Cab For Cutie":"6:00 - 7:10","Tom Petty & the Heartbreakers":"7:55 - 9:55"}},{"stage":"Sutro","schedule":{"Tumbleweed Wanderers":"12:00 - 12:45","Valerie June":"1:10 - 2:00","Christopher Owens":"2:30 - 3:30","Deer Tick":"4:00 - 5:00","John Butler Trio":"5:30 - 6:30","Atmosphere":"7:00 - 8:10"}},{"stage":"Twin Peaks","schedule":{"Trails and Ways":"12:40 - 1:25","Jagwar Ma":"2:05 - 2:55","Tycho":"3:40 - 4:30","Capital Cities":"5:15 - 6:05","Duck Sauce":"6:55 - 7:55","Macklemore & Ryan Lewis":"8:40 - 9:55"}},{"stage":"Panhandle","schedule":{"Nocona":"12:00 - 12:40","The Districts":"1:25 - 2:05","Finish Ticket":"2:55 - 3:35","Vance Joy":"4:30 - 5:10","Big Freedia":"6:05 - 6:50","Boys Noize":"7:55 - 8:40"}},{"stage":"The House by Heineken","schedule":{"Matt Haze":"12:00 - 1:30","Deejay Theory":"1:30 - 3:00","Shawn Reynaldo":"3:00 - 4:30","The Scumfrog":"4:30 - 6:00","Gorgon City":"6:00 - 7:45"}},{"stage":"The BarbaryCo-Curated by SF Sketchfest","schedule":{"The Chris Gethard Show":"12:45 - 1:45","Improv4Humans - Upright Citizens Brigade' + "'" + 's Matt Besser with guests Chris Gethard, Lauren Lapkus and Seth Morris":"2:15 - 3:15","The Improvised Shakespeare Company":"4:00 - 5:00","Aisha Tyler, Ali Mafi and Matt McCarthy":"5:45 - 7:00"}}]';

var scheduleStrSun = '[{"stage":"Lands End","schedule":{"Imelda May":"12:30 - 1:20","Paolo Nutini":"1:50 - 2:40","CHVRCHES":"3:10 - 4:10","Spoon":"4:40 - 5:40","The Flaming Lips":"6:10 - 7:20","The Killers":"8:05 - 9:35"}},{"stage":"Sutro","schedule":{"Jonathan Wilson":"12:00 - 12:45","Woods":"1:10 - 2:00","Lucius":"2:30 - 3:20","Jenny Lewis":"3:50 - 4:50","Ben Howard":"5:20 - 6:20","Ray LaMontagne":"6:50 - 8:00"}},{"stage":"Twin Peaks","schedule":{"Made in Heights":"12:40 - 1:20","Watsky":"2:00 - 2:45","Flume":"3:30 - 4:20","Lykke Li":"5:05 - 5:55","Cut Copy":"6:40 - 7:40","Tiësto":"8:25 - 9:35"}},{"stage":"Panhandle","schedule":{"The Bots":"12:00 - 12:40","The Brothers Comatose":"1:20 - 2:00","Hiss Golden Messenger":"2:45 - 3:25","Courtney Barnett":"4:20 - 5:00","Gardens & Villa":"5:55 - 6:35","Gold Panda":"7:40 - 8:25"}},{"stage":"The House by Heineken","schedule":{"Lights Down Low: Richie Panic, Sleazemore & MPHD":"12:00 - 3:00","Cappa Regime":"3:00 - 4:00","Soultech ' + "'" + 'Gene Farris & Dustin Sheridan' + "'" + '":"4:00 - 5:30","Green Velvet":"5:30 - 8:00"}},{"stage":"The BarbaryCo-Curated by SF Sketchfest","schedule":{"The Improvised Shakespeare Company":"12:45 - 1:45","Lewis Black and Rory Albanese":"2:30 - 3:45","Stars of Silicon Valley: Thomas Middleditch, T.J. Miller, and Kumail Nanjiani":"4:30 - 6:00","Stars of Silicon Valley: Thomas Middleditch, T.J. Miller and Kumail Nanjiani":"6:30 - 8:00"}}]';



var daySchedules = [JSON.parse(scheduleStrFri), JSON.parse(scheduleStrSat), JSON.parse(scheduleStrSun)]; 

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