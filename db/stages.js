var mongoose = require('./config');

var Schema = mongoose.Schema;    

var StageSchema = new Schema({  
    name : String,
    lineup : [{artist: String, from:String, to:String, date:String}]    
});



var Stage = mongoose.model('Stage', StageSchema);


module.exports = Stage;