const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    address:[{
         name:String,
         company:String,
         country:String,
         addres:String,
         town:String,
         state:String,
         postcode:Number,
         phone:Number,
         email:String,

    }]
})
const address=mongoose.model("address",addressSchema)

module.exports=address
