const mongoose= require('mongoose');  
const { array } = require('../helpers/multer');

var brandschema = new mongoose.Schema({
    brand:{
        type:String,
        require:true,
    },
    image:{
        type:Array
    }
   
});  
var brand =mongoose.model("brand",brandschema)
module.exports=brand   