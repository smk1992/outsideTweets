var mongoose = require('./config');

var Schema = mongoose.Schema;    

var ArtistSchema = new Schema({  
    artist : String,
    performs : [{date: String, from:String, to:String, stage:String}]    
});



var Artist = mongoose.model('Artist', ArtistSchema);


module.exports = Artist;