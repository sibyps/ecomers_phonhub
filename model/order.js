const mongoose =require("mongoose")

var orderSchema=mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    Address: mongoose.Schema.Types.ObjectId,
    Name:String,
    Singleaddress:String,
    Total:Number,
    Status:String,
    Date:Date,
    Payment:String,
    Product:[],
    Total:Number,
})


const order =mongoose.model('order',orderSchema)   
module.exports=order