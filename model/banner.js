const mongoose= require('mongoose');  
const { array } = require('../helpers/multer');

var bannerschema = new mongoose.Schema({
   
    image:{
        type:Array
    }
   
});  
var banner =mongoose.model("banner",bannerschema)
module.exports=banner 