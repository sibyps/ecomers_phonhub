const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
     firstname:{
        type:String,
        required:true
     },
   mobile:{
      type:String,
      required:true,

   },
     email:{
        type:String,
        required:true,
        uninqe:true
     },
     password:{
        type:String,
        required:true,

     },
     state:{
      type:Boolean,
      default:true,
  }
     
})

const userdb =mongoose.model('user',userSchema)   
module.exports=userdb