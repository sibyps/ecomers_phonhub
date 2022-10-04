const mongoose= require('mongoose');  

var couponschema =mongoose.Schema({
    couponcode:String,
    discount:Number,
    brand:String,
    min:Number,
    max:Number,
    expire:String,
    active:{
        type:Boolean,
        default:true,
    }
    
   
});  
var coupon=mongoose.model("coupon",couponschema)
module.exports=coupon   