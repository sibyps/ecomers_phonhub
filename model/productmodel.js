const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    productname: String,
    singlebrand: String,
    price: Number,
    stock: Number,
    offer: Number,
    colors: String,
    os: String,
    primary: String,
    secondary: String,
    size: String,
    reslution: String,
    ram: String,
    internal: String,
    mah: String,
    watt: String,
    short: String,
    description: String,
    image:{
        type:Array,
        require:true,
    }
   

}) 
const product=mongoose.model("product",productSchema)

module.exports=product