
const mongoose= require('mongoose');  

var cartschema =mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    Product:[{
    ItemId: mongoose.Schema.Types.ObjectId,
    Quantity:Number
    }]
    
   
});  
var cartone =mongoose.model("cart",cartschema)
module.exports=cartone   