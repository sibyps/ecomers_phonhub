const mongoose= require('mongoose');  

var wishlistschema =mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    Wishlist:[{
        proid: mongoose.Schema.Types.ObjectId,
       
        }]
    
   
});  
var wish =mongoose.model("wish",wishlistschema)
module.exports=wish  