const mongoose= require('mongoose');  

var walletschema =mongoose.Schema({
    UserId: mongoose.Schema.Types.ObjectId,
    Balance:{
        type:Number,
        default:1,
    },
    Date:String,
    History:[{
        Debit:Number,
        Orderid: mongoose.Schema.Types.ObjectId,
        Date:String
    }]
    
   
});  
var wallet =mongoose.model("wallet",walletschema)
module.exports=wallet