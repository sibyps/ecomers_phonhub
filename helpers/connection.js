const mongoose =require("mongoose")

const connectdb=async()=>{
    try{
        
        const connect= await mongoose.connect("mongodb+srv://sibyps:sibyps23@cluster0.qxox7bc.mongodb.net/PhoneHub?retryWrites=true&w=majority",{
            useNewUrlParser:true
        })


        console.log(`mongo conected:${connect.connection.host}`);
    }catch(err){
       console.log(err)
       process.exit(1)
    }
 }



 module.exports=connectdb