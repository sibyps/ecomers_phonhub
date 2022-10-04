const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    productname:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    stock:{
        type:String,
    },
    brand:{
        type:String,
    },
    offer:{
        type:Number,
    },
    short:{
        type:String,
    },
    Description:{
        type:String,
        require:true,
       
    },
    image:{
        type:Array,
        require:true,
    }
   

}) 
const product=mongoose.model("product",productSchema)

module.exports=product